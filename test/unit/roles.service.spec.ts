import { RoleEnum } from '../../src/common/enums/index.js';
import { RbacValidator } from '../../src/security/rbac.validator.js';
import { RoleChangeUnauthorizedException } from '../../src/common/exceptions/auth.exceptions.js';

describe('RoleChange Rules (T022, T023)', () => {
  const validator = new RbacValidator();

  it('should deny role change by alumno', () => {
    expect(() => validator.validateRoleChange(RoleEnum.ALUMNO)).toThrow(RoleChangeUnauthorizedException);
  });

  it('should deny role change by admin', () => {
    expect(() => validator.validateRoleChange(RoleEnum.ADMIN)).toThrow(RoleChangeUnauthorizedException);
  });

  it('should deny role change by usuario', () => {
    expect(() => validator.validateRoleChange(RoleEnum.USUARIO)).toThrow(RoleChangeUnauthorizedException);
  });

  it('should allow role change by superadmin', () => {
    expect(() => validator.validateRoleChange(RoleEnum.SUPERADMIN)).not.toThrow();
  });

  it('should define 4 roles', () => {
    const roles = Object.values(RoleEnum);
    expect(roles).toHaveLength(4);
    expect(roles).toContain('usuario');
  });
});
