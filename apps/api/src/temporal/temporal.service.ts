import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client, Connection } from "@temporalio/client";
import {
  TEMPORAL_ADDRESS,
  TEMPORAL_NAMESPACE,
  TEMPORAL_TASK_QUEUE,
  WORKFLOW_ID_PREFIX,
  type CadenceStep,
  type CadenceWorkflowInput,
  type WorkflowState,
} from "@cadence/shared";

@Injectable()
export class TemporalService implements OnModuleInit {
  private client: Client | null = null;

  async onModuleInit() {
    try {
      const connection = await Connection.connect({
        address: TEMPORAL_ADDRESS,
      });
      this.client = new Client({
        connection,
        namespace: TEMPORAL_NAMESPACE,
      });
      console.log(`Temporal client connected to ${TEMPORAL_ADDRESS}`);
    } catch (err) {
      console.warn(
        `⚠ Could not connect to Temporal at ${TEMPORAL_ADDRESS}: ${(err as Error).message}`,
      );
      console.warn("Temporal-dependent features will be unavailable.");
    }
  }

  private ensureClient(): Client {
    if (!this.client) {
      throw new Error(
        "Temporal client is not connected. Is the Temporal server running?",
      );
    }
    return this.client;
  }

  /**
   * Start a cadence workflow for an enrollment.
   */
  async startWorkflow(
    enrollmentId: string,
    cadenceId: string,
    contactEmail: string,
    steps: CadenceStep[],
  ): Promise<string> {
    const client = this.ensureClient();
    const workflowId = `${WORKFLOW_ID_PREFIX}-${enrollmentId}`;

    await client.workflow.start("cadenceWorkflow", {
      taskQueue: TEMPORAL_TASK_QUEUE,
      workflowId,
      args: [
        {
          cadenceId,
          contactEmail,
          steps,
        } satisfies CadenceWorkflowInput,
      ],
    });

    return workflowId;
  }

  /**
   * Query the running workflow for its current state.
   */
  async getWorkflowState(workflowId: string): Promise<WorkflowState> {
    const client = this.ensureClient();
    const handle = client.workflow.getHandle(workflowId);
    return handle.query<WorkflowState>("getState");
  }

  /**
   * Send the updateCadence signal with new steps to a running workflow.
   */
  async signalUpdateCadence(
    workflowId: string,
    steps: CadenceStep[],
  ): Promise<void> {
    const client = this.ensureClient();
    const handle = client.workflow.getHandle(workflowId);
    await handle.signal("updateCadence", steps);
  }
}
