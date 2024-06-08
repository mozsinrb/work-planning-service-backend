import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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

  @Get()
  async getAllWorkers(): Promise<ResponseWorkerDto[]> {
    const workers = await this.workerService.getAllWorkers();
    return workers.map(worker => this.workerMapper.mapWorkerModelWorker(worker));
  }

  @Get(":id")
  async getWorkerById(@Param("id") id: string): Promise<ResponseWorkerDto> {
    const worker = await this.workerService.findWorkerById(id);
    return this.workerMapper.mapWorkerModelWorker(worker);
  }
}
