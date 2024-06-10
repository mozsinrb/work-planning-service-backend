import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { WorkerModel } from "@shared/schemas/worker.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ERROR_CODES, ERROR_MESSAGES, STATUS_CODES } from "@shared/util/error/error-codes";
import { CreateWorkerDto } from "@worker/request/create-worker.dto";
import { hashPassword } from "@shared/util/util-functions";

@Injectable()
export class WorkerService {
  constructor(@InjectModel(WorkerModel.name) private workerModel: Model<WorkerModel>, private logger: Logger) {}

  async createWorker(createWorkerDto: CreateWorkerDto): Promise<WorkerModel> {
    await this.checkIfEmailAlreadyExists(createWorkerDto.email);

    const newWorker = new this.workerModel({
      password: hashPassword(createWorkerDto.password),
      fullName: createWorkerDto.fullName,
      email: createWorkerDto.email,
    });

    return newWorker.save();
  }

  async findWorkerById(id: string): Promise<WorkerModel> {
    const worker = await this.workerModel.findById(id).populate("shifts").exec();
    if (!worker) {
      throw new NotFoundException({
        message: ERROR_MESSAGES.WORKER.NOT_FOUND,
        code: ERROR_CODES.WORKER.NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      });
    }
    return worker;
  }

  async checkIfEmailAlreadyExists(email: string): Promise<void> {
    const worker = await this.workerModel.findOne({ email: email.toLowerCase() }).exec();
    if (worker) {
      this.logger.debug(`Worker email already exists: ${worker.email}`);
      throw new ConflictException({
        message: ERROR_MESSAGES.EMAIL.EMAIL_ALREADY_USED,
        code: ERROR_CODES.WORKER.EMAIL_ALREADY_USED,
        status: STATUS_CODES.CONFLICT,
      });
    }
  }

  async getAllWorkers(): Promise<WorkerModel[]> {
    return this.workerModel.find().populate("shifts").exec();
  }
}
