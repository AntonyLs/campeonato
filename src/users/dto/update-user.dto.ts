import { IsEmail, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombres?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido_paterno?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido_materno?: string;

  @IsOptional()
  @IsString()
  @Length(8, 12)
  dni?: string;

  @IsOptional()
  @IsString()
  @Length(9, 20)
  celular?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
