/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { loginResponse } from './interfaces/login-response';
import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto } from './dto/index';

@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
    ) {}

  async create( createUserDto: CreateUserDto) {
    
    try{
      
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password,10),
        ...userData
      });

      await newUser.save();
  
      const { password:_, ...user } = newUser.toJSON();

      return  user; 
      
    } catch (error) {
        if( error.code === 11000 ) {
            throw new BadRequestException(`${createUserDto.email} already exists!`);
        }
        throw new InternalServerErrorException('Something terrible happen!!');
    };
  }

  async register( registerDto: RegisterUserDto ){

    const user = await this.create( registerDto )

    return {
      user: user,
      token: this.getJwToken({ id: user._id}),
    }
  }

  async login( loginDto: LoginDto ): Promise<loginResponse> {

    const { email, password } = loginDto;

    const user = await this.userModel.findOne({email});

    if( !user ){
      throw new UnauthorizedException('Not valid credentials - email');
    }
    
    if( !bcryptjs.compareSync( password, user.password ) ){
      throw new UnauthorizedException('Not valid credentials - pass');
    }

    const { password:_, ...rest } = user.toJSON();

    return { 
      user: rest,
      token: this.getJwToken({ id: user.id}),
    };
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload )
    return token;
  }
}
