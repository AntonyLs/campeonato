import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePlayerDto {
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
  @MaxLength(50)
  nro_colegiatura?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(100)
  edad?: number;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  foto_url?: string;
}
