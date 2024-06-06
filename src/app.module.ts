import { Module } from "@nestjs/common";

import { WorkerModule } from "./worker/worker.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [WorkerModule, SharedModule],
})
export class AppModule {}
