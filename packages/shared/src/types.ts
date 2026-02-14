// ── Step Types ──────────────────────────────────────────────

export interface SendEmailStep {
  id: string;
  type: "SEND_EMAIL";
  subject: string;
  body: string;
}

export interface WaitStep {
  id: string;
  type: "WAIT";
  seconds: number;
}

export type CadenceStep = SendEmailStep | WaitStep;

// ── Cadence ─────────────────────────────────────────────────

export interface Cadence {
  id: string;
  name: string;
  steps: CadenceStep[];
}

export interface CreateCadenceDto {
  name: string;
  steps: CadenceStep[];
}

export interface UpdateCadenceDto {
  name?: string;
  steps?: CadenceStep[];
}

// ── Enrollment ──────────────────────────────────────────────

export interface Enrollment {
  id: string;
  cadenceId: string;
  contactEmail: string;
  workflowId: string;
  createdAt: number;
}

export interface CreateEnrollmentDto {
  cadenceId: string;
  contactEmail: string;
}

export interface UpdateCadenceSignalDto {
  steps: CadenceStep[];
}

// ── Workflow State ──────────────────────────────────────────

export type WorkflowStatus = "RUNNING" | "COMPLETED" | "FAILED";

export interface WorkflowState {
  currentStepIndex: number;
  stepsVersion: number;
  status: WorkflowStatus;
  steps: CadenceStep[];
}

// ── Send Email Result ───────────────────────────────────────

export interface SendEmailResult {
  success: boolean;
  messageId: string;
  timestamp: number;
}

// ── Workflow Input ──────────────────────────────────────────

export interface CadenceWorkflowInput {
  cadenceId: string;
  contactEmail: string;
  steps: CadenceStep[];
}
