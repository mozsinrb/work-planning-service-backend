import { Module } from "@nestjs/common";
import { MongooseModule } from "@shared/util/modules/MongooseModule";
import { WorkerAuthModule } from "@worker/auth/worker-auth.module";

@Module({
  imports: [MongooseModule, WorkerAuthModule],
  exports: [MongooseModule, WorkerAuthModule],
})
export class SharedModule {}
