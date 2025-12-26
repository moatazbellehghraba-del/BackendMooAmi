import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from 'src/schemas/Client.schema';
import { CreateClientInput } from './dto/create-client.dto';
import { UpdateClientInput } from './dto/update-client.dto';
import { ClientEntity } from './entities/Client.model';
import * as bcrypt  from 'bcryptjs'
import { VerficationCodeService } from '../verification-code/verfication-code.service';
import { EmailService } from '../email/email.service';
import { CloudinaryService, UploadedFile } from '../shared/cloudinary/cloudinary.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) public clientModel: Model<ClientDocument>, private cloudinaryService:CloudinaryService,private  verficationCodeSevice: VerficationCodeService , private emailService : EmailService
  ) {}

  //______________________________________ ✅ Create a new client___________________________________________
 async create(createClientInput: CreateClientInput): Promise<ClientDocument> {
  const { email, phoneNumber, location ,password } = createClientInput;

  // Check for duplicates
  const existingClient = await this.clientModel.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (existingClient) {
    throw new BadRequestException('Client with this email or phone already exists');
  }
 
  const createdClient = new this.clientModel({
    ...createClientInput, bookings:[] ,reviews:[],// store the hased password .. 

    // location will be passed directly from the input
    // no need to manually create location object anymore
  });
 
  return createdClient.save();

  
}

  // ______________________________________________✅ Get all clients______________________________________________
  async findAll(): Promise<Client[]> {
    return this.clientModel.find().sort({ createdAt: -1 }).exec();
  }

  // ______________________________________________✅ Get client by ID
  async findById(id: string): Promise<ClientDocument> {
    const client = await this.clientModel.findById(id)
    .populate('bookings')  // <-- add this
   // .populate('reviews')   // <-- add this
    .exec();
    if (!client) throw new NotFoundException(`Client with ID ${id} not found`);
    return client;
  }

  // ✅ __________________________________________Find by email____________________________________________________
  async findOneByEmail(email: string): Promise<ClientDocument| null> {
    return this.clientModel.findOne({ email }).exec();
  }

  //______________________________________________ ✅ Find by phone_____________________________________________________
  async findOneByPhone(phone: string): Promise<Client | null> {
    return this.clientModel.findOne({ phoneNumber: phone }).exec();
  }
  async findbyEmailandVerfieeacount(email:string):Promise<ClientDocument | null> {
    const user = await this.clientModel.findOneAndUpdate({
      email
    }, {isVerified:true} , {new:true})
    if (!user) throw new BadRequestException('User not found');
    return user
  }

  //_____________________________________________ ✅ Update client_____________________________________________________________

async update(ClientId:string ,updateClientInput: UpdateClientInput): Promise<Client> {
  const {  password, location, ...updateData } = updateClientInput;

  const client = await this.clientModel.findById(ClientId);
  if (!client) throw new NotFoundException(`Client not found`);

  // If location is provided in the update, assign it directly
  if (location !== undefined) {
    updateData['location'] = location;
  }
  if (password){
    updateData['password']= await bcrypt.hash(password,10)
  }

  Object.assign(client, updateData);
  return client.save();}
  // -----------------------------------------add Client Profile Image ..................//
 async updateProfileImage(userId: string, file: UploadedFile) {
    try {
      const user = await this.clientModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.profileImageId) {
        try {
          await this.cloudinaryService.deleteImage(user.profileImageId);
        } catch (error) {
          console.warn('Could not delete old image:', error.message);
        }
      }

      const { url, publicId } = await this.cloudinaryService.uploadImage(
        file,
        `users/${userId}/profile`,
      );

      const updatedUser = await this.clientModel.findByIdAndUpdate(
        userId,
        {
          profilePhoto: url,
          profileImageId: publicId,
          updatedAt: new Date(),
        },
        { new: true },
      );

      return {success:true , message:"image updated"}
    } catch (error) {
      throw new Error(`Failed to update profile image: ${error.message}`);
    }
  }
  // ---------------------------------------Delete the Profile Image ---------------------------------------//
  async deleteProfileImage(userId:string){
    try{
         const user = await this.clientModel.findById(userId)
         if(!user){
          throw new Error('User not found ') 
         }
         // Check if user has a profile image to delete 
         if (!user.profileImageId ||!user.profilePhoto) {
          throw new Error('No profile image found to delete')
         }
         // Delete From Cloudinary ...... 
         await this.cloudinaryService.deleteImage(user.profileImageId)
         // update user document to remove image references ... 
         const updateUser = await this.clientModel.findByIdAndUpdate(
          userId ,
          {
            profilePhoto : null ,
            profileImageId : null ,
            updatedAt: new Date(),
          }
         )
    }catch(error) {
      throw new Error(`Failed to delete profile image: ${error.message}`)
    }
  }
  // ---------------------------------------update the Eamil of client ____________________________//

async updateEmail(ClientId:string , email:string){
  const client = await this.clientModel.findById(ClientId) 
  if (!client) throw new NotFoundException('Client not found') ;
  await this.clientModel.findByIdAndUpdate(ClientId,{pendingEmail:email} )
  const code = await this.verficationCodeSevice.generateCode(email)
  await this.emailService.sendVerificationCode(email,code)

  return { success:true ,message:'Verfication email send'}
}
async VerifyTheUpdatedEmail(email:string , code:string) {
  const valid =await this.verficationCodeSevice.verifyCode(email,code) ;

  if(!valid) throw new BadRequestException("Invalid or expired Code") ;
  const user = await this.clientModel.findOneAndUpdate({
pendingEmail:email},{email:email , pendingEmail:null})
  if (!user) throw new BadRequestException("User not found") 

    return {success:true , message: 'logs in again with new email'}
}

  // ___________________________________________✅ Delete client_______________________________________________________
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
  //________________________________________________________________________________________________________
  async setVerfication(userId:String , codeHash:String,expires:Date) {
    return this.clientModel.findByIdAndUpdate(userId,{
      verificationCodeHash:codeHash ,
      verificationExpires:expires ,
      isVerified:false ,

    },{new:true}).exec()
  }
  //__________________________________________________________________________________________________________________
  async clearVerfication(userId:string){
    return this.clientModel.findByIdAndUpdate(userId,{
      verificationCodeHash:null ,
      verificationExpires:null ,
      isVerified:true,
    },{new:true}).exec()
  }
}
