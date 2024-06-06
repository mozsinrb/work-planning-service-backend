import { Module } from "@nestjs/common";

import { WorkerService } from "./services/worker.service";
import { WorkerController } from "@worker/worker.controller";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
