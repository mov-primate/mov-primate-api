# Constitución de la API MovPrimate

## Principios fundamentales

### I. Integridad de contratos y dominio
La API debe exponer interfaces claras, consistentes y responsables para cada caso de uso del negocio, evitando acoplamientos innecesarios entre módulos. Los contratos deben reflejar la diversidad de roles: alumno, administrador/profesor y superadmin.

### II. Validación de entrada y negocio
Toda solicitud debe validarse antes de procesarse. Los datos entrantes, las reglas de negocio y los estados de los recursos deben verificarse explícitamente antes de aceptar o ejecutar una operación.

### III. Separación de responsabilidades
La API no debe asumir tareas que pertenecen a servicios de dominio específicos. Debe actuar como capa de entrada y coordinación, no como contenedor de lógica heterogénea.

### IV. Seguridad por capa
La autenticación, la autorización, la auditoría y el control de acceso deben implementarse de forma explícita y defendible en cada endpoint relevante. Las operaciones sensibles requieren permisos definidos por role.

### V. Diagnóstico y mantenibilidad
La API debe generar logs útiles, errores comprensibles y respuestas trazables para facilitar soporte, diagnóstico y evolución del sistema.

## Restricciones del producto

- Stack backend: NestJS 12 + TypeScript
- Persistencia: MongoDB
- Debe soportar servicios de reserva, alumnos y notificaciones
- Debe mantener contratos de integración estables
- Debe estar preparada para ejecutarse en Docker y desplegarse en AWS
- Debe incluir endpoints para matrícula de alumnos, gestión de reservas y validación administrativa

## Flujo de trabajo de desarrollo

- Cada endpoint debe tener una intención clara, payload definido y escenarios de prueba asociados.
- Antes de ampliar un contrato, se debe revisar el impacto en clientes y servicios downstream.
- Los cambios de negocio deben pasar por validación y pruebas de integración.
- Se debe mantener alineación con el flujo de Spec Kit del proyecto.
- Los cambios que alteren permisos o estado de reservas deben revisarse con especial cuidado.

## Gobernanza

La API MovPrimate debe servir como punto de entrada ordenado y seguro para las operaciones del negocio. Cualquier cambio que altere el contrato, la seguridad, los permisos o la lógica de dominio debe revisarse antes de fusionarse.

**Versión**: 1.0.1 | **Ratificada**: 2026-11-04 | **Última modificación**: 2026-11-04