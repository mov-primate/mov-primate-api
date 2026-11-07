import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../../../common/enums/index.js';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, enum: RoleEnum, default: RoleEnum.USUARIO })
  role: RoleEnum;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  deactivatedAt?: Date;

  @Prop({ type: String })
  deactivatedBy?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
