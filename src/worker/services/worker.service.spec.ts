import { Test, TestingModule } from "@nestjs/testing";
import { WorkerService } from "./worker.service";
import { getModelToken } from "@nestjs/mongoose";
import { ConflictException, Logger, NotFoundException } from "@nestjs/common";
import { WorkerModel } from "@shared/schemas/worker.schema";
import { CreateWorkerDto } from "@worker/request/create-worker.dto";

jest.mock("@shared/util/util-functions", () => ({
  hashPassword: jest.fn(() => "hashedPassword"),
}));

describe("WorkerService", () => {
  let service: WorkerService;
  let model: any;

  beforeEach(async () => {
    const mockWorkerModel = {
      new: jest.fn(),
      constructor: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      create: jest.fn().mockImplementation(dto => {
        return {
          ...dto,
          save: jest.fn().mockResolvedValue(dto),
        };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: getModelToken(WorkerModel.name),
          useValue: mockWorkerModel,
        },
        {
          provide: Logger,
          useValue: { debug: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
    model = module.get(getModelToken(WorkerModel.name));
  });

  describe("createWorker", () => {
    // it("should successfully create a new worker", async () => {
    //   const createWorkerDto: CreateWorkerDto = {
    //     email: "test@example.com",
    //     password: "Password123",
    //     fullName: "Test User",
    //   };
    //
    //   model.findOne.mockReturnValueOnce({
    //     exec: jest.fn().mockResolvedValue(null),
    //   });
    //
    //   const result = await service.createWorker(createWorkerDto);
    //   expect(result).toBeDefined();
    //   expect(result.email).toBe(createWorkerDto.email);
    //   expect(result.fullName).toBe(createWorkerDto.fullName);
    //   expect(result.password).toBe("hashedPassword");
    // });

    it("should throw if the email already exists", async () => {
      model.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ email: "test@example.com" }),
      });
      const createWorkerDto: CreateWorkerDto = {
        email: "test@example.com",
        password: "Password123",
        fullName: "Test User",
      };

      await expect(service.createWorker(createWorkerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe("findWorkerById", () => {
    it("should return a worker if found", async () => {
      const workerData = {
        _id: "123",
        email: "test@example.com",
        fullName: "Test User",
        password: "hashedPassword",
        shifts: [],
      };
      model.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(workerData),
      });

      const result = await service.findWorkerById("123");
      expect(result).toEqual(workerData);
    });

    it("should throw a NotFoundException if worker not found", async () => {
      model.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findWorkerById("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("getAllWorkers", () => {
    it("should return an array of all workers", async () => {
      const workers = [
        { id: "1", fullName: "Alice", email: "alice@example.com", shifts: ["1", "2"] },
        { id: "2", fullName: "Bob", email: "bob@example.com", shifts: ["1", "2"] },
      ];
      model.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(workers),
      });

      const result = await service.getAllWorkers();
      expect(result).toEqual(workers);
    });
  });
});
