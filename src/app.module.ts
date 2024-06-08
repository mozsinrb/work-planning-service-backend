import { Module } from "@nestjs/common";

import { WorkerModule } from "./worker/worker.module";
import { SharedModule } from "./shared/shared.module";
import { ShiftModule } from './shift/shift.module';

@Module({
  imports: [WorkerModule, SharedModule, ShiftModule],
})
export class AppModule {}
