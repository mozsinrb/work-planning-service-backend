import { Module } from "@nestjs/common";
import { MongooseModule } from "@shared/util/modules/MongooseModule";

@Module({
  imports: [MongooseModule],
  exports: [MongooseModule],
})
export class SharedModule {}
