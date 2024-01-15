/* eslint-disable prettier/prettier */
import { MinLength, IsEmail, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}
