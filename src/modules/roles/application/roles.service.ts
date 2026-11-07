import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RoleChangeRepository } from '../infrastructure/role-change.repository.js';
import { UserRepository } from '../../profiles/infrastructure/user.repository.js';
import { RbacValidator } from '../../../security/rbac.validator.js';
import { RoleEnum } from '../../../common/enums/index.js';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleChangeRepository: RoleChangeRepository,
    private readonly userRepository: UserRepository,
    private readonly rbacValidator: RbacValidator,
  ) {}

  // T021, T022, T023, T028: Role reassignment (superadmin only, with audit)
  async changeRole(
    userId: string,
    newRole: RoleEnum,
    actorRole: RoleEnum,
    actorId: Types.ObjectId,
    reason?: string,
  ) {
    // T022: Only superadmin can change roles
    this.rbacValidator.validateRoleChange(actorRole);

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const fromRole = user.role;

    // Apply role change
    await this.userRepository.updateRole(userId, newRole);

    // T023: Audit log
    const record = await this.roleChangeRepository.create(
      new Types.ObjectId(userId), fromRole, newRole, actorId, reason
    );

    return { userId, fromRole, toRole: newRole, changedAt: record.changedAt };
  }

  // T021: Get role history for user
  async getRoleHistory(userId: string) {
    return this.roleChangeRepository.findByUser(new Types.ObjectId(userId));
  }

  // T020: All role changes (superadmin overview)
  async getAllRoleChanges() {
    return this.roleChangeRepository.findAll();
  }
}
