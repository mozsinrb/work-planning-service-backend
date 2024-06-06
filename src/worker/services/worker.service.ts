import { Injectable, NotFoundException } from "@nestjs/common";
import { WorkerModel } from "@shared/schemas/worker.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } from "@shared/util/error/error-codes";

@Injectable()
export class WorkerService {
  constructor(@InjectModel(WorkerModel.name) private workerModel: Model<WorkerModel>) {}

  async findWorkerById(id: string): Promise<WorkerModel> {
    const worker = await this.workerModel.findById(id).exec();
    if (!worker) {
      throw new NotFoundException({
        message: ERROR_MESSAGES.WORKER.NOT_FOUND,
        code: ERROR_CODES.WORKER.NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      });
    }
    return worker;
  }
}
