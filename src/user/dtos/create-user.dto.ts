import { IsDefined, IsEmail, IsString, MinLength, minLength } from "class-validator";

export class CreateUser {
    @IsDefined()
    @IsString()
    @MinLength(2)    
    name: string;
    
    @IsDefined()
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)    
    password: string;
}


export type UpdateUser = Partial<CreateUser>;