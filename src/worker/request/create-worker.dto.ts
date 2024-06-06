import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateWorkerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
