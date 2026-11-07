import { Injectable } from '@nestjs/common';
import { CancellationWindowException } from '../../common/exceptions/business.exceptions.js';

@Injectable()
export class CancellationWindowValidator {
  // T029: Cancellation window 1hr
  validate(slotStart: Date): void {
    const oneHourMs = 60 * 60 * 1000;
    if (slotStart.getTime() - Date.now() < oneHourMs) {
      throw new CancellationWindowException();
    }
  }
}
