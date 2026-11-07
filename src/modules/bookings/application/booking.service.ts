import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingRepository } from '../infrastructure/booking.repository.js';
import { BookingDecisionRepository } from '../infrastructure/booking-decision.repository.js';
import { BookingConflictValidator } from '../../validation/booking-conflict.validator.js';
import { CancellationWindowValidator } from '../../validation/cancellation-window.validator.js';
import { AvailableClassesValidator } from '../../validation/available-classes.validator.js';
import { RbacValidator } from '../../../security/rbac.validator.js';
import { BookingStatusEnum, RoleEnum } from '../../../common/enums/index.js';
import { NotificationEventService } from '../../../utils/notification-event.service.js';
import { Booking } from '../domain/booking.schema.js';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookingDecisionRepository: BookingDecisionRepository,
    private readonly conflictValidator: BookingConflictValidator,
    private readonly cancellationValidator: CancellationWindowValidator,
    private readonly availableClassesValidator: AvailableClassesValidator,
    private readonly rbacValidator: RbacValidator,
    private readonly notificationService: NotificationEventService,
  ) {}

  // T012, T013, T014: Create booking (alumno)
  async createBooking(
    studentId: Types.ObjectId,
    professorId: Types.ObjectId,
    slotStart: Date,
    slotEnd: Date,
    actorRole: RoleEnum,
    availableClasses: number,
  ): Promise<Booking> {
    // T006 RBAC
    this.rbacValidator.validateBookingAction(actorRole, 'create');
    // T013/T034 FR-013: available_classes check
    this.availableClassesValidator.validate(availableClasses);
    // T014: Overlap check
    await this.conflictValidator.validate(studentId, slotStart, slotEnd);

    const booking = await this.bookingRepository.create({ studentId, professorId, slotStart, slotEnd, status: BookingStatusEnum.PENDIENTE });

    // T033: Notify on status change
    this.notificationService.emitStatusChange(booking._id as Types.ObjectId, BookingStatusEnum.PENDIENTE);

    return booking;
  }

  // T015: Booking history for student
  async getStudentBookings(studentId: Types.ObjectId): Promise<Booking[]> {
    return this.bookingRepository.findByStudent(studentId);
  }

  // T016, T017: Approve (admin scoped)
  async approveBooking(bookingId: string, actorId: Types.ObjectId, actorRole: RoleEnum): Promise<Booking> {
    this.rbacValidator.validateBookingAction(actorRole, 'approve');
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new Error('Reserva no encontrada');
    this.rbacValidator.validateAdminScope(actorRole, actorId, booking.professorId);

    const updated = await this.bookingRepository.updateStatus(bookingId, BookingStatusEnum.CONFIRMADO);
    await this.bookingDecisionRepository.create({ bookingId: new Types.ObjectId(bookingId), decision: 'approve', decidedBy: actorId });

    // T033: Notify
    this.notificationService.emitStatusChange(new Types.ObjectId(bookingId), BookingStatusEnum.CONFIRMADO);
    return updated!;
  }

  // T017: Reject (admin scoped)
  async rejectBooking(bookingId: string, actorId: Types.ObjectId, actorRole: RoleEnum, reason?: string): Promise<Booking> {
    this.rbacValidator.validateBookingAction(actorRole, 'reject');
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new Error('Reserva no encontrada');
    this.rbacValidator.validateAdminScope(actorRole, actorId, booking.professorId);

    const updated = await this.bookingRepository.updateStatus(bookingId, BookingStatusEnum.RECHAZADO);
    await this.bookingDecisionRepository.create({ bookingId: new Types.ObjectId(bookingId), decision: 'reject', decidedBy: actorId, reason });

    this.notificationService.emitStatusChange(new Types.ObjectId(bookingId), BookingStatusEnum.RECHAZADO);
    return updated!;
  }

  // T016 (Phase 4 T016): Cancel with 1hr window
  async cancelBooking(bookingId: string, actorId: Types.ObjectId, actorRole: RoleEnum): Promise<Booking> {
    this.rbacValidator.validateBookingAction(actorRole, 'cancel');
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new Error('Reserva no encontrada');
    this.rbacValidator.validateAdminScope(actorRole, actorId, booking.professorId);

    // T029: Cancellation window
    this.cancellationValidator.validate(booking.slotStart);

    const updated = await this.bookingRepository.updateStatus(bookingId, BookingStatusEnum.CANCELADO);
    await this.bookingDecisionRepository.create({ bookingId: new Types.ObjectId(bookingId), decision: 'cancel', decidedBy: actorId });

    this.notificationService.emitStatusChange(new Types.ObjectId(bookingId), BookingStatusEnum.CANCELADO);
    return updated!;
  }

  // T016: Get pending for admin
  async getPendingByProfessor(professorId: Types.ObjectId): Promise<Booking[]> {
    return this.bookingRepository.findByProfessor(professorId, BookingStatusEnum.PENDIENTE);
  }

  // T019.5: Get audit trail for booking
  async getBookingAuditTrail(bookingId: string) {
    return this.bookingDecisionRepository.findByBooking(new Types.ObjectId(bookingId));
  }

  // T025, T020: All bookings (superadmin)
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }
}
