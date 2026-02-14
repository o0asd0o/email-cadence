"use client";

import type { CadenceStep, WorkflowStatus } from "@cadence/shared";

interface StepProgressProps {
  steps: CadenceStep[];
  currentStepIndex: number;
  status: WorkflowStatus | "UNKNOWN";
}

export function StepProgress({
  steps,
  currentStepIndex,
  status,
}: StepProgressProps) {
  if (!steps || steps.length === 0) {
    return <p>N/A</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Status</th>
          <th>Type</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {steps.map((step, i) => {
          const isCompleted = i < currentStepIndex;
          const isCurrent = i === currentStepIndex && status === "RUNNING";
          return (
            <tr
              key={step.id ?? i}
              style={{
                background: isCurrent
                  ? "#e8f0fe"
                  : isCompleted
                    ? "#e6f4ea"
                    : "transparent",
              }}
            >
              <td>{i + 1}</td>
              <td>
                {isCompleted
                  ? "✅ Done"
                  : isCurrent
                    ? "▶️ Running"
                    : "⏳ Pending"}
              </td>
              <td>{step.type}</td>
              <td>
                {step.type === "SEND_EMAIL"
                  ? `"${step.subject}"`
                  : step.type === "WAIT"
                    ? `${step.seconds}s`
                    : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
