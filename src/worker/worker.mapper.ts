import { Injectable } from "@nestjs/common";
import { WorkerModel } from "@shared/schemas/worker.schema";
import { ResponseWorkerDto } from "@worker/response/response-worker.dto";
import { ShiftMapper } from "../shift/shift.mapper";

@Injectable()
export class WorkerMapper {
  constructor(private readonly shiftMapper: ShiftMapper) {}

  mapWorkerModelWorker(worker: WorkerModel): ResponseWorkerDto {
    return {
      id: worker.id,
      fullName: worker.fullName,
      email: worker.email,
      shifts: worker.shifts ? worker.shifts.map(this.shiftMapper.mapShiftModelShift) : [],
    };
  }
}
