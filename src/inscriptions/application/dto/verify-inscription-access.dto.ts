import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyInscriptionAccessDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @Length(8, 12)
  dni!: string;
}
