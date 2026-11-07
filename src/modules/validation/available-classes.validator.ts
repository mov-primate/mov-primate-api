import { Injectable } from '@nestjs/common';
import { NoClassesAvailableException } from '../../common/exceptions/business.exceptions.js';

@Injectable()
export class AvailableClassesValidator {
  // T013, T034: FR-013 - reject if available_classes = 0
  validate(availableClasses: number): void {
    if (availableClasses <= 0) {
      throw new NoClassesAvailableException();
    }
  }
}
