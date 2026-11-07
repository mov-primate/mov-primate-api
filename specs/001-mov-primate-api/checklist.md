# Requirements Quality Checklist: API compartida de MovPrimate

**Purpose**: Revisar la calidad del contrato y las reglas de negocio compartidas entre BFF, frontend y servicios de dominio.
**Created**: 2026-11-04
**Feature**: [spec.md](./spec.md)

## Reglas de negocio

- [ ] CHK001 La API diferencia claramente alumno, administrador/profesor y superadmin.
- [ ] CHK002 El usuario nuevo se registra como alumno por defecto y solo el superadmin puede reasignar roles.
- [ ] CHK003 La API valida solapamientos, duplicados y estados inválidos antes de aceptar operaciones.
- [ ] CHK004 La aprobación y el rechazo de reservas quedan registrados en historial y trazabilidad.

## Seguridad y acceso

- [ ] CHK005 Las operaciones sensibles requieren autenticación y permisos explícitos.
- [ ] CHK006 El acceso a datos y perfiles se restringe por rol y alcance.
- [ ] CHK007 El cambio de rol queda protegido por permisos de superadmin y tiene auditoría.

## Contratos y consistencia

- [ ] CHK008 La API mantiene contratos consistentes con BFF y frontend.
- [ ] CHK009 Las respuestas tienen forma estandarizada para éxito, validación, permisos y conflicto.
- [ ] CHK010 La API no depende de la presentación ni del cliente para decidir reglas de negocio.

## Operabilidad

- [ ] CHK011 La API es compatible con la infraestructura local Docker y el despliegue en AWS.
- [ ] CHK012 El flujo principal de reserva no depende de WhatsApp ni canales externos.
- [ ] CHK013 El flujo de validación del administrador y la supervisión del superadmin queda documentado en contratos.

## Reglas globales a verificar

- [ ] CHK014 Existen 4 roles: superadmin, admin, alumno y usuario.
- [ ] CHK015 Solo superadmin puede cambiar roles y desactivar usuarios.
- [ ] CHK016 Alumno no puede duplicar/solapar reservas propias.
- [ ] CHK017 Se respeta cupo máximo 4 por clase y bloqueo de cupo lleno.
- [ ] CHK018 Estados de reserva limitados a pendiente/confirmado/cancelado/rechazado.
- [ ] CHK019 Cancelación solo hasta 1 hora antes.
- [ ] CHK020 Admin solo modifica reservas asignadas y puede registrar asistencia.
- [ ] CHK021 API expone contador/historial de reservas en perfil.
- [ ] CHK022 API expone total asistencias por alumno para panel superadmin.
- [ ] CHK023 API genera evento de correo por cambio de estado.
