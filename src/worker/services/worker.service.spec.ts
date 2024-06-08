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
  let mockSave: jest.Mock;
  let mockWorkerModel: jest.Mock & {
    find: jest.Mock;
    findOne: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(async () => {
    mockSave = jest.fn().mockResolvedValue({
      _id: "123",
      email: "test@example.com",
      fullName: "Test User",
      password: "hashedPassword",
    });

    // @ts-ignore
    mockWorkerModel = jest.fn().mockImplementation(function (this: any, data: any) {
      Object.assign(this, data);
      this.save = mockSave;
    });

    mockWorkerModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    mockWorkerModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    mockWorkerModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

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
  });

  describe("createWorker", () => {
    it("should successfully create a new worker", async () => {
      const createWorkerDto: CreateWorkerDto = {
        email: "test@example.com",
        password: "Password123",
        fullName: "Test User",
      };

      const result = await service.createWorker(createWorkerDto);
      expect(result).toBeDefined();
      expect(result.email).toBe(createWorkerDto.email);
      expect(result.fullName).toBe(createWorkerDto.fullName);
      expect(result.password).toBe("hashedPassword");
      expect(mockWorkerModel).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "hashedPassword",
        fullName: "Test User",
      });
    });

    it("should throw if the email already exists", async () => {
      mockWorkerModel.findOne.mockReturnValueOnce({
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
      };
      mockWorkerModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(workerData),
      });

      const result = await service.findWorkerById("123");
      expect(result).toEqual(workerData);
    });

    it("should throw a NotFoundException if worker not found", async () => {
      mockWorkerModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findWorkerById("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("checkIfEmailAlreadyExists", () => {
    it("should not throw if email does not exist", async () => {
      mockWorkerModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.checkIfEmailAlreadyExists("new@example.com")).resolves.toBeUndefined();
    });

    it("should throw a ConflictException if email already exists", async () => {
      mockWorkerModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ email: "existing@example.com" }),
      });

      await expect(service.checkIfEmailAlreadyExists("existing@example.com")).rejects.toThrow(ConflictException);
    });

    it("should return an array of all workers", async () => {
      mockWorkerModel.find().exec.mockResolvedValue([
        { id: "1", fullName: "Alice", email: "alice@example.com", shifts: ["1", "2"] },
        { id: "2", fullName: "Bob", email: "bob@example.com", shifts: ["1", "2"] },
      ]);

      const result = await service.getAllWorkers();
      expect(result).toEqual([
        { id: "1", fullName: "Alice", email: "alice@example.com", shifts: ["1", "2"] },
        { id: "2", fullName: "Bob", email: "bob@example.com", shifts: ["1", "2"] },
      ]);
      expect(mockWorkerModel.find).toBeCalled();
      expect(mockWorkerModel.find().exec).toBeCalled();
    });
  });
});
