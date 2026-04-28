import { IsEmail, IsString, Length } from 'class-validator';

export class DelegateLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 12)
  dni!: string;
}
