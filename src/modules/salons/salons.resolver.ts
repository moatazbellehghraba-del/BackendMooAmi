import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entites/Salon.model';
import { FilteredSalonsResponse } from './entites/filtered-salons.response';

@Resolver(() => Salon)
export class SalonsResolver {
  constructor(private readonly salonsService: SalonsService) {}

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
}