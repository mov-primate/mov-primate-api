import { Controller, Post, Put, Get, Param, Body, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingService } from './booking.service.js';
import { RoleEnum } from '../../../common/enums/index.js';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // T012-T014: Create booking
  @Post()
  async createBooking(@Body() body: {
    studentId: string; professorId: string;
    slotStart: string; slotEnd: string;
    actorRole: RoleEnum; availableClasses: number;
  }) {
    return this.bookingService.createBooking(
      new Types.ObjectId(body.studentId), new Types.ObjectId(body.professorId),
      new Date(body.slotStart), new Date(body.slotEnd),
      body.actorRole, body.availableClasses,
    );
  }

  // T015: Student booking history + T032 counter
  @Get('student/:studentId')
  async getStudentBookings(@Param('studentId') studentId: string) {
    const bookings = await this.bookingService.getStudentBookings(new Types.ObjectId(studentId));
    return { count: bookings.length, bookings };
  }

  // T016: Pending for admin
  @Get('pending')
  async getPending(@Query('professorId') professorId: string) {
    return this.bookingService.getPendingByProfessor(new Types.ObjectId(professorId));
  }

  // T025: All bookings (superadmin)
  @Get()
  async getAll() {
    return this.bookingService.getAllBookings();
  }

  // T017: Approve
  @Put(':id/approve')
  async approve(@Param('id') id: string, @Body() body: { actorId: string; actorRole: RoleEnum }) {
    return this.bookingService.approveBooking(id, new Types.ObjectId(body.actorId), body.actorRole);
  }

  // T017: Reject
  @Put(':id/reject')
  async reject(@Param('id') id: string, @Body() body: { actorId: string; actorRole: RoleEnum; reason?: string }) {
    return this.bookingService.rejectBooking(id, new Types.ObjectId(body.actorId), body.actorRole, body.reason);
  }

  // T029: Cancel with 1hr window
  @Put(':id/cancel')
  async cancel(@Param('id') id: string, @Body() body: { actorId: string; actorRole: RoleEnum }) {
    return this.bookingService.cancelBooking(id, new Types.ObjectId(body.actorId), body.actorRole);
  }

  // T019.5: Audit trail for booking
  @Get(':id/audit')
  async getAuditTrail(@Param('id') id: string) {
    return this.bookingService.getBookingAuditTrail(id);
  }
}
