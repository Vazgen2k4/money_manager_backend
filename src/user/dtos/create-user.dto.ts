import { IsEmail, IsString, MinLength, minLength } from "class-validator";

export class CreateUser {
    @IsString()
    @MinLength(2)    
    name: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)    
    password: string;
}


export type UpdateUser = Partial<CreateUser>;