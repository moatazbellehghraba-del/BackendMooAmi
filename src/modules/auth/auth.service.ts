import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as  bcrypt from 'bcrypt'
import { ClientsService } from '../clients/clients.service';
import { ConfigService } from '@nestjs/config';
import { CreateClientInput } from '../clients/dto/create-client.dto';
import { VerficationCodeService } from '../verification-code/verfication-code.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
   
    constructor(private ClientService: ClientsService ,private jwtService: JwtService, private verficationCodeSevice:VerficationCodeService , private emailService:EmailService,
    private config: ConfigService){}
    // Old Register .. 
    // async register(createClientInput: CreateClientInput) {
    //     const exists = await this.ClientService.findOneByEmail(createClientInput.email)
    //     if(exists)throw new BadRequestException("Email already is use") ;
    //     const saltRounds = +this.config.get('BCRYPT_SALT_ROUNDS') || 12;
    //     const hashed = await bcrypt.hash(createClientInput.password, saltRounds);
    //     const user= await this.ClientService.create({
    //         ...createClientInput , password:hashed
    //     })
    //     return this.getTokens(user._id.toString(),user.email)

    // }
    async ResendCode(email:string){
      const  exists= await this.ClientService.findOneByEmail(email) 
      if (!exists) throw new BadRequestException("User not found")
      const code = await this.verficationCodeSevice.generateCode(email)
      // send new verfication email code ..... 
      await this.emailService.sendVerificationCode(email,code)
      return {message:'Verfication email sent'}

    }
    async register(createClientInput :CreateClientInput) {
        const exists= await this.ClientService.findOneByEmail(createClientInput.email)
        if (exists) throw new BadRequestException("Email already in use")
         const saltRounds = +this.config.get('BCRYPT_SALT_ROUNDS') || 12;
        const hashed = await bcrypt.hash(createClientInput.password, saltRounds);
        // Crée un objet Mongoose séparé, pas le DTO
  const userData = {
    ...createClientInput,
    password: hashed,
    isVerified: false, // ✅ ici on peut mettre isVerified
  };
        const user= await this.ClientService.create(userData)
        // Generate OTP code 
        const code = await this.verficationCodeSevice.generateCode(
            user.email
        )
        // Send Email ... 
        await this.emailService.sendVerificationCode(user.email, code)
        return {message:'Verfication email sent '}
    }
    async verifyEmail(email:string, code :string) {
      const valid = await this.verficationCodeSevice.verifyCode(email,code);
      if(!valid) throw new BadRequestException("Invalid or expired code ") ;
      /// Mark user verified 
    //   const user= await this.ClientService.findOneByEmail(email);
    //   if (!user) throw new BadRequestException('User not found')
    //   user.isVerified=true ;
    //   await user.save()

      const user = await this.ClientService.findbyEmailandVerfieeacount(email)
      if (!user) throw new BadRequestException('User not found')
      const tokens= await this.getTokens(user._id.toString(),user.email)
      const hashedRefresh = await bcrypt.hash(tokens.refreshToken, +this.config.get('BCRYPT_SALT_ROUNDS') || 12);
      await this.ClientService.setCurrentRefreshToken(hashedRefresh , user._id.toString()) ;
      return tokens 
    }
    async login(email:string , password:string) {
        const user= await this.ClientService.validateUserPassword(email,password);
        if(!user) throw new UnauthorizedException('Invalid credentials') ;
        if (!user.isVerified) {
  throw new UnauthorizedException('Please verify your email before logging in');
}
        const tokens= await this.getTokens(user._id.toString(),user.email)
        // Store hased refresh Token 
        const hashedRefresh = await bcrypt.hash(tokens.refreshToken, +this.config.get('BCRYPT_SALT_ROUNDS') || 12);
        await this.ClientService.setCurrentRefreshToken(hashedRefresh , user._id.toString()) ;
        return tokens

    }
    async logout(userId:string) {
        await this.ClientService.removeRefreshToken(userId)
        return true
    }
    async refreshTokens(userId:string , refreshToken:string) {
        const user= await this.ClientService.findById(userId)
        if (!user || !user.currentHashedRefreshToken) throw new UnauthorizedException();
        const refreshMatches = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
        if (!refreshMatches) throw new UnauthorizedException();
        const tokens = await this.getTokens(user._id.toString(), user.email);
        const newHashed = await bcrypt.hash(tokens.refreshToken, +this.config.get('BCRYPT_SALT_ROUNDS') || 12);
         await this.ClientService.setCurrentRefreshToken(newHashed, userId)
         return tokens
    }
    async getTokens(userId:string , email:string) {
        const payload={sub:userId , email}
         const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRATION') || '15m',
    });
    const refreshToken = await this.jwtService.signAsync({ sub: userId }, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRATION') || '7d',
    });
    return { accessToken, refreshToken };
    }
    async getCurrentUser(userId:string) {
        return this.ClientService.findById(userId)
    }
}
