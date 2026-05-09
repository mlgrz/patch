# Architecture

This project keeps backend request handling split into four explicit layers:
routes, controllers, services, and repository functions. The goal is to keep
HTTP concerns, response formatting, business rules, and database operations
separate enough that each endpoint stays easy to read, test, and change.

This is a Next.js App Router project, so physical HTTP route files live under
`app/api/**/route.ts`. In this document, `/routes` describes the route layer as
a responsibility. If this project later introduces a separate backend package,
that package may use a physical `/routes` directory; inside the current Next.js
app, use `app/api/**/route.ts` for endpoint registration.

## Request Flow

Every API request should move through the layers in one direction:

```text
HTTP request
  -> routes
  -> controllers
  -> services
  -> repository
  -> database
```

Responses move back up the same chain:

```text
database result
  -> repository result
  -> service result
  -> controller JSON response
  -> HTTP response
```

Lower layers should not import from higher layers. A repository function should
not know about HTTP status codes. A service should not know how JSON is sent to
the client. A route should not contain business rules.

## `/routes`

Routes list the available endpoints and HTTP methods. They are the entry point
for incoming requests.

In this Next.js app, route responsibilities are implemented by `route.ts` files
under `app/api`. For example:

```text
app/api/projects/route.ts
```

Route files should:

- Export supported HTTP method handlers such as `GET`, `POST`, `PATCH`, and
  `DELETE`.
- Parse only the request details needed to call the controller.
- Pass request data, route parameters, and request context into the controller.
- Avoid direct database access.
- Avoid business logic beyond simple method-level wiring.

Route files should not:

- Own validation rules that belong to a reusable endpoint workflow.
- Format every success and error response by hand.
- Call Prisma or any other database client directly.
- Contain domain decisions such as who can update a report or how a status
  transition works.

Example shape:

```ts
export async function POST(request: Request) {
  return createProjectController(request);
}
```

## `/controllers`

Controllers coordinate the HTTP-facing workflow for a route. They call services
and convert service results into JSON responses with appropriate status codes.

Controllers should:

- Read and validate request bodies, query params, and route params.
- Read the authenticated Supabase user/session when an endpoint requires auth.
- Pass the authenticated actor into the service for authorization decisions.
- Call exactly the service function that represents the endpoint behavior.
- Return consistent JSON success responses.
- Return consistent JSON error responses with status codes through the shared
  JSON error helper.

Controllers should not:

- Contain database queries.
- Hide business rules in response formatting code.
- Duplicate service logic across endpoints.
- Return raw database errors directly to the client when a stable error contract
  is expected.

Recommended response shape for errors:

```json
{
  "code": "string",
  "message": "string",
  "details": {}
}
```

Example responsibilities for `POST /api/projects`:

- Confirm Supabase has authenticated the requester.
- Parse and validate the JSON body.
- Call `createProjectService`.
- Return `201` with the created project.
- Return `400` for invalid input or expected creation failures.
- Return `401` when the requester is not authenticated.

## `/services`

Services contain the business logic for specific endpoints or domain workflows.
They should describe what the product does, not how HTTP or the database works.

Services should:

- Enforce domain rules.
- Own authorization decisions using the authenticated actor provided by the
  controller.
- Coordinate multiple repository calls when a workflow spans more than one table.
- Decide which repository functions are needed for a use case.
- Return discriminated result objects for expected success and failure outcomes.
- Keep behavior reusable across API routes, server actions, and future jobs.

Services should not:

- Return `NextResponse` or any HTTP response object.
- Depend on route files.
- Contain low-level query construction unless the query is genuinely part of the
  business rule.
- Know about request body parsing.

Example service responsibilities:

- Create a project owned by the authenticated developer.
- Submit a public report for a project slug.
- List reports with status/type filters, newest-first sorting, and cursor
  pagination.
- Update report status while recording a `report_events` history entry.

Service functions should use this result shape for expected outcomes:

```ts
type ServiceResult<TData, TErrorCode extends string> =
  | { success: true; data: TData }
  | {
      success: false;
      error: {
        code: TErrorCode;
        message: string;
        details?: Record<string, unknown>;
      };
    };
```

Example:

```ts
type CreateProjectResult = ServiceResult<
  Project,
  "slug_taken" | "owner_not_found"
>;

async function createProjectService(input: CreateProjectInput): Promise<CreateProjectResult> {
  const existingProject = await getProjectByPublicSlug(input.publicSlug);

  if (existingProject) {
    return {
      success: false,
      error: {
        code: "slug_taken",
        message: "Project slug is already taken.",
      },
    };
  }

  const project = await createProjectRecord(input);

  return {
    success: true,
    data: project,
  };
}
```

## `/repository`

Repository functions contain database operations. They are the only layer that
should build table queries directly.

Repository functions should:

- Accept explicit input values.
- Use Prisma to read and write database records.
- Return database rows or typed repository results.
- Keep query details, selected columns, joins, and persistence-specific concerns
  in one place.
- Make database access easy to mock or replace in service tests.

Repository functions should not:

- Read from HTTP requests.
- Return HTTP responses or status codes.
- Make product decisions that belong in services.
- Perform request validation beyond protecting the query from invalid inputs.
- Return raw Prisma errors for expected application outcomes.

Example repository functions:

```ts
createProjectRecord(input)
getProjectById(projectId)
getProjectByPublicSlug(publicSlug)
listReportsByProjectId(filters)
updateReportStatus(input)
createReportEvent(input)
```

## Layer Boundaries

| Layer | Owns | Must Not Own |
| --- | --- | --- |
| Routes | Endpoint and HTTP method registration | Business rules, database access |
| Controllers | Request parsing, validation, JSON responses, status codes | Raw database queries, domain workflows |
| Services | Business logic, authorization decisions, workflow orchestration | `NextResponse`, request parsing |
| Repository | Database queries and persistence details | HTTP behavior, product decisions |

Import direction should stay strict:

```text
routes -> controllers -> services -> repository
```

Shared utilities may be imported by any layer when they are truly generic, such
as slug helpers, validation helpers, or error helpers.

Feature-specific controllers, services, repositories, types, schemas, and
utilities should live under plural feature folders:

```text
features/projects/
features/reports/
features/auth/
```

## Validation And Errors

Validation happens at the controller boundary. Controllers should reject invalid
request bodies before calling services. Services may still validate invariants
that protect the domain, especially when the service can be called from more
than one entry point.

Expected errors should be represented intentionally. For example:

- `unauthorized` -> `401`
- `forbidden` -> `403`
- `not_found` -> `404`
- `validation_error` -> `400`
- `conflict` -> `409`
- `internal_error` -> `500`

Unexpected errors should be logged server-side and returned as stable,
non-leaky JSON errors.

Services should represent expected failures with discriminated result objects.
Controllers are responsible for translating those result objects into HTTP
status codes and JSON responses with the shared error helper. Throwing errors
should be reserved for unexpected failures, such as infrastructure failures or
impossible states.

## Applying This To The Current Project

The current `POST /api/projects` implementation shows the workflow that should
be split across layers as endpoints grow: auth lookup, JSON parsing, validation,
slug generation, database insert, and response formatting.

As endpoint complexity grows, move that behavior into the layered shape:

```text
app/api/projects/route.ts
  -> project controller
  -> project service
  -> project repository
```

For Next.js compatibility, keep the actual endpoint file at
`app/api/projects/route.ts`. Feature-specific controller, service, and
repository modules should live in the feature folder, for example:

```text
features/projects/controllers/
features/projects/services/
features/projects/repository/
```

Shared services, error helpers, or API utilities that are not owned by one
feature can live under `lib/services` or `lib/api`, following the project folder
structure.

## Example Endpoint Walkthrough

For `POST /api/projects`:

1. Route receives the `POST` request and calls the controller.
2. Controller reads the authenticated Supabase user, parses JSON, validates
   input, and calls the service.
3. Service applies project creation rules, prepares normalized input, and calls
   the repository.
4. Repository inserts the project record through Prisma and returns the selected
   fields.
5. Service returns the created project result.
6. Controller returns `{ "project": data }` with status `201`.

This keeps the route file small, makes business rules easier to test, and keeps
database changes isolated from HTTP response behavior.

## Rules Of Thumb

- If the code mentions `GET`, `POST`, or route params, it probably belongs in
  routes or controllers.
- If the code chooses an HTTP status code, it belongs in a controller.
- If the code decides whether an action is allowed, it belongs in a service.
- If the code builds a Prisma query, it belongs in a repository.
- If the code is useful to multiple features and has no product-specific rules,
  it may belong in `lib`.

## Resolved Decisions

These decisions guide API refactors and new endpoint work:

- Feature-specific controllers live in `features/[feature]/controllers`.
- Feature folder names use plural product areas, such as `features/projects` and
  `features/reports`.
- Prisma is the ORM for repository/database operations.
- Supabase handles authentication.
- Controllers read Supabase auth state; services own authorization decisions.
- Validation schemas should live in separate schema files when reused or large,
  and may stay colocated with controllers when tiny.
- All endpoints should use one shared JSON error helper.
- Repository functions should not leak raw Prisma errors for expected
  application outcomes.
