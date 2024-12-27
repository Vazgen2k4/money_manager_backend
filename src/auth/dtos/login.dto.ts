import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LogInDto {
  @IsDefined()
  @IsEmail()
  email: string;
  
  @IsDefined()
  @IsString()
  password: string;
}



