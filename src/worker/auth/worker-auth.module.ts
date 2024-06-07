import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkerModel, WorkerSchema } from "@shared/schemas/worker.schema";
import { PassportModule } from "@nestjs/passport";
import { config } from "@shared/config/config";
import { WorkerJwtStrategy } from "@worker/strategies/worker-jwt.strategy";
import { WorkerService } from "@worker/services/worker.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WorkerModel.name, schema: WorkerSchema, collection: "Worker" }]),
    PassportModule,
    JwtModule.register({
      secret: config.get("auth.jwtSecret"),
    }),
  ],
  providers: [WorkerJwtStrategy, WorkerService],
  exports: [],
})
export class WorkerAuthModule {}
