import { Injectable } from "@nestjs/common";
import { WorkerModel } from "@shared/schemas/worker.schema";
import { ResponseWorkerDto } from "@worker/response/response-worker.dto";

@Injectable()
export class WorkerMapper {
  mapWorkerModelWorker(worker: WorkerModel): ResponseWorkerDto {
    return {
      id: worker.id,
      fullName: worker.fullName,
      email: worker.email,
      shifts: worker.shifts ? worker.shifts.map(shift => shift.worker.fullName) : [],
    };
  }
}
