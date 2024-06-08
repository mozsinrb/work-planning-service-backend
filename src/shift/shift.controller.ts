import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { ShiftMapper } from "./shift.mapper";
import { ShiftService } from "./services/shift.service";
import { CreateShiftDto } from "./request/create-shift.dto";
import { ResponseShiftDto } from "./response/response-shift.dto";
import { WorkerAuthGuard } from "@shared/auth/guards/worker-jwt-auth.guard";

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

  @Get(":id")
  async getShiftById(@Param("id") id: string): Promise<ResponseShiftDto> {
    const shift = await this.shiftService.getShiftById(id);
    return this.shiftMapper.mapShiftModelShift(shift);
  }
}
