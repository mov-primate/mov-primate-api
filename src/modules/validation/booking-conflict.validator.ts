import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingRepository } from '../bookings/infrastructure/booking.repository.js';
import { BookingConflictException } from '../../common/exceptions/business.exceptions.js';

@Injectable()
export class BookingConflictValidator {
  constructor(private readonly bookingRepository: BookingRepository) {}

  // T008, T014: Overlap and duplicate prevention
  async validate(studentId: Types.ObjectId, slotStart: Date, slotEnd: Date): Promise<void> {
    const overlapping = await this.bookingRepository.findOverlapping(studentId, slotStart, slotEnd);
    if (overlapping.length > 0) throw new BookingConflictException();
  }
}
