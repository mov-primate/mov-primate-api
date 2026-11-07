import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceRepository } from '../infrastructure/attendance.repository.js';
import { RbacValidator } from '../../../security/rbac.validator.js';
import { RoleEnum, AttendanceStatusEnum } from '../../../common/enums/index.js';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly rbacValidator: RbacValidator,
  ) {}

  // T030: Register attendance (admin/superadmin)
  async updateAttendance(bookingId: Types.ObjectId, studentId: Types.ObjectId, status: AttendanceStatusEnum, actorId: Types.ObjectId, actorRole: RoleEnum) {
    this.rbacValidator.validateBookingAction(actorRole, 'update_attendance');
    return this.attendanceRepository.upsert(bookingId, studentId, status, actorId);
  }

  // T031: Aggregate attended count per student
  async getAttendedCount(studentId: Types.ObjectId): Promise<number> {
    return this.attendanceRepository.countAttended(studentId);
  }

  // T031: All attendance (superadmin)
  async getAllAttendance() {
    return this.attendanceRepository.findAll();
  }
}
