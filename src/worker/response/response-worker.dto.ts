import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ResponseShiftDto } from "../../shift/response/response-shift.dto";

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
  shifts?: ResponseShiftDto[];
}
