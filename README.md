# Email Cadence – Monorepo (TypeScript)

A Temporal.io-powered email cadence workflow system built with **Next.js**, **NestJS**, and the **Temporal TypeScript SDK** in a **Turborepo + pnpm** monorepo.

## Architecture

```
repo/
  apps/
    web/        # Next.js 15 (App Router) – frontend UI
    api/        # NestJS – REST API + Temporal client
    worker/     # Temporal.io worker – executes workflows
  packages/
    shared/     # Shared TypeScript types & constants
  package.json
  turbo.json
  pnpm-workspace.yaml
```

**Flow:**

1. User creates a cadence (series of SEND_EMAIL / WAIT steps) via the UI or API.
2. User enrolls a contact into a cadence → API starts a Temporal workflow.
3. The worker executes cadence steps sequentially (mock email sends + timed waits).
4. While a workflow is running, the user can update the cadence steps via a signal – the workflow adopts the new definition and continues correctly.

## Prerequisites

- **Node.js** 18+
- **pnpm** 9+ (`npm install -g pnpm`)
- **Temporal server** running locally (e.g., `temporal server start-dev`)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create `.env` files from templates

```bash
pnpm env:init
```

This copies each app's `.env.example` → `.env` (skips if `.env` already exists). Edit the generated files to customise values.

### 3. Run database migrations

```bash
pnpm migrate
```

Creates / updates the SQLite database at `apps/api/data/cadence.db` via Prisma.

### 4. Start Temporal

```bash
temporal server start-dev
```

### 5. Start all apps

```bash
pnpm dev
```

Or run them individually:

```bash
pnpm dev:web      # Next.js on http://localhost:3000
pnpm dev:api      # NestJS  on http://localhost:3001
pnpm dev:worker   # Temporal worker
```

> **Note:** Make sure the Temporal server is running before starting the worker and API.

## Temporal Configuration

The following environment variables configure the Temporal connection. Defaults are provided for local development:

| Variable              | Default                 | Description                  |
| --------------------- | ----------------------- | ---------------------------- |
| `TEMPORAL_ADDRESS`    | `localhost:7233`        | Temporal server gRPC address |
| `TEMPORAL_NAMESPACE`  | `default`               | Temporal namespace           |
| `TEMPORAL_TASK_QUEUE` | `cadence-task-queue`    | Task queue name              |
| `API_PORT`            | `3001`                  | NestJS API port              |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | API URL for the frontend     |

Copy `.env.example` to `.env` and adjust as needed (or just run `pnpm env:init`).

## Available Scripts

| Command           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `pnpm install`    | Install all dependencies                                   |
| `pnpm env:init`   | Copy `.env.example` → `.env` in each app (no-op if exists) |
| `pnpm migrate`    | Run Prisma migrations on the API database                  |
| `pnpm dev`        | Start all apps via Turborepo (TUI mode)                    |
| `pnpm dev:web`    | Start only the Next.js frontend                            |
| `pnpm dev:api`    | Start only the NestJS API                                  |
| `pnpm dev:worker` | Start only the Temporal worker                             |
| `pnpm build`      | Build all apps                                             |

## API Endpoints

### Cadences

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/cadences`     | Create a cadence  |
| GET    | `/cadences`     | List all cadences |
| GET    | `/cadences/:id` | Get cadence by ID |
| PUT    | `/cadences/:id` | Update cadence    |

### Enrollments

| Method | Endpoint                          | Description                            |
| ------ | --------------------------------- | -------------------------------------- |
| POST   | `/enrollments`                    | Start workflow for a contact           |
| GET    | `/enrollments`                    | List all enrollments                   |
| GET    | `/enrollments/:id`                | Get enrollment status + workflow state |
| POST   | `/enrollments/:id/update-cadence` | Signal running workflow with new steps |

## Example API Calls

### 1. Create a cadence

```bash
curl -X POST http://localhost:3001/cadences \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Flow",
    "steps": [
      { "id": "1", "type": "SEND_EMAIL", "subject": "Welcome", "body": "Hello there" },
      { "id": "2", "type": "WAIT", "seconds": 10 },
      { "id": "3", "type": "SEND_EMAIL", "subject": "Follow up", "body": "Checking in" }
    ]
  }'
```

### 2. Enroll a contact (starts Temporal workflow)

```bash
curl -X POST http://localhost:3001/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "cadenceId": "cad_XXXXXXXXXX",
    "contactEmail": "user@example.com"
  }'
```

### 3. Check enrollment status

```bash
curl http://localhost:3001/enrollments/enr_XXXXXXXXXX
```

Response includes `workflowState` with `currentStepIndex`, `stepsVersion`, and `status`.

### 4. Update a running workflow's cadence

```bash
curl -X POST http://localhost:3001/enrollments/enr_XXXXXXXXXX/update-cadence \
  -H "Content-Type: application/json" \
  -d '{
    "steps": [
      { "id": "1", "type": "SEND_EMAIL", "subject": "Welcome", "body": "Hello there" },
      { "id": "2", "type": "WAIT", "seconds": 5 },
      { "id": "3", "type": "SEND_EMAIL", "subject": "Updated follow up", "body": "New message" },
      { "id": "4", "type": "SEND_EMAIL", "subject": "Bonus email", "body": "Extra step added!" }
    ]
  }'
```

## Cadence Payload Structure

```json
{
  "id": "cad_123",
  "name": "Welcome Flow",
  "steps": [
    {
      "id": "1",
      "type": "SEND_EMAIL",
      "subject": "Welcome",
      "body": "Hello there"
    },
    {
      "id": "2",
      "type": "WAIT",
      "seconds": 10
    },
    {
      "id": "3",
      "type": "SEND_EMAIL",
      "subject": "Follow up",
      "body": "Checking in"
    }
  ]
}
```

## Workflow Behavior

- Steps execute **sequentially**.
- `WAIT` steps use Temporal's durable `sleep()`.
- `SEND_EMAIL` steps call a **mock activity** that logs and returns success.
- The workflow maintains `currentStepIndex`, `stepsVersion`, and `status`.
- A **signal** (`updateCadence`) replaces the steps at runtime:
  - Already completed steps stay completed.
  - `currentStepIndex` is preserved.
  - If the new steps list is shorter than or equal to `currentStepIndex`, the workflow completes.
  - Otherwise it continues from the current position with the new steps.
  - `stepsVersion` increments on each update.
- A **query** (`getState`) returns the current workflow state at any time.

## Mock Email

The `sendEmail` activity does **not** call any real email provider. It logs the action and returns:

```json
{
  "success": true,
  "messageId": "<uuid>",
  "timestamp": 1234567890
}
```
