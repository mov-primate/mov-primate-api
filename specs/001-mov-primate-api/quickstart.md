# Quickstart: API compartida de MovPrimate

## 1) Ejecutar API

1. Configurar variables de entorno.
2. Levantar dependencias (MongoDB + servicios).
3. Iniciar API y validar endpoint de health.

## 2) Validar escenarios

1. Crear usuario nuevo y verificar rol alumno por defecto.
2. Reservar sesión de 1 hora.
3. Aprobar/rechazar como admin.
4. Cambiar rol de usuario como superadmin.

## 3) Validar seguridad

- Cambio de rol con admin debe fallar.
- Role change exitoso debe generar registro auditable.
- Desactivación de usuario por no-superadmin debe fallar.
- Cancelación dentro de la última hora debe fallar.
- Registro de asistencia debe quedar auditable.
