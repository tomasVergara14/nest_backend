/* eslint-disable prettier/prettier */
export interface JwtPayload {
    _id?: string;
    id: string;
    iat?: number;
    exp?: number;
}