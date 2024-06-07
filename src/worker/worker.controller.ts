import { Body, Controller, Post } from "@nestjs/common";
import { WorkerService } from "@worker/services/worker.service";
import { CreateWorkerDto } from "@worker/request/create-worker.dto";
import { ResponseWorkerDto } from "@worker/response/response-worker.dto";
import { WorkerMapper } from "@worker/worker.mapper";

@Controller("workers")
export class WorkerController {
  constructor(private readonly workerService: WorkerService, private readonly workerMapper: WorkerMapper) {}

  @Post()
  async createWorker(@Body() createWorkerDTO: CreateWorkerDto): Promise<ResponseWorkerDto> {
    return this.workerMapper.mapWorkerModelWorker(await this.workerService.createWorker(createWorkerDTO));
  }
}
