import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Theservice, TheserviceDocument } from 'src/schemas/Theservice.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SalonsService } from '../salons/salons.service';

@Injectable()
export class ServicesService {
    constructor(@InjectModel(Theservice.name) private serviceModel : Model<TheserviceDocument> , 
    private readonly salonService: SalonsService
   ){}
    // "##################################################Create a new service "################################"......
 async create(createServiceDto: CreateServiceDto): Promise<Theservice> {
   
    try {
        // Verify the salon exists
        const salon = await this.salonService.findOne(createServiceDto.salon_id);
      
        if (!salon) {
            throw new NotFoundException(`Salon with ID ${createServiceDto.salon_id} not found`);
        }

        // Create service data - use simple object without manual _id
        const serviceData: any = {
            name: createServiceDto.name,
            description: createServiceDto.description,
            duration: createServiceDto.duration,
            price: createServiceDto.price,
            category: createServiceDto.category,
            salon_id: new Types.ObjectId(createServiceDto.salon_id),
            homeService: createServiceDto.homeService || false,
        };

        // Add optional fields if provided
        if (createServiceDto.image) {
            serviceData.image = createServiceDto.image;
        }

        if (createServiceDto.employees && createServiceDto.employees.length > 0) {
            serviceData.employees = createServiceDto.employees.map(id => new Types.ObjectId(id));
        }

        
        // Create and save the service
        const newService = new this.serviceModel(serviceData);
       
        
        const savedService = await newService.save();
       

        // Add The Service to salon's services array
        await this.salonService.addServiceToSalon(
            createServiceDto.salon_id,
            savedService._id.toString()
        );
        
        
        return savedService;
        
    } catch (error) {
        
        throw new InternalServerErrorException(
            `Failed to create service: ${error.message}`
        );
    }
  }

    // Find all services (with optional filters)
  async findAll(): Promise<Theservice[]> {
    return this.serviceModel.find().populate('employees salon_id').exec();
  }

  // Find a service by ID
  async findOne(id: string): Promise<Theservice> {
    const service = await this.serviceModel.findById(id).populate('employees salon_id');
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }
   /// Find by salon id 
    async findBySalonId(salonId: string): Promise<Theservice[]> {
    if (!Types.ObjectId.isValid(salonId))
      throw new NotFoundException('Invalid salon ID');
    return this.serviceModel.find({ salon_id: new Types.ObjectId(salonId) }).exec();
}
  

  // #################################################### Update a service ###################################################

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Theservice> {
  
  try {
    // Prepare update data
    const updateData: any = { ...updateServiceDto };
    
    // Convert string IDs to ObjectIds if employees are provided
    if (updateServiceDto.employees) {
      updateData.employees = updateServiceDto.employees.map(
        empId => new Types.ObjectId(empId)
      );
    }
    
    // Find and update the service
    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, updateData, { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      })
      
      .exec();
    
    if (!updatedService) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    
    
    return updatedService;
    
  } catch (error) {
    
    throw new InternalServerErrorException(`Failed to update service: ${error.message}`);
  }
}

  //##################################################### Delete a service #####################################################
async remove(id: string): Promise<Theservice> {
 
  
  try {
    // First, find the service to get salon_id
    const service = await this.serviceModel.findById(id);
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    
    const salonId = service.salon_id.toString();
  
    // Delete the service from database
    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deletedService) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    
    // Remove the service ID from salon's services array
    await this.salonService.removeServiceFromSalon(salonId, id);
    
    
    return deletedService;
    
  } catch (error) {
   
    throw new InternalServerErrorException(`Failed to delete service: ${error.message}`);
  }
}
//_________________________________________________________________________________________________________________________________________
// ############################################### ADD An Employee to The list of Employees ###############################################
async addEmployeeToService(serviceId: string, employeeId: string): Promise<Theservice> {
  
    try {
        const updatedService = await this.serviceModel.findByIdAndUpdate(
            serviceId,
            { 
                $addToSet: {  // $addToSet prevents duplicates
                    employees: new Types.ObjectId(employeeId) 
                } 
            },
            { new: true } // this mean to return the updated document after the operation ... 

        ).exec();

        if (!updatedService) {
            throw new NotFoundException(`Service with id ${serviceId} not found`);
        }

        
        return updatedService;
        
    } catch (error) {
       
        throw new InternalServerErrorException(`Failed to add employee to service: ${error.message}`);
    }
}
//___________________________________________________________________________________________________________
//#######################################Remove Employee id form Employeeee ########################
async removeEmployeeFromService(serviceId: string, employeeId: string): Promise<Theservice> {
    
    
    try {
        const updatedService = await this.serviceModel.findByIdAndUpdate(
            serviceId,
            { 
                $pull: { 
                    employees: new Types.ObjectId(employeeId) 
                } 
            },
            { new: true }
        ).exec();

        if (!updatedService) {
            throw new NotFoundException(`Service with id ${serviceId} not found`);
        }

        
        return updatedService;
        
    } catch (error) {
       
        throw new InternalServerErrorException(`Failed to remove employee from service: ${error.message}`);
    }
}

}
