import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BookingDecision extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;

  @Prop({ type: String, required: true })
  decision: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  decidedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  decidedAt: Date;

  @Prop({ type: String })
  reason?: string;
}

export const BookingDecisionSchema = SchemaFactory.createForClass(BookingDecision);
