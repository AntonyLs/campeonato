import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
