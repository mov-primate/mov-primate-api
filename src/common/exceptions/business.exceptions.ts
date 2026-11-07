export class NoClassesAvailableException extends Error {
  code = 'ERR_NO_CLASSES_AVAILABLE';
  statusCode = 422;
  constructor(msg = 'El alumno no tiene clases disponibles') { super(msg); this.name = 'NoClassesAvailableException'; }
}
export class BookingConflictException extends Error {
  code = 'ERR_BOOKING_CONFLICT';
  statusCode = 409;
  constructor(msg = 'Reserva duplicada o solapada') { super(msg); this.name = 'BookingConflictException'; }
}
export class CancellationWindowException extends Error {
  code = 'ERR_CANCELLATION_WINDOW';
  statusCode = 422;
  constructor(msg = 'Cancelación no permitida con menos de 1 hora de anticipación') { super(msg); this.name = 'CancellationWindowException'; }
}
export class DuplicateUserException extends Error {
  code = 'ERR_DUPLICATE_USER';
  statusCode = 409;
  constructor(msg = 'Ya existe un usuario con ese email') { super(msg); this.name = 'DuplicateUserException'; }
}
