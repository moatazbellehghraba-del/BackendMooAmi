import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { VericationDocument, VerifcationCodesch } from "src/schemas/VerficationCode.schema";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerficationCodeService {
    constructor(
        @InjectModel(VerifcationCodesch.name) public verficationModel: Model<VericationDocument>,
         private config: ConfigService
    ){    }
    async generateCode(email:string):Promise<string>{
        const code =Math.floor(100000 + Math.random()*900000).toString();
        const expMinutes= this.config.get("verificationCodeExpMin")
        const expiresIn = new Date(Date.now()+expMinutes *60*1000);
        // Save to Db 
        await this.verficationModel.findOneAndUpdate(
            {email},
            {code,expiresIn},
            {upsert:true},
        )
        return code ; 
    }
    async verifyCode(email:string , code :string):Promise<boolean>{
        const record = await this.verficationModel.findOne({email}) ;
        if (!record) return false ;
        if (record.code!==code) return false ;
        if(record.expiresAt<new Date()) return false 
        // delete after succes 
        await this.verficationModel.deleteOne({email})
        return true
    }
}