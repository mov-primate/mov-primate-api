# Data Model: API compartida de MovPrimate

## Entidades

- User
  - id, email, role, status
- Booking
  - id, studentId, slotStart, slotEnd, status
- BookingDecision
  - id, bookingId, decision, decidedBy, decidedAt
- RoleChange
  - id, userId, fromRole, toRole, changedBy, changedAt, reason
- UserStatus
  - userId, isActive, deactivatedAt, deactivatedBy
- Attendance
  - bookingId, studentId, status (attended|missed|justified), updatedBy, updatedAt

## Reglas

- User.role inicial = usuario.
- RoleChange solo permitido por superadmin.
- Booking no puede solapar slot confirmado o bloqueado.
- Booking cancellation: permitido solo hasta 1 hora antes del inicio.
