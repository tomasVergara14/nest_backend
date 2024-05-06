/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ){}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if(!token){
      throw new UnauthorizedException('there is no bearer token')
    }

    try{
      
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findByUserId( payload.id );
      
      if( !user ) throw new UnauthorizedException('User does not exist')
      if( !user.isActive ) throw new UnauthorizedException('User is not active')

      request['user'] = payload.id;

    } catch(error){

    }


    return Promise.resolve(true);  
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
