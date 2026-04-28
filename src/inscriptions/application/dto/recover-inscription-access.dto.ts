import { IsEmail, IsString, Length } from 'class-validator';

export class RecoverInscriptionAccessDto {
  @IsString()
  @Length(8, 12)
  dni!: string;

  @IsEmail()
  email!: string;
}
