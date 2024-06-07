import { Module } from "@nestjs/common";

import { WorkerService } from "./services/worker.service";
import { WorkerController } from "@worker/worker.controller";
import { SharedModule } from "@shared/shared.module";
import { WorkerAuthModule } from "@worker/auth/worker-auth.module";

@Module({
  imports: [SharedModule, WorkerAuthModule],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
