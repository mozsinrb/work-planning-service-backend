import { ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } from "@shared/util/error/error-codes";
import { JwtService } from "@nestjs/jwt";
import { config } from "@shared/config/config";
import { WorkerModel } from "@shared/schemas/worker.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class WorkerAuthGuard extends AuthGuard("worker") {
  constructor(private jwtService: JwtService, @InjectModel(WorkerModel.name) private workerModel: Model<WorkerModel>) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.AUTH.MISSING_TOKEN,
        code: ERROR_CODES.AUTH.MISSING_TOKEN,
        status: STATUS_CODES.UNAUTHORIZED,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.get("auth.jwtSecret"),
      });

      const worker = await this.workerModel.findById(payload.adminId).exec();

      if (!worker) {
        throw new NotFoundException({
          code: ERROR_CODES.WORKER.NOT_FOUND,
          message: ERROR_MESSAGES.WORKER.NOT_FOUND,
          status: STATUS_CODES.NOT_FOUND,
        });
      }
      request["admin"] = worker;
    } catch {
      throw new UnauthorizedException({
        message: ERROR_MESSAGES.AUTH.INVALID_TOKEN,
        code: ERROR_CODES.AUTH.INVALID_TOKEN,
        status: STATUS_CODES.UNAUTHORIZED,
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // @ts-ignore
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
