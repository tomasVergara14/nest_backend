/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { User } from "../entities/user.entity";

export interface loginResponse{
    user: User;
    token: string;
}