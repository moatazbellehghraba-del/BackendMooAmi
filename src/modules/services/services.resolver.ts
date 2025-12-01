import { Args, ID, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ServicesService } from './services.service';
import { ServiceType } from './entities/services.types';
import { Theservice } from 'src/schemas/Theservice.schema';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';


@Resolver(()=>ServiceType)
export class ServicesResolver {
    constructor(private readonly serviceService: ServicesService) {}
    // ✅ ############################################CREATE SERVICE#################################################
  @Mutation(() => ServiceType)
  async createService(
    @Args('createServiceDto') createServiceDto: CreateServiceDto,
  ): Promise<Theservice> {
    return this.serviceService.create(createServiceDto);
  }

  // ✅ ############################################GET ALL SERVICES#####################################
  @Query(() => [ServiceType])
  async getAllServices(): Promise<Theservice[]> {
    return this.serviceService.findAll();
  }

  // ✅ GET ONE SERVICE BY ID
  @Query(() => ServiceType)
  async getServiceById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Theservice> {
    return this.serviceService.findOne(id);
  }

  // ✅ ############################################ UPDATE SERVICE ######################################
 @Mutation(() => ServiceType)
async updateService(
  @Args('id') id: string,
  @Args('updateServiceDto') updateServiceDto: UpdateServiceDto,
): Promise<Theservice> {
  return this.serviceService.update(id, updateServiceDto);
}
  // get by salon id 
  // Test query: get all services for a salon
  @Query(() => [ServiceType], { name: 'servicesBySalonId' })
  async getServicesBySalon(
    @Args('salonId', { type: () => ID }) salonId: string,
  ): Promise<Theservice[]> {
    return this.serviceService.findBySalonId(salonId);
  }

  // ✅############################################### DELETE SERVICE #######################################
  @Mutation(() => ServiceType)
  async deleteService(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Theservice> {
    return this.serviceService.remove(id);
  }
}
