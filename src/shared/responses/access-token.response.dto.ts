import { IsString } from "class-validator";

export class AccessTokenResponseDto {
  @IsString()
  accessToken: string;
}
