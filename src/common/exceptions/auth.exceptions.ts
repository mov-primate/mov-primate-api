export class UnauthorizedException extends Error {
  code = 'ERR_UNAUTHORIZED';
  statusCode = 403;
  constructor(msg = 'No autorizado para esta operación') { super(msg); this.name = 'UnauthorizedException'; }
}
export class RoleChangeUnauthorizedException extends Error {
  code = 'ERR_ROLE_CHANGE_UNAUTHORIZED';
  statusCode = 403;
  constructor(msg = 'Solo el superadmin puede cambiar roles') { super(msg); this.name = 'RoleChangeUnauthorizedException'; }
}
