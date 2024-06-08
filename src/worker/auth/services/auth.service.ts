import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { WorkerModel } from "@shared/schemas/worker.schema";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } from "@shared/util/error/error-codes";
import { AccessTokenResponseDto } from "@shared/responses/access-token.response.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class WorkerAuthService {
  constructor(
    @InjectModel(WorkerModel.name) private workerModel: Model<WorkerModel>,
    private logger: Logger,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AccessTokenResponseDto> {
    const worker = await this.validateEntityByEmailAndPassword(email.toLowerCase(), password);

    return {
      accessToken: this.jwtService.sign({ workerId: worker.id }),
    };
  }

  private async validateEntityByEmailAndPassword(email: string, password: string): Promise<WorkerModel> {
    const worker = await this.getWorkerByEmail(email.toLowerCase());

    if (!worker) {
      this.logger.debug(`Authorization failed, email ${email} does not exist.`);
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.WORKER.BAD_CREDENTIALS,
        code: ERROR_CODES.WORKER.BAD_CREDENTIALS,
        status: STATUS_CODES.UNAUTHORIZED,
      });
    }
    if (!bcrypt.compareSync(password, worker.password)) {
      this.logger.debug(`Authorization failed, password does not match for user: ${email}.`);
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.WORKER.BAD_CREDENTIALS,
        code: ERROR_CODES.WORKER.BAD_CREDENTIALS,
        status: STATUS_CODES.UNAUTHORIZED,
      });
    }

    return worker;
  }

  private async getWorkerByEmail(email: string): Promise<WorkerModel> {
    return this.workerModel.findOne({ email }).exec();
  }
}
