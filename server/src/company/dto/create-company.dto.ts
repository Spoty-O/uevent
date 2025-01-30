import { IsEmail, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
