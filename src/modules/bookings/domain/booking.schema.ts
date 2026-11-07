import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatusEnum } from '../../../common/enums/index.js';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  professorId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  slotStart: Date;

  @Prop({ required: true, type: Date })
  slotEnd: Date;

  @Prop({ type: String, required: true, enum: BookingStatusEnum, default: BookingStatusEnum.PENDIENTE })
  status: BookingStatusEnum;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ studentId: 1, slotStart: 1, slotEnd: 1 });
