import { Controller } from "@nestjs/common";
import { WorkerService } from "@worker/services/worker.service";

@Controller("workers")
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}
}
