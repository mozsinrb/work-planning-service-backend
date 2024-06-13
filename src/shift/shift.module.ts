import { Logger, Module } from "@nestjs/common";
import { ShiftController } from "./shift.controller";
import { ShiftService } from "./services/shift.service";
import { ShiftMapper } from "./shift.mapper";
import { SharedModule } from "@shared/shared.module";
import { WorkerService } from "@worker/services/worker.service";

@Module({
  imports: [SharedModule],
  controllers: [ShiftController],
  providers: [ShiftService, WorkerService, ShiftMapper, Logger],
})
export class ShiftModule {}
