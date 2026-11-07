import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoleEnum } from '../../../common/enums/index.js';

@Schema({ timestamps: true })
export class RoleChange extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: RoleEnum })
  fromRole: RoleEnum;

  @Prop({ type: String, required: true, enum: RoleEnum })
  toRole: RoleEnum;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  changedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  changedAt: Date;

  @Prop({ type: String })
  reason?: string;
}

export const RoleChangeSchema = SchemaFactory.createForClass(RoleChange);
