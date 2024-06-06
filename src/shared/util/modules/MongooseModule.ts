import { Module } from "@nestjs/common";
import { MongooseModule as BaseMongooseModule } from "@nestjs/mongoose";

import { WorkerModel, WorkerSchema } from "@shared/schemas/worker.schema";
import { ShiftModel, ShiftSchema } from "@shared/schemas/shift.schema";
import { config } from "@shared/config/config";

@Module({
  imports: [
    BaseMongooseModule.forRoot(config.get("db.url")),
    BaseMongooseModule.forFeature([
      { name: WorkerModel.name, schema: WorkerSchema, collection: "Worker" },
      { name: ShiftModel.name, schema: ShiftSchema, collection: "Shift" },
    ]),
  ],
  exports: [BaseMongooseModule],
})
export class MongooseModule {}
