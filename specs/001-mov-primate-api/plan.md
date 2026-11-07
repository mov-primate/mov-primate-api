# Implementation Plan: API compartida y contratos de negocio de MovPrimate

**Branch**: `001-mov-primate-api` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-mov-primate-api/spec.md`

## Summary

La API compartida de MovPrimate define los contratos y reglas de negocio para perfiles, reservas y validación. Debe soportar el flujo principal de alumno, el rol de administrador/profesor y el superadmin, con un modelo de 4 roles donde los usuarios nacen en rol `usuario` (inicial, sin privilegios) y solo el superadmin puede promoverlos a `alumno`, `admin` o `superadmin` cuando el negocio lo requiera.

## Technical Context

**Language/Version**: TypeScript, NestJS 12

**Primary Dependencies**: NestJS 12, MongoDB, validation pipes, authorization guards, business-domain contracts

**Storage**: MongoDB for users, profiles, reservations, status history, and audit events

**Testing**: Unit tests, integration tests, contract tests, business validation scenarios

**Target Platform**: Shared backend service consumed by BFF and downstream services

**Project Type**: Backend API / domain contract layer

**Performance Goals**: Consistent API responses, low latency on booking validation, reliability under concurrency

**Constraints**:
- Business rules must be enforced in this layer, not in frontend or BFF
- Permissions must be role-aware and explicit
- Duplicate or overlapping reservations must be blocked at the API boundary
- All role changes must be auditable and limited to superadmin

**Scale/Scope**:
- Auth/session contract integration
- User/profile management
- Booking creation, query, approval and rejection
- Audit and history tracking
- Cross-service contract consistency

## Constitution Check

*GATE: Must pass before implementation.*

- Shared API owns authoritative business contracts: PASS
- Student role is default but can be reassigned by superadmin: PASS
- All sensitive operations require authorization and audit: PASS
- Duplicate and overlap prevention remains a domain rule: PASS
- Contracts are aligned across frontend, BFF, and services: PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-mov-primate-api/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── common/
├── contracts/
├── modules/
│   ├── auth/
│   ├── bookings/
│   ├── profiles/
│   ├── roles/
│   └── validation/
├── security/
└── utils/

tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: The API will be organized by business capability: profiles, bookings, roles, validation, and shared security contracts. It will act as the canonical layer for business rules and the contract boundary with BFF and services.

## Complexity Tracking

No constitutional violations were identified, so no complexity exceptions are required.

## Addendum de alcance obligatorio

- Extender modelo RBAC a 4 roles incluyendo `usuario`.
- Incluir endpoints de superadmin para role-change y deactivate-user.
- Incorporar regla de cancelación hasta 1 hora antes.
- Incluir registro y consulta de asistencia por reserva.
- Exponer contador/historial de reservas por usuario.
- Exponer agregación de total asistencias por alumno para superadmin.
- Publicar evento de notificación por correo en transiciones de estado.
