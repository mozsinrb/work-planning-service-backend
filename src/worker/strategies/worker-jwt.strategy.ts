import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { WorkerService } from "@worker/services/worker.service";
import { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } from "@shared/util/error/error-codes";
import { config } from "@shared/config/config";
import { WorkerModel } from "@shared/schemas/worker.schema";

@Injectable()
export class WorkerJwtStrategy extends PassportStrategy(Strategy, "worker") {
  constructor(private workerService: WorkerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get("auth.jwtSecret"),
    });
  }

  async validate(payload: any): Promise<WorkerModel> {
    console.log("STRATEGY ");
    const { userId } = payload;
    const user = await this.workerService.findWorkerById(userId);
    if (!user) {
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.AUTH.INVALID_TOKEN,
        code: ERROR_CODES.WORKER.UNAUTHORIZED,
        status: STATUS_CODES.UNAUTHORIZED,
      });
    }

    return user;
  }
}
