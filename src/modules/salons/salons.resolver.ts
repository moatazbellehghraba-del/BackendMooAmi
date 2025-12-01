import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entites/Salon.model';
import { FilteredSalonsResponse } from './entites/filtered-salons.response';
import { ServiceType } from '../services/entities/services.types';
import { ServicesService } from '../services/services.service';
import { Employee } from '../employees/entities/employee.types';
import { EmployeesService } from '../employees/employees.service';
import { EmployeeDetails } from '../employees/entities/employeeDetails.types';

@Resolver(() => Salon)
export class SalonsResolver {
  constructor(private readonly EmployeeService: EmployeesService,private readonly salonsService: SalonsService , private readonly servicesService: ServicesService) {}

  @Mutation(() => Salon)
  createSalon(@Args('createSalonInput') createSalonInput: CreateSalonDto) {
    return this.salonsService.create(createSalonInput);
  }

  @Query(() => [Salon], { name: 'salons' })
  findAll() {
    return this.salonsService.findAll();
  }

  @Query(() => Salon, { name: 'salon' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.salonsService.findOne(id);
  }

  @Mutation(() => Salon)
  updateSalon(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateSalonInput') updateSalonInput: UpdateSalonDto,
  ) {
    return this.salonsService.update(id, updateSalonInput);
  }

  @Mutation(() => Salon)
  removeSalon(@Args('id', { type: () => ID }) id: string) {
    return this.salonsService.remove(id);
  }

  @Query(() => [Salon], { name: 'nearbySalons' })
  findNearby(
    @Args('lat', { type: () => Number }) lat: number,
    @Args('long', { type: () => Number }) long: number,
    @Args('maxDistanceKm', { type: () => Number, nullable: true, defaultValue: 50 }) maxDistanceKm: number,
  ) {
    return this.salonsService.findNearby(lat, long, maxDistanceKm);
  }
@Query(() => FilteredSalonsResponse, { name: 'filteredSalons' })
async findFilteredSalons(
  @Args('cities', { type: () => [String], nullable: true }) cities?: string[],
  @Args('serviceTypes', { type: () => [String], nullable: true }) serviceTypes?: string[],
  @Args('salonType', { type: () => String, nullable: true }) salonType?: 'MALE' | 'FEMALE' | 'EVERYONE',
  @Args('priceRange', { type: () => [String], nullable: true }) priceRange?: ('BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY')[],
  @Args('lat', { type: () => Number, nullable: true }) lat?: number,
  @Args('long', { type: () => Number, nullable: true }) long?: number,
  @Args('maxDistanceKm', { type: () => Number, nullable: true, defaultValue: 10 }) maxDistanceKm?: number,
  @Args('sortBy', { type: () => String, nullable: true, defaultValue: 'TOP_RATED' }) sortBy?: 'TOP_RATED' | 'NEAREST' | 'PRICE_LOW_TO_HIGH' | 'MOST_POPULAR',
  @Args('limit', { type: () => Number, nullable: true, defaultValue: 25 }) limit?: number,
  @Args('page', { type: () => Number, nullable: true, defaultValue: 1 }) page?: number,
): Promise<FilteredSalonsResponse> {
  return this.salonsService.findFilteredSalons({
    cities,
    serviceTypes,
    salonType,
    priceRange,
    lat,
    long,
    maxDistanceKm,
    sortBy,
    limit,
    page,
  });
}

    // 🔹 Add this resolver field
  @ResolveField(() => Boolean)
  async isOpenNow(@Parent() salon: Salon): Promise<boolean> {
    // Get the full salon document with methods
    const salonDoc = await this.salonsService.findOne(salon._id.toString());
    return (salonDoc as any).isOpenNow();
  }
  
 
//   @ResolveField(() => [ServiceType], { name: 'services' })
// async services(@Parent() salon: Salon) {
//   // convert salon._id to ObjectId to match DB type
//   const services = await this.servicesService.findBySalonId(salon._id.toString());

//   // map Theservice to ServiceType
//   return services.map((s) => ({
    
//     name: s.name,
//     description: s.description,
//     duration: s.duration,
//     price: s.price,
//     category: s.category,
//     employees: s.employees?.map(e => e.toString()) || [],
//     homeService: s.homeService,
//     image: s.image
  
//   }));
// }
  @ResolveField(() => [ServiceType], { name: 'servicesDetails' })
async servicesDetails(@Parent() salon: Salon): Promise<ServiceType[]> {
  const services = await this.servicesService.findBySalonId(salon._id.toString());
  
  return services.map((service: any) => ({
    _id: service._id.toString(),
    salon_id: service.salon_id.toString(),
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
    category: service.category,
    employees: service.employees?.map((e: any) => e.toString()) || [],
    homeService: service.homeService,
    image: service.image,
    createdAt: service.createdAt, // ✅ Add this
    updatedAt: service.updatedAt  // ✅ Add this
  }));
}
   @ResolveField(()=>[Employee], {name:'employeesDetails'}) 
   async employeesDetails(@Parent() salon:Salon) : Promise<EmployeeDetails[]> {
    const Employees = await this.EmployeeService.findEmployeeofsalon(salon._id.toString())
    return Employees.map((Employee : any)=>({
      _id: Employee._id.toString() , 
      firstName :Employee.firstName ,
      lastName : Employee.lastName , 
      
    }))
   }

}