import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { WorkerModel } from "@shared/schemas/worker.schema";

@Schema({ timestamps: true })
export class ShiftModel extends Document {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  startHour: number;

  @Prop({ required: true })
  endHour: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "WorkerModel" })
  worker: WorkerModel;
}

export const ShiftSchema = SchemaFactory.createForClass(ShiftModel);
