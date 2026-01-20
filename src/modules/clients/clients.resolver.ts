import { Resolver, Query, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { ClientEntity } from './entities/Client.model';
import { ClientsService } from './clients.service';
import { CreateClientInput } from './dto/create-client.dto';
import {UpdateClientInput} from './dto/update-client.dto'
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

export interface JwtUser {
  id: string;
  email: string;
}
@ObjectType()
export class UpdateEmailResponse {
  @Field()
  success: boolean;
  @Field()
  message: string;
}
@Resolver(()=>ClientEntity)
export class ClientsResolver {
    constructor(private readonly clientService: ClientsService ){}
  
    // ____________________________get all the Clientss 
    @Query(() => [ClientEntity], { name: 'clients' })
  async findAll() {
    return this.clientService.findAll()
  }
  //______________________________ 🟢 Get one client by ID
  @Query(() => ClientEntity, { name: 'clientbyid', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.clientService.findById(id);
  }
    // ____________________________🟢 Get one client by email____________________________________________________
  @Query(() => ClientEntity, { name: 'clientbyemail', nullable: true })
  async findOnebyemail(@Args('email', { type: () => String }) email: string) {
    return this.clientService.findOneByEmail(email);
  }
 //  ______________________________🟢 Create a client_____________________________________________________________
  @Mutation(() => ClientEntity)
  async createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
  ) {
    return this.clientService.create(createClientInput);
  }
   // _____________________________🟢 Update a client_________________________________________________________________
  
  @Mutation(() => ClientEntity)
  @UseGuards(GqlAuthGuard)
  async updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
    @CurrentUser() user: JwtUser , // from token
  ) {
    
    return this.clientService.update(user.id, updateClientInput);
  }
  // ____________________________________ Update email of the Client ______________________________________//
  @Mutation(()=>UpdateEmailResponse)
   @UseGuards(GqlAuthGuard)
   async updateClientEmail(
    @Args('ClientId') ClientId:string , @Args('email') email :string
   ){
    return this.clientService.updateEmail(ClientId , email)
   }
   
    
  // 
   @Mutation(()=>UpdateEmailResponse)
    @UseGuards(GqlAuthGuard)
   async verifyUpdatedEmail(@Args('email') email:string , @Args('code') code : string) {
     return this.clientService.VerifyTheUpdatedEmail(email ,code)
   }
   //____________________________________Update the profile imgae of the client _______________________________________//
  @Mutation(()=>UpdateEmailResponse)
  @UseGuards(GqlAuthGuard)
  async updateProfileImage( @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args('userId') userId: string)
  {
       try {
         const { createReadStream, filename, mimetype } = await file;
      
      const stream = createReadStream();
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const buffer = Buffer.concat(chunks);

      const uploadFile = {
        buffer,
        originalname: filename || 'profile.jpg',
        mimetype: mimetype || 'image/jpeg',
        size: buffer.length,
      };

      return this.clientService.updateProfileImage(userId, uploadFile);
      
       }catch(error){
        throw new Error(`Upload failed: ${error.message}`)
       }
  }
  // _______________________________________Delete the image of the Clinet _____________________________//
   @Mutation(()=>UpdateEmailResponse)
  @UseGuards(GqlAuthGuard)
  async deleteProfileImage(@Args('userId') userId: string){
    try{
      return await this.clientService.deleteProfileImage(userId)
    }catch(error) {
      throw new Error(`Failed to delete profile image: ${error.message}`)
    }
  }
  //___________________________________ 🟢 Delete a client
  @Mutation(() => Boolean)
  async removeClient(@Args('id', { type: () => String }) id: string) {
    return this.clientService.remove(id);
  }
}
