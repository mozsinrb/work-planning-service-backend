import { Logger, Module } from "@nestjs/common";

import { WorkerService } from "./services/worker.service";
import { WorkerController } from "@worker/worker.controller";
import { SharedModule } from "@shared/shared.module";
import { WorkerAuthModule } from "@worker/auth/worker-auth.module";
import { WorkerMapper } from "@worker/worker.mapper";

@Module({
  imports: [SharedModule, WorkerAuthModule],
  controllers: [WorkerController],
  providers: [WorkerService, Logger, WorkerMapper],
})
export class WorkerModule {}
