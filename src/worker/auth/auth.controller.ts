import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "@worker/auth/request/login.dto";
import { WorkerAuthService } from "@worker/auth/services/auth.service";
import { AccessTokenResponseDto } from "@shared/responses/access-token.response.dto";

@Controller("auth")
export class WorkerAuthController {
  constructor(private workerAuthService: WorkerAuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<AccessTokenResponseDto> {
    return this.workerAuthService.login(loginDto.email, loginDto.password);
  }
}
