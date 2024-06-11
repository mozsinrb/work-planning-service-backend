import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ShiftModel } from "@shared/schemas/shift.schema";
import { WorkerService } from "@worker/services/worker.service";
import { CreateShiftDto } from "../request/create-shift.dto";
import { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } from "@shared/util/error/error-codes";
import { WorkerModel } from "@shared/schemas/worker.schema";

@Injectable()
export class ShiftService {
  constructor(
    @InjectModel(ShiftModel.name) private shiftModel: Model<ShiftModel>,
    @InjectModel(WorkerModel.name) private workerModel: Model<WorkerModel>,
    private workerService: WorkerService,
  ) {}

  async createShift(createShiftDto: CreateShiftDto): Promise<ShiftModel> {
    const worker = await this.workerService.findWorkerById(createShiftDto.workerId);

    const existingShift = await this.shiftModel
      .findOne({
        worker: worker._id,
        date: createShiftDto.date,
      })
      .exec();

    if (existingShift) {
      throw new ConflictException({
        message: ERROR_MESSAGES.SHIFT.ALREADY_ASSIGNED,
        code: ERROR_CODES.SHIFT.ALREADY_ASSIGNED,
        status: STATUS_CODES.CONFLICT,
      });
    }

    const endHour = createShiftDto.startHour + 8;

    const newShift = new this.shiftModel({
      worker: createShiftDto.workerId,
      date: createShiftDto.date,
      startHour: createShiftDto.startHour,
      endHour,
    });

    const savedShift = await newShift.save();

    await this.workerModel
      .findByIdAndUpdate(createShiftDto.workerId, {
        $push: { shifts: savedShift._id },
      })
      .exec();

    return savedShift;
  }

  async getAllShifts(): Promise<ShiftModel[]> {
    return this.shiftModel.find().exec();
  }

  async deleteShift(id: string): Promise<ShiftModel> {
    const shift = await this.shiftModel.findById(id).exec();
    if (!shift) {
      throw new NotFoundException({
        message: ERROR_MESSAGES.SHIFT.NOT_FOUND,
        code: ERROR_CODES.SHIFT.NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      });
    }

    await this.workerModel
      .findByIdAndUpdate(shift.worker, {
        $pull: { shifts: shift._id },
      })
      .exec();

    return this.shiftModel.findByIdAndDelete(id).exec();
  }

  async getShiftById(id: string): Promise<ShiftModel> {
    const shift = await this.shiftModel.findById(id).exec();
    if (!shift) {
      throw new NotFoundException({
        message: ERROR_MESSAGES.SHIFT.NOT_FOUND,
        code: ERROR_CODES.SHIFT.NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      });
    }
    return shift;
  }
}
