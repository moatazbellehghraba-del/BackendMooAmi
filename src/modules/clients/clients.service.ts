import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/Client.schema';
import { CreateClientInput } from './dto/create-client.dto';
import { UpdateClientInput } from './dto/update-client.dto';
import * as bcrypt  from 'bcryptjs'
@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) public clientModel: Model<ClientDocument>,
  ) {}

  // ✅ Create a new client
 async create(createClientInput: CreateClientInput): Promise<Client> {
  const { email, phoneNumber, location ,password } = createClientInput;

  // Check for duplicates
  const existingClient = await this.clientModel.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (existingClient) {
    throw new BadRequestException('Client with this email or phone already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdClient = new this.clientModel({
    ...createClientInput, bookings:[] ,reviews:[], password : hashedPassword ,// store the hased password .. 

    // location will be passed directly from the input
    // no need to manually create location object anymore
  });

  return createdClient.save();
}

  // ✅ Get all clients
  async findAll(): Promise<Client[]> {
    return this.clientModel.find().sort({ createdAt: -1 }).exec();
  }

  // ✅ Get client by ID
  async findById(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id)
    .populate('bookings')  // <-- add this
   // .populate('reviews')   // <-- add this
    .exec();
    if (!client) throw new NotFoundException(`Client with ID ${id} not found`);
    return client;
  }

  // ✅ Find by email
  async findOneByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email }).exec();
  }

  // ✅ Find by phone
  async findOneByPhone(phone: string): Promise<Client | null> {
    return this.clientModel.findOne({ phoneNumber: phone }).exec();
  }

  // ✅ Update client

async update(updateClientInput: UpdateClientInput): Promise<Client> {
  const { id, password, location, ...updateData } = updateClientInput;

  const client = await this.clientModel.findById(id);
  if (!client) throw new NotFoundException(`Client with ID ${id} not found`);

  // If location is provided in the update, assign it directly
  if (location !== undefined) {
    updateData['location'] = location;
  }
  if (password){
    updateData['password']= await bcrypt.hash(password,10)
  }

  Object.assign(client, updateData);
  return client.save();
}

  // ✅ Delete client
  async remove(id: string): Promise<boolean> {
    const result = await this.clientModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Client with ID ${id} not found`);
    return true ;
  }
  async setCurrentRefreshToken(hashed:string , userId:string) {
    await this.clientModel.findByIdAndUpdate(userId,{currentHashedRefreshToken:hashed})
  }
  async removeRefreshToken(userId:string){
    await this.clientModel.findByIdAndUpdate(userId,{currentHashedRefreshToken:null})
  }
  async validateUserPassword(email:string , plain:string){
    const user = await this.findOneByEmail(email);
    if(!user) return null ;
    const valid= await bcrypt.compare(plain, user.password)
    if(!valid) return null ; 
    return user ;
  }
}
