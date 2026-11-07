import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookingDecision } from '../domain/booking-decision.schema.js';

@Injectable()
export class BookingDecisionRepository {
  constructor(@InjectModel(BookingDecision.name) private readonly model: Model<BookingDecision>) {}

  async create(data: Partial<BookingDecision>): Promise<BookingDecision> {
    return this.model.create(data);
  }

  async findByBooking(bookingId: Types.ObjectId): Promise<BookingDecision[]> {
    return this.model.find({ bookingId }).sort({ decidedAt: -1 }).exec();
  }

  async findAll(): Promise<BookingDecision[]> {
    return this.model.find().sort({ decidedAt: -1 }).exec();
  }
}
