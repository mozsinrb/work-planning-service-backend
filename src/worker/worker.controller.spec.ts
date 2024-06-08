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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkerController],
      providers: [
        {
          provide: WorkerService,
          useValue: {
            getAllWorkers: jest.fn().mockResolvedValue([
              { id: "1", fullName: "John Doe", email: "john@example.com", shifts: [] },
              { id: "2", fullName: "Jane Doe", email: "jane@example.com", shifts: [] },
            ]),
            createWorker: jest.fn(),
            findWorkerById: jest.fn().mockResolvedValue({
              id: "1",
              fullName: "John Doe",
              email: "john.doe@example.com",
              shifts: [],
            }),
          },
        },
        {
          provide: WorkerMapper,
          useValue: {
            mapWorkerModelWorker: jest.fn(worker => ({
              id: worker.id,
              fullName: worker.fullName,
              email: worker.email,
              shifts: worker.shifts,
            })),
          },
        },
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

  it("should return a list of workers when workers exist", async () => {
    const result = await controller.getAllWorkers();
    const mockWorkers = [
      { id: "1", fullName: "John Doe", email: "john@example.com", shifts: [] },
      { id: "2", fullName: "Jane Doe", email: "jane@example.com", shifts: [] },
    ];

    expect(result).toEqual(mockWorkers);
    expect(service.getAllWorkers).toHaveBeenCalled();
    expect(mapper.mapWorkerModelWorker).toHaveBeenCalledTimes(mockWorkers.length);
  });

  it("should return a worker when a valid ID is provided", async () => {
    const expectedWorker = {
      id: "1",
      fullName: "John Doe",
      email: "john.doe@example.com",
      shifts: [],
    };

    const result = await controller.getWorkerById("1");

    expect(result).toEqual(expectedWorker);
    expect(service.findWorkerById).toHaveBeenCalledWith("1");
    expect(mapper.mapWorkerModelWorker).toHaveBeenCalledWith({
      id: "1",
      fullName: "John Doe",
      email: "john.doe@example.com",
      shifts: [],
    });
  });
});
