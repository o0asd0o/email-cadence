import type {
  Cadence,
  CadenceStep,
  CreateCadenceDto,
  CreateEnrollmentDto,
  Enrollment,
  UpdateCadenceDto,
  UpdateCadenceSignalDto,
  WorkflowState,
} from "@cadence/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Enrollment enriched with live Temporal workflow state. */
export interface EnrollmentWithState extends Enrollment {
  workflowState?: WorkflowState;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Cadences ────────────────────────────────────────────────

export function createCadence(body: CreateCadenceDto) {
  return request<Cadence>("/cadences", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getCadence(id: string) {
  return request<Cadence>(`/cadences/${id}`);
}

export function getCadences() {
  return request<Cadence[]>("/cadences");
}

export function updateCadence(id: string, body: UpdateCadenceDto) {
  return request<Cadence>(`/cadences/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// ── Enrollments ─────────────────────────────────────────────

export function createEnrollment(body: CreateEnrollmentDto) {
  return request<Enrollment>("/enrollments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getEnrollment(id: string) {
  return request<EnrollmentWithState>(`/enrollments/${id}`);
}

export function getEnrollments() {
  return request<Enrollment[]>("/enrollments");
}

export function updateEnrollmentCadence(
  id: string,
  body: UpdateCadenceSignalDto,
) {
  return request<void>(`/enrollments/${id}/update-cadence`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
