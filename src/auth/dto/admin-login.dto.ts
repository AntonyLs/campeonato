import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class AdminLoginDto {
  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  @Length(8, 12)
  dni?: string;

  @ValidateIf((object: AdminLoginDto) => !object.correo && !object.dni)
  @IsString()
  @Length(1, 1, {
    message: 'Debes enviar correo o dni para iniciar sesion.',
  })
  readonly loginIdentifierValidation?: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
