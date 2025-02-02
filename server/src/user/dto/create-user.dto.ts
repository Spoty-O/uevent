import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsStrongPassword({ minLength: 6 })
  password: string;

  @IsString()
  @MaxLength(50)
  username: string;
}
