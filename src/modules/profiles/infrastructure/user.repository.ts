import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/user.schema.js';
import { RoleEnum } from '../../../common/enums/index.js';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(email: string): Promise<User> {
    return this.userModel.create({ email, role: RoleEnum.USUARIO });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateRole(id: string, role: RoleEnum): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
  }

  async deactivate(id: string, deactivatedBy: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(
      id,
      { isActive: false, deactivatedAt: new Date(), deactivatedBy },
      { new: true },
    ).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
