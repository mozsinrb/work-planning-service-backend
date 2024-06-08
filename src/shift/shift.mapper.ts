import { Injectable } from "@nestjs/common";
import { ShiftModel } from "@shared/schemas/shift.schema";
import { ResponseShiftDto } from "./response/response-shift.dto";

@Injectable()
export class ShiftMapper {
  mapShiftModelShift(shiftModel: ShiftModel): ResponseShiftDto {
    return {
      id: shiftModel.id,
      workerId: shiftModel.worker.toString(),
      date: shiftModel.date,
      startHour: shiftModel.startHour.toString(),
      endHour: shiftModel.endHour.toString(),
    };
  }
}
