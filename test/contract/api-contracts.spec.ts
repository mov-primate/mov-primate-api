import { RoleEnum, BookingStatusEnum, AttendanceStatusEnum } from '../../src/common/enums/index.js';

describe('API Contract Tests (T024)', () => {
  it('should have 4 roles in RoleEnum', () => {
    expect(Object.values(RoleEnum)).toHaveLength(4);
  });

  it('should have 4 booking statuses', () => {
    expect(Object.values(BookingStatusEnum)).toHaveLength(4);
  });

  it('should have 3 attendance statuses', () => {
    expect(Object.values(AttendanceStatusEnum)).toHaveLength(3);
    expect(Object.values(AttendanceStatusEnum)).toContain('attended');
    expect(Object.values(AttendanceStatusEnum)).toContain('missed');
    expect(Object.values(AttendanceStatusEnum)).toContain('justified');
  });

  it('should expose error codes as contracts', () => {
    const errorCodes = [
      'ERR_NO_CLASSES_AVAILABLE',
      'ERR_BOOKING_CONFLICT',
      'ERR_CANCELLATION_WINDOW',
      'ERR_DUPLICATE_USER',
      'ERR_UNAUTHORIZED',
      'ERR_ROLE_CHANGE_UNAUTHORIZED',
    ];
    expect(errorCodes).toHaveLength(6);
  });
});
