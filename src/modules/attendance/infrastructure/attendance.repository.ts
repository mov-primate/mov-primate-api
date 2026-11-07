import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance } from '../domain/attendance.schema.js';
import { AttendanceStatusEnum } from '../../../common/enums/index.js';

@Injectable()
export class AttendanceRepository {
  constructor(@InjectModel(Attendance.name) private readonly model: Model<Attendance>) {}

  async upsert(bookingId: Types.ObjectId, studentId: Types.ObjectId, status: AttendanceStatusEnum, updatedBy: Types.ObjectId): Promise<Attendance> {
    return this.model.findOneAndUpdate(
      { bookingId },
      { bookingId, studentId, status, updatedBy },
      { upsert: true, new: true },
    ).exec() as Promise<Attendance>;
  }

  async countAttended(studentId: Types.ObjectId): Promise<number> {
    return this.model.countDocuments({ studentId, status: AttendanceStatusEnum.ATTENDED }).exec();
  }

  async findAll(): Promise<Attendance[]> {
    return this.model.find().exec();
  }
}
