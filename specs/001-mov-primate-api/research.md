# Research: API compartida de MovPrimate

## Decisiones clave

1. La API concentra reglas de negocio transversales.
2. Prevención de duplicados/solapes ocurre en capa de negocio.
3. Roles explícitos: alumno, administrador/profesor, superadmin.
4. Usuario nuevo nace como alumno; superadmin puede reasignar rol.

## Riesgos y mitigaciones

- Riesgo: carrera en reservas concurrentes.
  - Mitigación: validación transaccional y control de versión.
- Riesgo: cambios de rol sin auditoría.
  - Mitigación: evento de auditoría obligatorio en role-change.

## Resultado

API canónica para contratos y reglas de permisos/estados.

## Reglas globales incorporadas

- 4 roles obligatorios (superadmin/admin/alumno/usuario).
- Usuario inicial no privilegiado; role-change y deactivate por superadmin.
- Cancelación con límite de 1 hora.
- Registro de asistencia y agregados de asistencia por alumno.
