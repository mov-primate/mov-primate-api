import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingStatusEnum } from '../common/enums/index.js';

@Injectable()
export class NotificationEventService {
  // T033: Emit email notification events on booking status change
  emitStatusChange(bookingId: Types.ObjectId, status: BookingStatusEnum): void {
    console.log('[NotificationEvent]', { bookingId, status, timestamp: new Date() });
  }
}
