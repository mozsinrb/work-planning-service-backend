import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";

import { ShiftMapper } from "./shift.mapper";
import { ShiftService } from "./services/shift.service";
import { CreateShiftDto, IdParamDto } from "./request/create-shift.dto";
import { ResponseShiftDto } from "./response/response-shift.dto";
import { WorkerAuthGuard } from "@shared/auth/guards/worker-jwt-auth.guard";
import { CurrentWorker } from "@shared/util/decorators";
import { WorkerModel } from "@shared/schemas/worker.schema";

@Controller("shifts")
export class ShiftController {
  constructor(private readonly shiftService: ShiftService, private readonly shiftMapper: ShiftMapper) {}

  @UseGuards(WorkerAuthGuard)
  @Post()
  async createShift(@Body() createShiftDto: CreateShiftDto): Promise<ResponseShiftDto> {
    const shift = await this.shiftService.createShift(createShiftDto);
    return this.shiftMapper.mapShiftModelShift(shift);
  }

  @Get()
  async getAllShifts(): Promise<ResponseShiftDto[]> {
    const shifts = await this.shiftService.getAllShifts();
    return shifts.map((shift: any) => this.shiftMapper.mapShiftModelShift(shift));
  }

  @UseGuards(WorkerAuthGuard)
  @Get(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getShiftById(@CurrentWorker() worker: WorkerModel, @Param() params: IdParamDto): Promise<ResponseShiftDto> {
    const shift = await this.shiftService.getShiftById(params.id, worker.id);
    return this.shiftMapper.mapShiftModelShift(shift);
  }

  @UseGuards(WorkerAuthGuard)
  @Delete(":id")
  async deleteShiftById(@CurrentWorker() worker: WorkerModel, @Param("id") id: string): Promise<ResponseShiftDto> {
    const shift = await this.shiftService.deleteShift(id, worker.id);
    return this.shiftMapper.mapShiftModelShift(shift);
  }
}
