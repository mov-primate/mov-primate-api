import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleChange } from '../domain/role-change.schema.js';
import { RoleEnum } from '../../../common/enums/index.js';

@Injectable()
export class RoleChangeRepository {
  constructor(@InjectModel(RoleChange.name) private readonly model: Model<RoleChange>) {}

  async create(userId: Types.ObjectId, fromRole: RoleEnum, toRole: RoleEnum, changedBy: Types.ObjectId, reason?: string): Promise<RoleChange> {
    return this.model.create({ userId, fromRole, toRole, changedBy, reason });
  }

  async findByUser(userId: Types.ObjectId): Promise<RoleChange[]> {
    return this.model.find({ userId }).sort({ changedAt: -1 }).exec();
  }

  async findAll(): Promise<RoleChange[]> {
    return this.model.find().sort({ changedAt: -1 }).exec();
  }
}
