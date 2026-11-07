import { Types } from 'mongoose';
import { RoleEnum } from '../../src/common/enums/index.js';
import { CancellationWindowValidator } from '../../src/modules/validation/cancellation-window.validator.js';
import { AvailableClassesValidator } from '../../src/modules/validation/available-classes.validator.js';
import { RbacValidator } from '../../src/security/rbac.validator.js';
import { CancellationWindowException, NoClassesAvailableException } from '../../src/common/exceptions/business.exceptions.js';
import { UnauthorizedException, RoleChangeUnauthorizedException } from '../../src/common/exceptions/auth.exceptions.js';

describe('CancellationWindowValidator (T029)', () => {
  const validator = new CancellationWindowValidator();

  it('should throw when slot starts within 1 hour', () => {
    const slotStart = new Date(Date.now() + 30 * 60 * 1000);
    expect(() => validator.validate(slotStart)).toThrow(CancellationWindowException);
  });

  it('should pass when slot starts more than 1 hour away', () => {
    const slotStart = new Date(Date.now() + 2 * 60 * 60 * 1000);
    expect(() => validator.validate(slotStart)).not.toThrow();
  });
});

describe('AvailableClassesValidator (T013, T034, FR-013)', () => {
  const validator = new AvailableClassesValidator();

  it('should throw NoClassesAvailableException when count is 0', () => {
    expect(() => validator.validate(0)).toThrow(NoClassesAvailableException);
  });

  it('should throw when count is negative', () => {
    expect(() => validator.validate(-1)).toThrow(NoClassesAvailableException);
  });

  it('should pass when count is positive', () => {
    expect(() => validator.validate(3)).not.toThrow();
  });

  it('should have correct error code', () => {
    const err = new NoClassesAvailableException();
    expect(err.code).toBe('ERR_NO_CLASSES_AVAILABLE');
    expect(err.statusCode).toBe(422);
  });
});

describe('RbacValidator (T006, T018, T022)', () => {
  const validator = new RbacValidator();

  it('should deny alumno from approving bookings', () => {
    expect(() => validator.validateBookingAction(RoleEnum.ALUMNO, 'approve')).toThrow(UnauthorizedException);
  });

  it('should deny alumno from rejecting bookings', () => {
    expect(() => validator.validateBookingAction(RoleEnum.ALUMNO, 'reject')).toThrow(UnauthorizedException);
  });

  it('should deny usuario from creating bookings', () => {
    expect(() => validator.validateBookingAction(RoleEnum.USUARIO, 'create')).toThrow(UnauthorizedException);
  });

  it('should allow admin to approve bookings', () => {
    expect(() => validator.validateBookingAction(RoleEnum.ADMIN, 'approve')).not.toThrow();
  });

  it('should deny admin from modifying another professors booking', () => {
    const adminId = new Types.ObjectId();
    const otherId = new Types.ObjectId();
    expect(() => validator.validateAdminScope(RoleEnum.ADMIN, adminId, otherId)).toThrow(UnauthorizedException);
  });

  it('should allow superadmin to modify any booking scope', () => {
    const superadminId = new Types.ObjectId();
    const anyId = new Types.ObjectId();
    expect(() => validator.validateAdminScope(RoleEnum.SUPERADMIN, superadminId, anyId)).not.toThrow();
  });

  it('should deny non-superadmin from changing roles (T022)', () => {
    expect(() => validator.validateRoleChange(RoleEnum.ADMIN)).toThrow(RoleChangeUnauthorizedException);
  });

  it('should allow superadmin to change roles', () => {
    expect(() => validator.validateRoleChange(RoleEnum.SUPERADMIN)).not.toThrow();
  });
});
