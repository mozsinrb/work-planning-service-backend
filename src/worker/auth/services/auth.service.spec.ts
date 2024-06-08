import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { Logger, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { WorkerAuthService } from "@worker/auth/services/auth.service";

describe("WorkerAuthService", () => {
  let service: WorkerAuthService;
  let mockWorker: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerAuthService,
        {
          provide: getModelToken("WorkerModel"),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue("fake_jwt_token") },
        },
        {
          provide: Logger,
          useValue: { log: jest.fn(), error: jest.fn(), debug: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<WorkerAuthService>(WorkerAuthService);
    mockWorker = module.get(getModelToken("WorkerModel"));

    mockWorker.findOne.mockImplementation(({ email }) => ({
      exec: jest.fn(() => {
        if (email === "test@example.com") {
          return Promise.resolve({ id: "1", email: "test@example.com", password: bcrypt.hashSync("Password123", 10) });
        }
        return Promise.resolve(null);
      }),
    }));
  });

  describe("login", () => {
    it("should return a valid JWT token for valid credentials", async () => {
      const email = "test@example.com";
      const password = "Password123";

      const result = await service.login(email, password);
      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe("string");
    });

    it("should throw UnauthorizedException if email does not exist", async () => {
      const email = "nonexistent@example.com";
      const password = "Password123";

      await expect(service.login(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if password is incorrect", async () => {
      const email = "test@example.com";
      const password = "wrong password"; // Ensure the password is actually incorrect

      await expect(service.login(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });
});
