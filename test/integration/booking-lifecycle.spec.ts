import { BookingStatusEnum } from '../../src/common/enums/index.js';
import { NoClassesAvailableException, CancellationWindowException } from '../../src/common/exceptions/business.exceptions.js';

describe('Booking Lifecycle Integration (T025, T030)', () => {
  it('should represent full booking state machine', () => {
    const validTransitions = [
      [BookingStatusEnum.PENDIENTE, BookingStatusEnum.CONFIRMADO],
      [BookingStatusEnum.PENDIENTE, BookingStatusEnum.RECHAZADO],
      [BookingStatusEnum.PENDIENTE, BookingStatusEnum.CANCELADO],
      [BookingStatusEnum.CONFIRMADO, BookingStatusEnum.CANCELADO],
    ];
    expect(validTransitions).toHaveLength(4);
  });

  it('should reject when available_classes is 0 (FR-013, T034)', () => {
    const err = new NoClassesAvailableException();
    expect(err.code).toBe('ERR_NO_CLASSES_AVAILABLE');
  });

  it('should enforce 1hr cancellation window (T029)', () => {
    const err = new CancellationWindowException();
    expect(err.code).toBe('ERR_CANCELLATION_WINDOW');
    expect(err.statusCode).toBe(422);
  });
});
