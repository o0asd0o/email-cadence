import {
  proxyActivities,
  defineSignal,
  defineQuery,
  setHandler,
  sleep,
} from "@temporalio/workflow";

import type {
  CadenceStep,
  CadenceWorkflowInput,
  WorkflowState,
} from "@cadence/shared";

// Activities proxy – must match the activity function signatures
import type * as activities from "./activities";

const { sendEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: "30 seconds",
});

// ── Signals & Queries ───────────────────────────────────────

export const updateCadenceSignal =
  defineSignal<[CadenceStep[]]>("updateCadence");

export const getStateQuery = defineQuery<WorkflowState>("getState");

// ── Workflow ────────────────────────────────────────────────

export async function cadenceWorkflow(
  input: CadenceWorkflowInput,
): Promise<WorkflowState> {
  // Using a mutable state object so signal handlers can mutate across awaits
  const state: {
    steps: CadenceStep[];
    currentStepIndex: number;
    stepsVersion: number;
    status: string;
  } = {
    steps: [...input.steps],
    currentStepIndex: 0,
    stepsVersion: 1,
    status: "RUNNING",
  };

  // Handle signal: replace steps at runtime
  setHandler(updateCadenceSignal, (newSteps: CadenceStep[]) => {
    state.steps = newSteps;
    state.stepsVersion += 1;

    // If new steps length <= currentStepIndex, mark completed
    if (state.steps.length <= state.currentStepIndex) {
      state.status = "COMPLETED";
    }
  });

  // Handle query: return current workflow state
  setHandler(
    getStateQuery,
    (): WorkflowState => ({
      currentStepIndex: state.currentStepIndex,
      stepsVersion: state.stepsVersion,
      status: state.status as WorkflowState["status"],
      steps: state.steps,
    }),
  );

  // Helper to read status without TypeScript narrowing
  // (signal handlers mutate state.status between awaits, but TS control-flow doesn't know)
  const isRunning = () => state.status === "RUNNING";
  const isCompleted = () => state.status === "COMPLETED";

  // Execute steps sequentially
  while (state.currentStepIndex < state.steps.length) {
    if (!isRunning()) break;

    const step = state.steps[state.currentStepIndex];

    if (step.type === "SEND_EMAIL") {
      await sendEmail(input.contactEmail, step.subject, step.body);
    } else if (step.type === "WAIT") {
      await sleep(step.seconds * 1000);
    }

    state.currentStepIndex += 1;

    // After incrementing, re-check in case a signal changed steps mid-execution
    if (isCompleted()) {
      break;
    }
    if (state.currentStepIndex >= state.steps.length) {
      state.status = "COMPLETED";
    }
  }

  // Ensure final status
  if (state.status !== "FAILED") {
    state.status = "COMPLETED";
  }

  return {
    currentStepIndex: state.currentStepIndex,
    stepsVersion: state.stepsVersion,
    status: state.status as WorkflowState["status"],
    steps: state.steps,
  };
}
