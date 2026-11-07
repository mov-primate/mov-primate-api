# Contracts: API compartida de MovPrimate

**Última actualización**: 2026-11-05  
**Status**: En definición (se completará durante T024 - Contract tests phase)

---

## Endpoints (resumen actualizado)

### Usuarios & Autenticación
- `POST /users` - Crear usuario nuevo (role=usuario por defecto)
- `GET /users/{id}` - Obtener perfil de usuario
- `PATCH /superadmin/users/{id}/promote` - Cambiar rol (solo superadmin)
- `PATCH /superadmin/users/{id}/deactivate` - Desactivar usuario (solo superadmin)

### Reservas (Alumno)
- `GET /bookings/slots` - Listar disponibilidad
- `POST /bookings` - Crear reserva
- `GET /bookings` - Listar propias reservas (filtrado por usuario)
- `PATCH /bookings/{id}/cancel` - Cancelar (si <1h antes)

### Reservas (Administrador)
- `GET /admin/bookings/pending` - Listar pendientes en su aula
- `PATCH /admin/bookings/{id}/approve` - Aprobar
- `PATCH /admin/bookings/{id}/reject` - Rechazar
- `PATCH /admin/bookings/{id}/attendance` - Registrar asistencia (asistio|no_asistio|falta_justificada)

### Reportes (Superadmin)
- `GET /superadmin/reports/attendance` - Reporte de asistencias por alumno
- `GET /superadmin/bookings` - Listar todas las reservas

---

## Reglas de Contrato

| Regla | Especificación | Validación |
|-------|---|---|
| **Usuarios nuevos** | Role=`usuario` (sin privilegios, inicial) | T010, FR-001 |
| **Promoción de rol** | Solo superadmin puede cambiar roles | T021-T022, FR-011 |
| **Reserva** | Duración fija 1 hora, sin solapes/duplicados | T012-T013, FR-004 |
| **Cupo máximo** | 4 alumnos por (profesor + fecha + hora) | T012, SC-001 |
| **Cancelación** | Máximo hasta 1 hora antes del inicio (zona horaria servidor) | T029, FR-005 |
| **Asistencia** | Estados: asistio, no_asistio, falta_justificada | T030, US6 |
| **Scope Admin** | Admin ve/modifica solo reservas de alumnos de su aula (admin_id) | T016-T018, A4 |
| **Respuesta Estándar** | Formato: `{status, code?, data}` o `{status, code, message, data}` | SC-006, A3 |
| **Identidad** | JWT token con user_id y rol (confiado del BFF) | T005, A2 |
| **Concurrencia** | 100% de solicitudes concurrentes al mismo slot rechazadas | A1 |

---

## Documentos por crear (Tasks)

| Documento | Task Relacionada | Descripción |
|-----------|---|---|
| `api-responses.md` | T007 | Schema de respuestas, códigos de error |
| `authentication.md` | T005 | JWT claims, extracción de identidad |
| `bookings-contract.md` | T012-T015 | Endpoints CRUD de reservas |
| `users-contract.md` | T009-T011, T021-T022 | Endpoints de usuarios y roles |
| `admin-endpoints.md` | T016-T019 | Endpoints administrativos, scope filtering |
| `superadmin-endpoints.md` | T020-T023 | Endpoints de superadmin, reportes |

---

## Issues Resueltos (speckit-analyze)

- ✅ **A5**: Estructura de contracts/ documentada
- ✅ **A15**: Propósito de contracts/ claro (documentación + generables)
- ✅ **A4**: Scope-based filtering definido en tabla

---

**Revisor**: API Team  
**Próxima revisión**: Post-Task T024 (Contract tests phase)  
**Estado**: Ready for Implementation
