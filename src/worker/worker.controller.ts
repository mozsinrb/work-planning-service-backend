import { Controller, Get, UseGuards } from "@nestjs/common";
import { WorkerService } from "@worker/services/worker.service";
import { WorkerAuthGuard } from "@shared/auth/guards/worker-jwt-auth.guard";

@Controller("workers")
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get()
  @UseGuards(WorkerAuthGuard)
  async registerUser(): Promise<boolean> {
    return true;
  }
}
