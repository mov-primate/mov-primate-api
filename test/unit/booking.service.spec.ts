import { BookingStatusEnum } from '../../src/common/enums/index.js';
import { NoClassesAvailableException, BookingConflictException, CancellationWindowException } from '../../src/common/exceptions/business.exceptions.js';

describe('Booking Business Rules (T008, T013, T014, T029)', () => {
  it('should define 4 booking states', () => {
    const states = Object.values(BookingStatusEnum);
    expect(states).toHaveLength(4);
    expect(states).toContain('pendiente');
    expect(states).toContain('confirmado');
    expect(states).toContain('rechazado');
    expect(states).toContain('cancelado');
  });

  it('should have ERR_NO_CLASSES_AVAILABLE exception with correct code and status', () => {
    const err = new NoClassesAvailableException();
    expect(err.code).toBe('ERR_NO_CLASSES_AVAILABLE');
    expect(err.statusCode).toBe(422);
  });

  it('should have ERR_BOOKING_CONFLICT exception', () => {
    const err = new BookingConflictException();
    expect(err.code).toBe('ERR_BOOKING_CONFLICT');
    expect(err.statusCode).toBe(409);
  });

  it('should have ERR_CANCELLATION_WINDOW exception', () => {
    const err = new CancellationWindowException();
    expect(err.code).toBe('ERR_CANCELLATION_WINDOW');
    expect(err.statusCode).toBe(422);
  });
});
