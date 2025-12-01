import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { Salon, SalonDocument } from 'src/schemas/Salon.schema';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { FilteredSalonsResponse } from './entites/filtered-salons.response';

@Injectable()
export class SalonsService {
    constructor(
        @InjectModel(Salon.name) private SalonModel: Model<SalonDocument>,
    ){}
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------- Create Salon -------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    async create(createSalon : CreateSalonDto):Promise<Salon>{
        const {email , phoneNumber , password} =createSalon; 

        // Check if email or phone already exists ...........
        const existing = await this.SalonModel.findOne({
            $or: [{email} , {phoneNumber}] , 
        })
        if (existing) {
            throw new BadRequestException("Email or phone number already exists") ; 

        }
        const hashedPassword = await bcrypt.hash(password,10)
        const salon= new this.SalonModel({
            ...createSalon ,
            password : hashedPassword ,
        })
        return salon.save()
    }
    // -------------------------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------🔹 FIND ALL SALONS----------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------
  async findAll(): Promise<Salon[]> {
    return this.SalonModel.find().populate(['services', 'employees', 'reviews']).exec();
  }

  // -------------------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------- 🔹 FIND ONE SALON BY ID-------------------------------------------------------------
  // -------------------------------------------------------------------------------------------------------------------------------------------
  async findOne(id: string): Promise<Salon> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid salon ID');

    const salon = await this.SalonModel.findById(id)
      //.populate('services')
      //.populate(['services', 'employees', 'reviews'])
      .exec();

    if (!salon) throw new NotFoundException('Salon not found');
    return salon;
  }
  // --------------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------- 🔹 UPDATE SALON--------------------------------------
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  async update(id: string, updateSalonDto: UpdateSalonDto): Promise<Salon> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid salon ID');

    const salon = await this.SalonModel.findById(id);
    if (!salon) throw new NotFoundException('Salon not found');

    // Handle password hashing if password is updated
    if (updateSalonDto.password) {
      updateSalonDto.password = await bcrypt.hash(updateSalonDto.password, 10);
    }

    Object.assign(salon, updateSalonDto);
    return salon.save();
  }

      // --------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------ 🔹 Delete SALON  (Soft delete)
  // -----------------------------------------------------------------------------------------------------------------------------------------
  async remove(id:string):Promise<Salon> {
    if(!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid salon Id');
    const salon = await this.SalonModel.findById(id);
    if(!salon) throw new NotFoundException('Salon not found') ; 

    // Soft delete : set is Active to false 
    salon.isActiveAccount= false ; 
    return salon.save() ; 

    // For hard delete: return this.salonModel.findByIdAndDelete(id).exec();
    
  }
  // 
   // -----------------------------------------------------------------------------------------------------------------------------------
  // ---------------------------------🔹 FIND SALONS NEAR A LOCATION (UPDATED FOR NEW LOCATION STRUCTURE)------------------------------------------------
  // --------------------------------------------------------------------------------------------------------------------------------------
  async findNearby(lat: number, long: number, maxDistanceKm = 50): Promise<Salon[]> {
    // Since we're using simple lat/long now, we'll do a basic distance calculation
    // For more advanced geospatial queries, consider using a geospatial library
    // or implementing a custom distance calculation
    
    const allSalons = await this.SalonModel.find({
      isActiveAccount: true,
      location: { $ne: null } // Only salons with location data
    }).exec();

    // Filter salons within the max distance using Haversine formula
    return allSalons.filter(salon => {
      if (!salon.location) return false;
      
      const distance = this.calculateDistance(
        lat, 
        long, 
        salon.location.lat, 
        salon.location.long
      );
      
      return distance <= maxDistanceKm;
    });
  }
  async addEmployeeToSalon(salon:string, employeeid:string):Promise<Salon> {
    const theSalon = await this.findOne(salon)
    const updatedSalon = await this.SalonModel.findByIdAndUpdate(
      salon , 
      {
        $addToSet : {
          employees: new Types.ObjectId(employeeid)
        }
      },
      {
        new:true
      }
    ).exec()
    if(!updatedSalon){
      throw new NotFoundException("Failed to add Employee to a employees id ")
    }
    return updatedSalon
  }
  //############################################################# Add Service to salon ... add to list of serivces the id 
  async addServiceToSalon(salonId: string, serviceId: string): Promise<Salon> {
    const theSalon = await this.findOne(salonId);
    
    const updatedSalon = await this.SalonModel.findByIdAndUpdate(
      salonId,
      { 
        $addToSet: { 
          services: new Types.ObjectId(serviceId) 
        } 
      },
      { new: true }
    ).exec();

    if (!updatedSalon) {
      throw new NotFoundException(`Failed to add service to user with ID ${salonId}`);
    }

    return updatedSalon;
  }
  // ###############################################################Remove Service Form list of Servicesssssss.....
  async removeServiceFromSalon(salonId: string, serviceId: string): Promise<Salon> {
  console.log('Removing service from salon:', serviceId, 'from salon:', salonId);
  
  const updatedSalon = await this.SalonModel.findByIdAndUpdate(
    salonId,
    { 
      $pull: { 
        services: new Types.ObjectId(serviceId) 
      } 
    },
    { new: true }
  ).exec();

  if (!updatedSalon) {
    throw new NotFoundException(`Failed to remove service from salon with ID ${salonId}`);
  }

  console.log('Service removed from salon successfully');
  return updatedSalon;
}

  // ---------------------------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------🔹 ADVANCED FILTER SEARCH (UPDATED FOR NEW LOCATION STRUCTURE)-----------------------------------------------
  // ---------------------------------------------------------------------------------------------------------------------------------------------
  async findFilteredSalons(filters: {
  cities?: string[];
  serviceTypes?: string[];
  salonType?: 'MALE' | 'FEMALE' | 'EVERYONE';
  priceRange?: ('BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY')[];
  lat?: number;
  long?: number;
  maxDistanceKm?: number;
  sortBy?: 'TOP_RATED' | 'NEAREST' | 'PRICE_LOW_TO_HIGH' | 'MOST_POPULAR';
  limit?: number;
  page?: number; // 🔹 ADDED: Page number for pagination
}) :Promise<FilteredSalonsResponse>{
  const {
    cities,
    serviceTypes,
    salonType,
    priceRange,
    lat,
    long,
    maxDistanceKm = 10,
    sortBy = 'TOP_RATED',
    limit = 25,
    page = 1, // 🔹 ADDED: Default to page 1
  } = filters;

  const query: any = { isActiveAccount: true };

  // 🔸 Calculate skip for pagination
  const skip = (page - 1) * limit;

  // 🔸 CITY FILTER
  if (cities && cities.length > 0) {
    query.$or = cities.map(city => ({
      city: { $regex: new RegExp(city, 'i') }
    }));
  }

  // 🔸 SERVICE TYPES FILTER
  if (serviceTypes && serviceTypes.length > 0) {
    query.serviceTypes = {
      $in: serviceTypes.map(service => new RegExp(service, 'i'))
    };
  }

  // 🔸 SALON TYPE FILTER
  if (salonType && salonType !== 'EVERYONE') {
    query.salonType = salonType;
  }

  // 🔸 PRICE RANGE FILTER
  if (priceRange && priceRange.length > 0) {
    query.priceRange = { $in: priceRange };
  }

  // 🔸 LOCATION FILTER
  if (lat && long && (!cities || cities.length === 0)) {
    const degreeBuffer = maxDistanceKm / 111;
    query['location.lat'] = {
      $gte: lat - degreeBuffer,
      $lte: lat + degreeBuffer
    };
    query['location.long'] = {
      $gte: long - degreeBuffer / Math.cos(lat * Math.PI / 180),
      $lte: long + degreeBuffer / Math.cos(lat * Math.PI / 180)
    };
  }

  // 🔸 QUERY EXECUTION WITH PAGINATION
  let salons = await this.SalonModel
    .find(query)
    .limit(limit * 3) // Get more for filtering
    .skip(skip) // 🔹 ADDED: Skip for pagination
    .exec();

  // 🔸 PRECISE DISTANCE FILTERING
  if (lat && long && (!cities || cities.length === 0)) {
    salons = salons.filter(salon => {
      if (!salon.location) return false;
      const distance = this.calculateDistance(lat, long, salon.location.lat, salon.location.long);
      return distance <= maxDistanceKm;
    });
  }

  // 🔸 SIMPLE SORTING
  switch (sortBy) {
    case 'TOP_RATED':
      salons.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
      
    case 'NEAREST':
      if (lat && long) {
        salons.sort((a, b) => {
          const distA = a.location ? this.calculateDistance(lat, long, a.location.lat, a.location.long) : Infinity;
          const distB = b.location ? this.calculateDistance(lat, long, b.location.lat, b.location.long) : Infinity;
          return distA - distB;
        });
      }
      break;
      
    case 'PRICE_LOW_TO_HIGH':
      salons.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
      break;
      
    case 'MOST_POPULAR':
      salons.sort((a, b) => (b.numberoflikes || 0) - (a.numberoflikes || 0));
      break;
  }

  // 🔸 Return with pagination info
  return {
    salons: salons.slice(0, limit) as any,
    pagination: {
      currentPage: page,
      hasNextPage: salons.length > limit,
      totalResults: salons.length
    }as any 
  };
}

  //----------------------------------------------------------------------------------------------- -----------------------------------------------
  // ---------------------------------------------🔹 CALCULATE DISTANCE USING HAVERSINE FORMULA----------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------------------------
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  // Optional: Add these helper methods to your service
async findOpenSalonsNow(): Promise<Salon[]> {
  const allSalons = await this.SalonModel.find({ 
    isActiveAccount: true 
  }).exec();
  
  return allSalons.filter(salon => (salon as any).isOpenNow());
}

async isSalonOpenNow(salonId: string): Promise<boolean> {
  const salon = await this.SalonModel.findById(salonId).exec();
  if (!salon) throw new NotFoundException('Salon not found');
  
  return (salon as any).isOpenNow();
}

}