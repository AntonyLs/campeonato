import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProfessionalCollegeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  nombre!: string;
}
