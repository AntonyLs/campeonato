import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfessionalCollegeDto {
  @IsOptional()
  @IsString()
  @MaxLength(140)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  abreviatura?: string;
}
