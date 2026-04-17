# Patch Project Planning

Updated at: 2026-04-17

## Product Summary

Patch is a developer tool for collecting, triaging, and tracking user bug reports and feature requests in one place.

## Personas

- Primary: Indie developers and small startup teams (1-10 people).
- Secondary: End users/reporters, mostly unauthenticated.

## Goals (V1)

- Provide a low-friction public intake path for user reports.
- Let developers manage reports by project.
- Provide a clear report lifecycle from intake to completion.
- Keep architecture simple and explicit, with strict validation and visible failures.

## Non-Goals (V1)

- Public roadmap.
- Global cross-project home feed.
- File attachments.
- Automated notifications.
- Auto-duplicate detection.
- Multi-member project permissions (`project_members` deferred).

## Core User Flow (Golden Path)

1. Reporter opens public intake page for a project.
2. Reporter submits report (`bug` or `feature_request`).
3. Developer signs in with OAuth (Google/GitHub).
4. Developer opens project reports.
5. Developer updates report status.

## Authentication and Identity

- Developer auth: OAuth only.
- Providers in V1: Google and GitHub.
- No email/password fallback.
- Reporter auth: not required.
- Reporter may optionally provide email for follow-up.

## Report Model (V1)

### Types

- `bug`
- `feature_request`

### Status Lifecycle

- `open`
- `planned`
- `in_progress`
- `done`
- `closed`

`closed` is used for rejected/duplicate/not-doing cases, with optional reason text.

### Report Submit Fields

- `title` (required)
- `description` (required)
- `type` (required)
- `email` (optional)
- `severity` (optional, mostly for bugs)
- `steps` (optional)

## Visibility and Routing

- Projects are private by default for developer management.
- Each project has one public intake link for reporters.

### UI Routes (V1)

- `/` - Landing page
- `/projects` - Developer project list
- `/projects/:id` - Project detail + report table
- `/r/:projectSlug` - Public reporter intake page

### Identifier Strategy

- Internal IDs: UUID
- Public intake identifier: project slug

## API Plan (V1)

### Project APIs

- `GET /api/projects` - List developer's projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details

### Report APIs

- `GET /api/projects/:id/reports` - List reports for project
- `POST /api/projects/:id/reports` - Create report for project (public intake or authenticated)
- `PATCH /api/reports/:id` - Update report fields/status

### API Behavior

- Report list supports filtering by `status` and `type`.
- Report list supports sorting by newest first.
- Report list uses cursor pagination.
- No automatic dedupe; duplicates handled manually by setting status/reason.

## Authorization Rules (V1)

- Authenticated developer can access and mutate their own projects and reports.
- Public reporter can only create reports through project public intake route.
- No `project_members` in V1; single-developer ownership model.

## Data Model (V1)

### Minimum Tables

- `users`
- `accounts` (OAuth identities)
- `projects`
- `reports`
- `report_events` (status and important change history)

### Notes

- `project_members` intentionally deferred to post-V1.
- `report_events` stores who changed status, when, and from/to values.

## Reliability and Validation

- Validate all API inputs server-side at boundary.
- Return explicit errors; do not silently fallback.
- Use consistent error shape:

```json
{
  "code": "string",
  "message": "string",
  "details": {}
}
```

## Abuse Protection

- Apply rate limiting on public report submission.
- Limit by IP and target project.

## Milestones

1. Foundation
- OAuth login (Google/GitHub)
- Base project model and developer project pages

2. Intake + Report CRUD
- Public intake page (`/r/:projectSlug`)
- Create/list/update report APIs
- Project report table with filter/sort/pagination

3. Hardening
- Validation and error contract consistency
- Rate limiting on public submit
- Report event tracking and timeline basics

## Open Questions (Post-V1)

- When to introduce `project_members` and team permissions.
- Whether `severity` should become enum-only with required values for bug type.
- Notification strategy (email/webhooks/in-app).
- Public roadmap design and data exposure rules.
