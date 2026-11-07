import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from '../domain/booking.schema.js';
import { BookingStatusEnum } from '../../../common/enums/index.js';

@Injectable()
export class BookingRepository {
  constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<Booking>) {}

  async create(data: Partial<Booking>): Promise<Booking> {
    return this.bookingModel.create(data);
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).exec();
  }

  async findOverlapping(studentId: Types.ObjectId, slotStart: Date, slotEnd: Date): Promise<Booking[]> {
    return this.bookingModel.find({
      studentId,
      status: { $in: [BookingStatusEnum.PENDIENTE, BookingStatusEnum.CONFIRMADO] },
      slotStart: { $lt: slotEnd },
      slotEnd: { $gt: slotStart },
    }).exec();
  }

  async updateStatus(id: string, status: BookingStatusEnum): Promise<Booking | null> {
    return this.bookingModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async findByProfessor(professorId: Types.ObjectId, status?: BookingStatusEnum): Promise<Booking[]> {
    const filter: any = { professorId };
    if (status) filter.status = status;
    return this.bookingModel.find(filter).exec();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }

  async findByStudent(studentId: Types.ObjectId): Promise<Booking[]> {
    return this.bookingModel.find({ studentId }).exec();
  }
}
