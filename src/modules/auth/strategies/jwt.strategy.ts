import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ClientsService } from "src/modules/clients/clients.service";
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private cfg:ConfigService , private ClientService : ClientsService){
        super({
              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // GraphQL clients must send "Authorization: Bearer <token>"
      ignoreExpiration: false,
      secretOrKey: cfg.get('JWT_ACCESS_SECRET'),
        })
    }
    async validate(payload :any) {
        // payload.sub is userId 
        const user= await this.ClientService.findById(payload.sub)
        // you can optionally return a minimal user object 
        return {id:payload.sub , email:payload.email }
    }
}