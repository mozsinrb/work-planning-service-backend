import { Test, TestingModule } from "@nestjs/testing";
import { WorkerController } from "./worker.controller";

import { WorkerMapper } from "./worker.mapper";
import { WorkerService } from "@worker/services/worker.service";
import { CreateWorkerDto } from "@worker/request/create-worker.dto";
import { ResponseWorkerDto } from "@worker/response/response-worker.dto";

describe("WorkerController", () => {
  let controller: WorkerController;
  let service: WorkerService;
  let mapper: WorkerMapper;

  beforeEach(async () => {
    const mockWorkerService = {
      createWorker: jest.fn(),
    };

    const mockWorkerMapper = {
      mapWorkerModelWorker: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkerController],
      providers: [
        { provide: WorkerService, useValue: mockWorkerService },
        { provide: WorkerMapper, useValue: mockWorkerMapper },
      ],
    }).compile();

    controller = module.get<WorkerController>(WorkerController);
    service = module.get<WorkerService>(WorkerService);
    mapper = module.get<WorkerMapper>(WorkerMapper);
  });

  describe("createWorker", () => {
    it("should create a worker and return the mapped response", async () => {
      const createWorkerDto: CreateWorkerDto = {
        email: "test@example.com",
        password: "Password123",
        fullName: "Test User",
      };

      const responseWorkerDto: ResponseWorkerDto = {
        id: "123",
        email: "test@example.com",
        fullName: "Test User",
      };

      jest.spyOn(mapper, "mapWorkerModelWorker").mockReturnValue(responseWorkerDto);

      const result = await controller.createWorker(createWorkerDto);

      expect(service.createWorker).toHaveBeenCalledWith(createWorkerDto);
      expect(result).toEqual(responseWorkerDto);
    });
  });
});
