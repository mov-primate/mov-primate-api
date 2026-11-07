# Tasks: API compartida de MovPrimate

**Input**: Design documents from `/specs/001-mov-primate-api/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup

- [x] T001 Initialize NestJS app and base module structure
- [x] T002 Configure environment, validation, and shared security utilities
- [x] T003 [P] Define DTOs for users, profiles, roles, and bookings
- [x] T004 [P] Create MongoDB connection and base repositories

## Phase 2: Foundational

- [x] T005 Implement auth claims and role extraction middleware
- [x] T006 Implement role model and permission map
- [x] T007 Implement generic error-handling and status mapping
- [x] T008 Create booking validation service and conflict rules

## Phase 3: User Story 1 - Profiles and students (Priority: P1)

- [x] T009 [P] [US1] Implement student profile creation and read endpoints
- [x] T010 [US1] Implement default role assignment for new user accounts
- [x] T011 [US1] Add profile validation and duplicate identity checks

## Phase 4: User Story 2 - Booking rules (Priority: P1)

- [x] T012 [P] [US2] Implement slot availability and booking endpoints
- [x] T013 [US2] [FR-013] Enforce available_classes validation: before booking creation, query alumno service; if available_classes = 0, reject with ERR_NO_CLASSES_AVAILABLE
- [x] T014 [US2] Enforce duplicate and overlap prevention
- [x] T015 [US2] Implement history retrieval and state queries
- [x] T016 [US2] Add validation for invalid transitions between states

## Phase 5: User Story 3 - Admin validation (Priority: P1)

- [x] T016 [P] [US3] Implement pending reservation listing for admin
- [x] T017 [US3] Implement approve/reject endpoints
- [x] T018 [US3] Enforce authorization checks for admin operations
- [x] T019 [US3] Persist audit trail for all validation actions
- [x] T019.5 [US3] Implement audit trail storage and query endpoint for admin/superadmin

## Phase 6: User Story 4 - Superadmin and role management (Priority: P1)

- [x] T020 [P] [US4] Implement superadmin overview and user listing
- [x] T021 [US4] Implement role reassignment endpoint
- [x] T022 [US4] Restrict role changes to superadmin only
- [x] T023 [US4] Audit and log all role changes with before/after values

## Phase 7: Final validation

- [x] T024 [P] Contract tests for all public endpoints
- [x] T025 Integration tests for duplicate/overlap/conflict cases
- [x] T026 Security tests for role and authorization enforcement
- [x] T027 Quickstart and documentation validation

## Tareas globales obligatorias (complementarias)

- [x] T028 Agregar rol `usuario` y flujo de promoción/desactivación por superadmin.
- [x] T029 Implementar regla de anulación hasta 1 hora antes del inicio.
- [x] T030 Implementar registro de asistencia: asistió/no asistió/justificó ausencia.
- [x] T031 Implementar consulta agregada de total de asistencias por alumno.
- [x] T032 Exponer contador e historial de reservas en perfil.
- [x] T033 Publicar evento de notificación por correo en cambios de estado.
- [x] T034 [FR-013] Implementar validación de available_classes en API: servicio de booking consulta alumno, rechaza con ERR_NO_CLASSES_AVAILABLE si cuota = 0.

