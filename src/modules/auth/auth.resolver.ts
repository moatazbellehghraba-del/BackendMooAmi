import { Args, Context, Mutation, Resolver ,Query} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateClientInput } from '../clients/dto/create-client.dto';
import { LoginClientInput } from '../clients/dto/login.clinetinput';
import { access } from 'fs';
import {  UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { ClientEntity } from '../clients/entities/Client.model';
import { TokenResponse } from './dto/token-response.model';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
    constructor(private authservice: AuthService){}
    @Mutation(()=>TokenResponse)
    async register(@Args('input') input:CreateClientInput) {
        const tokens=await this.authservice.register(input) ;
        return tokens
    }
    @Mutation(()=>TokenResponse) 
    async login(@Args('input') input:LoginClientInput) {
        const tokens = await this.authservice.login(input.email , input.password);
        return tokens ;

    }
    @Mutation(()=>TokenResponse)
    async refresh(@Args('userId')userId:string , @Args('refreshToken')refreshToken : string) {
        const tokens = await this.authservice.refreshTokens(userId , refreshToken)
        return tokens;

    }
    @Query(()=>ClientEntity)
    @UseGuards(GqlAuthGuard)
    async me(@CurrentUser() user:any) {
        
        return this.authservice.getCurrentUser(user.id)
    }
}
