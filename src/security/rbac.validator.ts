import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../common/enums/index.js';
import { UnauthorizedException, RoleChangeUnauthorizedException } from '../common/exceptions/auth.exceptions.js';
import { Types } from 'mongoose';

type BookingAction = 'create' | 'cancel' | 'approve' | 'reject' | 'move' | 'update_attendance';

@Injectable()
export class RbacValidator {
  // T006, T018: Permission matrix
  validateBookingAction(role: RoleEnum, action: BookingAction): void {
    const forbidden: Partial<Record<RoleEnum, BookingAction[]>> = {
      [RoleEnum.USUARIO]: ['create', 'cancel', 'approve', 'reject', 'move', 'update_attendance'],
      [RoleEnum.ALUMNO]: ['approve', 'reject', 'move', 'update_attendance'],
    };
    if (forbidden[role]?.includes(action)) {
      throw new UnauthorizedException(`Rol '${role}' no puede ejecutar '${action}'`);
    }
  }

  // T018, T019: Admin scope enforcement
  validateAdminScope(role: RoleEnum, actorId: Types.ObjectId, bookingProfessorId: Types.ObjectId): void {
    if (role === RoleEnum.ADMIN && actorId.toString() !== bookingProfessorId.toString()) {
      throw new UnauthorizedException('Admin solo puede modificar reservas donde fue seleccionado como profesor');
    }
  }

  // T022: Only superadmin can change roles
  validateRoleChange(role: RoleEnum): void {
    if (role !== RoleEnum.SUPERADMIN) throw new RoleChangeUnauthorizedException();
  }
}
