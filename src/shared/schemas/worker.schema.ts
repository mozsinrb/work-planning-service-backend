import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { ShiftModel } from "@shared/schemas/shift.schema";

@Schema({ timestamps: true })
export class WorkerModel extends Document {
  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: "ShiftModel" }])
  shifts: ShiftModel;
}

export const WorkerSchema = SchemaFactory.createForClass(WorkerModel);
