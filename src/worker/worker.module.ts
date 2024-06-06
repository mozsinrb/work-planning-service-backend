import { Module } from "@nestjs/common";

import { WorkerService } from "./services/worker.service";
import { WorkerController } from "@worker/worker.controller";

@Module({
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
