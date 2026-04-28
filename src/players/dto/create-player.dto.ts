import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido_paterno!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido_materno!: string;

  @IsString()
  @Length(8, 12)
  dni!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nro_colegiatura?: string;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(100)
  edad?: number;
}
