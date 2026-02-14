"use client";

import type { Enrollment, WorkflowState } from "@cadence/shared";

interface EnrollmentInfoProps {
  enrollment: Enrollment;
  workflowState: WorkflowState | undefined;
}

export function EnrollmentInfo({
  enrollment,
  workflowState: ws,
}: EnrollmentInfoProps) {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <strong>Cadence ID</strong>
          </td>
          <td>{enrollment.cadenceId}</td>
        </tr>
        <tr>
          <td>
            <strong>Contact Email</strong>
          </td>
          <td>{enrollment.contactEmail}</td>
        </tr>
        <tr>
          <td>
            <strong>Workflow ID</strong>
          </td>
          <td>
            <code>{enrollment.workflowId}</code>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Status</strong>
          </td>
          <td
            style={{
              fontWeight: "bold",
              color:
                ws?.status === "COMPLETED"
                  ? "green"
                  : ws?.status === "RUNNING"
                    ? "blue"
                    : "red",
            }}
          >
            {ws?.status ?? "UNKNOWN"}
          </td>
        </tr>
        <tr>
          <td>
            <strong>Current Step Index</strong>
          </td>
          <td>
            {ws?.currentStepIndex != null && ws?.steps
              ? `${ws.currentStepIndex} of ${ws.steps.length} steps completed`
              : "N/A"}
          </td>
        </tr>
        <tr>
          <td>
            <strong>Steps Version</strong>
          </td>
          <td>{ws?.stepsVersion ?? "N/A"}</td>
        </tr>
      </tbody>
    </table>
  );
}
