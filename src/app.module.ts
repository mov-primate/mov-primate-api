import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { User, UserSchema } from './modules/profiles/domain/user.schema.js';
import { Booking, BookingSchema } from './modules/bookings/domain/booking.schema.js';
import { BookingDecision, BookingDecisionSchema } from './modules/bookings/domain/booking-decision.schema.js';
import { RoleChange, RoleChangeSchema } from './modules/roles/domain/role-change.schema.js';
import { Attendance, AttendanceSchema } from './modules/attendance/domain/attendance.schema.js';

import { UserRepository } from './modules/profiles/infrastructure/user.repository.js';
import { BookingRepository } from './modules/bookings/infrastructure/booking.repository.js';
import { BookingDecisionRepository } from './modules/bookings/infrastructure/booking-decision.repository.js';
import { RoleChangeRepository } from './modules/roles/infrastructure/role-change.repository.js';
import { AttendanceRepository } from './modules/attendance/infrastructure/attendance.repository.js';

import { ProfileService } from './modules/profiles/application/profile.service.js';
import { BookingService } from './modules/bookings/application/booking.service.js';
import { RolesService } from './modules/roles/application/roles.service.js';
import { AttendanceService } from './modules/attendance/application/attendance.service.js';

import { ProfileController } from './modules/profiles/application/profile.controller.js';
import { BookingController } from './modules/bookings/application/booking.controller.js';
import { RolesController } from './modules/roles/application/roles.controller.js';
import { AttendanceController } from './modules/attendance/application/attendance.controller.js';

import { BookingConflictValidator } from './modules/validation/booking-conflict.validator.js';
import { CancellationWindowValidator } from './modules/validation/cancellation-window.validator.js';
import { AvailableClassesValidator } from './modules/validation/available-classes.validator.js';
import { RbacValidator } from './security/rbac.validator.js';
import { NotificationEventService } from './utils/notification-event.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'mov-primate-api',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mov-primate'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: BookingDecision.name, schema: BookingDecisionSchema },
      { name: RoleChange.name, schema: RoleChangeSchema },
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
  ],
  controllers: [
    AppController,
    ProfileController,
    BookingController,
    RolesController,
    AttendanceController,
  ],
  providers: [
    AppService,
    UserRepository,
    BookingRepository,
    BookingDecisionRepository,
    RoleChangeRepository,
    AttendanceRepository,
    ProfileService,
    BookingService,
    RolesService,
    AttendanceService,
    BookingConflictValidator,
    CancellationWindowValidator,
    AvailableClassesValidator,
    RbacValidator,
    NotificationEventService,
  ],
})
export class AppModule {}
