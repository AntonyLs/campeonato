import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProfessionalCollegeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  abreviatura!: string;
}
