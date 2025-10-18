import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Client } from './entities/Client.model';
import { ClientsService } from './clients.service';
import { CreateClientInput } from './dto/create-client.dto';
import {UpdateClientInput} from './dto/update-client.dto'

@Resolver(()=>Client)
export class ClientsResolver {
    constructor(private readonly clientService: ClientsService){}
    // get all the Clientss 
    @Query(() => [Client], { name: 'clients' })
  async findAll() {
    return this.clientService.findAll()
  }
  // 🟢 Get one client by ID
  @Query(() => Client, { name: 'clientbyid', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.clientService.findById(id);
  }
    // 🟢 Get one client by email
  @Query(() => Client, { name: 'clientbyemail', nullable: true })
  async findOnebyemail(@Args('email', { type: () => String }) email: string) {
    return this.clientService.findOneByEmail(email);
  }
 //  🟢 Create a client
  @Mutation(() => Client)
  async createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
  ) {
    return this.clientService.create(createClientInput);
  }
   // 🟢 Update a client
  @Mutation(() => Client)
  async updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
  ) {
    
    return this.clientService.update(updateClientInput);
  }
  // 🟢 Delete a client
  @Mutation(() => Boolean)
  async removeClient(@Args('id', { type: () => String }) id: string) {
    return this.clientService.remove(id);
  }
}
