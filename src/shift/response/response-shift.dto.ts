import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResponseShiftDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  workerId: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  startHour: string;

  @IsString()
  @IsNotEmpty()
  endHour: string;
}
