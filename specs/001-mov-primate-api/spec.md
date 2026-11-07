# Feature Specification: API compartida y contratos de negocio de MovPrimate

**Feature Branch**: `001-mov-primate-api`

**Created**: 2026-11-04

**Status**: Draft

**Input**: User description: "Define la API compartida y los contratos de negocio para reservas, alumnos y administración de MovPrimate. Debe exponer endpoints consistentes para autenticación, perfiles, reservas y validación por roles."

## User Scenarios & Testing

### User Story 1 - API expone contratos claros para alumno (Priority: P1)
El alumno usa la API para autenticarse, consultar disponibilidad y crear una reserva de 1 hora.

**Why this priority**: La API es la capa compartida de negocio y debe ofrecer un modelo claro para la app y el BFF.

**Independent Test**: Una llamada válida para crear una reserva desde la identidad de un alumno debe producir la misma respuesta y estado que la capa BFF espera.

**Acceptance Scenarios**:
1. **Given** que un alumno autenticado solicita slots, **When** invoca el endpoint de disponibilidad, **Then** la API responde con una lista coherente y segura de horarios.
2. **Given** que un alumno solicita una reserva válida, **When** la API procesa la operación, **Then** devuelve un identificador, estados y confirmación de registro.

---

### User Story 2 - API valida reglas de negocio y conflictos (Priority: P1)
La API valida solapamientos, duplicados y estados inválidos antes de aceptar una operación.

**Why this priority**: Las reglas de negocio no deben depender de la capa de presentación ni del BFF.

**Independent Test**: Una reserva conflictiva debe rechazarse con error explícito y sin persistencia incorrecta.

**Acceptance Scenarios**:
1. **Given** que existe una reserva en un horario, **When** otra solicitud solapa el mismo slot, **Then** la API rechaza la operación con conflicto de negocio.
2. **Given** que un alumno intenta duplicar la misma reserva, **When** la API procesa la solicitud, **Then** responde con error de duplicado.

---

### User Story 3 - Administración revisa y cambia estados (Priority: P1)
El administrador/profesor usa la API para listar reservas pendientes y validarlas.

**Why this priority**: La validación administrativa requiere permisos claros, reglas de negocio y posterior auditoría.

**Independent Test**: Un administrador autorizado puede aprobar o rechazar reservas con una operación segura y consistente.

**Acceptance Scenarios**:
1. **Given** que existe una reserva pendiente, **When** el administrador la aprueba, **Then** la API actualiza el estado a confirmada.
2. **Given** que una operación se ejecuta sin permiso, **When** llega a la API, **Then** la API responde con error de autorización.

---

### User Story 4 - Superadmin consulta operaciones globales (Priority: P1)
El dueño del gimnasio consulta la API para ver supervisión global, estadísticas y casos excepcionales.

**Why this priority**: El superadmin requiere acceso a información global pero solo dentro de los límites definidos por el negocio.

**Independent Test**: Un superadmin autenticado puede consultar asistentes, reservas y estados relevantes sin acceder a datos prohibitidos.

**Acceptance Scenarios**:
1. **Given** que el superadmin solicita un panorama general, **When** la API procesa la consulta, **Then** devuelve solo datos autorizados.
2. **Given** que un usuario no autorizado intenta consultar ese mismo panorama, **When** llega la petición, **Then** la API deniega el acceso.

---

### User Story 5 - API mantiene historial y trazabilidad (Priority: P2)
La API expone datos de historial y permite auditar cada cambio de estado.

**Why this priority**: El historial es necesario para soporte, análisis y resolución de conflictos.

**Independent Test**: El alumno o el administrador puede consultar historial con respuestas consistentes y visibles.

**Acceptance Scenarios**:
1. **Given** que una reserva cambia de estado, **When** se consulta el historial, **Then** la API expone el cambio junto con la fecha y el responsable.
2. **Given** que un usuario consulta su historial, **When** existe información autorizada, **Then** la API responde solo con los registros permitidos.

---

### User Story 6 - Admin registra asistencia (Priority: P2)
El profesor/administrador registra quién asistió, quién no asistió o quién tuvo ausencia justificada después de que la sesión ocurra.

**Why this priority**: La asistencia es registro crítico pero secundario a la reserva.

**Independent Test**: Un administrador autorizado puede registrar estado de asistencia en una reserva confirmada.

**Acceptance Scenarios**:
1. **Given** que una reserva está en estado `confirmado`, **When** el admin registra asistencia, **Then** el estado cambia a `completado` con flag de asistencia grabado.
2. **Given** que un alumno consulta su historial, **When** la sesión fue registrada con asistencia, **Then** aparece el estado (asistió/no asistió/justificada).

### Edge Cases

- ¿Qué ocurre si dos llamadas concurrentes intentan reservar el mismo slot?
- ¿Cómo responde la API si una solicitud no incluye un rol válido?
- ¿Qué sucede si una reserva ya fue rechazada y luego llega una aprobación?
- ¿Cómo maneja un conflicto de permisos entre usuario, administrador y superadmin?

## Requirements

### Functional Requirements

- **FR-001**: La API DEBE exponer endpoints para autenticación, perfiles, disponibilidad y reservas del negocio.
- **FR-002**: La API DEBE validar que cada solicitud llegue con la identidad y los permisos adecuados.
- **FR-003**: La API DEBE distinguir alumno, administrador/profesor y superadmin.
- **FR-004**: La API DEBE prevenir conflictos de horario, duplicados y estados inválidos.
- **FR-005**: La API DEBE soportar creación, consulta, aprobación y rechazo de reservas.
- **FR-006**: La API DEBE devolver respuestas estructuradas para éxito, errores de validación, permisos y conflictos.
- **FR-007**: La API DEBE mantener historial y trazabilidad de cambios de estado.
- **FR-008**: La API DEBE permitir consultas de reservas por alumno, administrador y superadmin según permisos.
- **FR-009**: La API DEBE mantener contratos consistentes con BFF, frontend y microservicios.
- **FR-010**: La API DEBE registrar y filtrar acceso a información sensible según rol y alcance.
- **FR-011**: La API DEBE exponer endpoint de cambio de rol (solo superadmin): `POST /superadmin/users/{id}/promote` para promover de `usuario` a `alumno`, `admin` o `superadmin`.
- **FR-012**: La API DEBE publicar evento de transición de estado de reserva para notificación por correo (arquitectura: async queue, event bus, o webhook).
- **FR-013**: La API DEBE validar que el alumno tenga `available_classes` > 0 antes de permitir crear una reserva; consulta al microservicio de alumnos y rechaza con error ERR_NO_CLASSES_AVAILABLE si la cuota es 0.

### Key Entities

- **Alumno**: perfil del miembro con identidad, historial y permisos de usuario final.
- **Admin (Profesor)**: perfil autorizado para validar, rechazar reservas y registrar asistencia de alumnos asignados a su profesor/aula.
- **Superadmin**: dueño del gimnasio con supervisión global y control crítico.
- **Reserva**: entidad central con horario, estado, usuario y decisiones administrativas.
- **Estado de reserva**: conjunto de estados del cycle of life del servicio.
- **Contrato de negocio**: estructura de entrada y salida de cada API.
- **Cuota de clases (available_classes)**: contador de clases disponibles del alumno, fuente de verdad en microservicio de alumnos; API valida antes de crear reserva.

---

## Glosario de Términos

- **Admin**: Usuario con rol `admin` (profesor responsable de una aula/clase). Puede ver/modificar reservas de alumnos asignados.
- **Alcance (Scope)**: Límite de acceso a recursos según rol (propio, aula, global).
- **Asistencia**: Estado de participación en una sesión: `asistio`, `no_asistio`, `falta_justificada`.
- **Cupo**: Máximo de 4 alumnos por combinación (profesor + fecha + hora).
- **Usuario**: Rol inicial sin privilegios; requiere promoción a `alumno` o `admin` por superadmin.

## Success Criteria

### Measurable Outcomes

- **SC-001**: La API rechaza 100% de las reservas conflictivas por duplicado o solapamiento.
- **SC-002**: El 100% de las operaciones sensibles requieren validación por permisos antes de ejecutar.
- **SC-003**: El historial de reservas se mantiene trazable y consistente para alumno y administrador.
- **SC-004**: Las respuestas de la API son consistentes para el BFF y cualquier cliente integrado.
- **SC-005**: Las operaciones de reserva y validación se respetan en el mismo contrato de negocio sin depender de detalles de infraestructura.
- **SC-006**: Toda respuesta sigue formato estándar: `{status, code?, data}` para éxito y `{status, code, message, data}` para errores.

## Assumptions

- Los servicios de dominio y la base de datos ya validan la persistencia y las reglas de negocio.
- La API asume que la identidad del usuario y sus permisos vienen de un proveedor externo o de un middleware seguro.
- Los cambios de estado de reserva deben mantenerse en un dominio consistente y trazable.
- Los permisos son explícitos para alumno, administrador y superadmin.
- Los clientes del sistema usan la API a través del BFF y no directamente desde el frontend.

## Clarifications

### Identity & Authorization Context (Session 2026-11-05)

- **A1: Concurrency Handling for Overlaps** - El sistema debe rechazar el 100% de solicitudes concurrentes que intenten reservar el mismo slot simultáneamente. La API implementará validación a nivel de database (unique constraint + transaction isolation) y a nivel de aplicación (optimistic locking o pessimistic locking).
  
- **A2: Identity Provider Strategy** - La identidad del usuario (user_id, rol) viene de:
  - **Token JWT** proporcionado por el BFF/frontend en header Authorization
  - La API extrae user_id y rol del token (no crea ni valida tokens, solo confía en BFF)
  - Assumption: El token es validado y confiable por middleware upstream (no es responsabilidad de esta API)

- **A7: Usuario Role Endpoint** - Endpoint nuevo: `POST /superadmin/users/{id}/promote-to-alumno` (solo superadmin puede ejecutar) para promover usuarios del rol `usuario` a `alumno`.

- **A8: Asistencia in Admin Workflow** - Admin puede registrar asistencia en reservas confirmadas: `PATCH /admin/bookings/{id}/attendance` con payload `{asistencia: "asistio|no_asistio|falta_justificada", notas: "string"}`.

## Definición de Alcances (Scope)

Para operaciones de lectura/escritura en reservas y usuarios, el alcance se define por rol:

| Rol | Alcance (Scope) | Puede ver/modificar |
|-----|---|---|
| `usuario` | N/A | Nada (rol inicial, sin permisos) |
| `alumno` | Solo propio | Sus propias reservas (alumno_id == usuario_id) |
| `admin` | Aula/profesor | Reservas donde reserva.admin_id == usuario_id (asignadas a su profesorId) |
| `superadmin` | Global | Todas las reservas, usuarios, y datos de auditoría |

**Validación**: Toda query/mutation en la API debe filtrar resultados por alcance del usuario.



- La API debe modelar 4 roles: `superadmin`, `admin`, `alumno`, `usuario`.
- Registro inicial en rol `usuario` (sin privilegios); cambio de rol y desactivación solo por `superadmin`.
- Reserva de 1 hora: alumno debe elegir profesor (`admin`) y no duplicar/solapar reservas propias.
- Máximo 4 alumnos por combinación (profesor + fecha + hora) y bloqueo por cupo completo.
- Estados canónicos de reserva: `pendiente`, `confirmado`, `cancelado`, `rechazado`.
- Cancelación permitida hasta 1 hora antes de la hora agendada.
- Admin puede modificar únicamente reservas asignadas a su profesorId y registrar asistencia (asistió, no asistió, justificó ausencia).
- **Validar available_classes antes de crear reserva (FR-13)**: Si available_classes = 0, rechazar con error ERR_NO_CLASSES_AVAILABLE.
- **Superadmin solo puede cambiar roles**. No puede cambiar otros campos de usuario (solo sí: rol, estado activo/inactivo).
- API debe exponer agregados para panel superadmin: reservas globales y total de asistencias por alumno.
- API debe publicar evento para correo de confirmación por cada cambio de estado de reserva.
