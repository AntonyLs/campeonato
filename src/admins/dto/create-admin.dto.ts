import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  organizador!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @Length(9, 20)
  nro_celular!: string;

  @IsString()
  @Length(8, 12)
  dni!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
