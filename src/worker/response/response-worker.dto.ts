import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ResponseWorkerDto {
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  shifts?: string[];
}
