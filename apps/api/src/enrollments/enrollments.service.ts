import { Injectable, NotFoundException } from "@nestjs/common";
import { nanoid } from "nanoid";
import type { Enrollment, CadenceStep, WorkflowState } from "@cadence/shared";
import { TemporalService } from "../temporal/temporal.service";
import { CadencesService } from "../cadences/cadences.service";
import { DatabaseService } from "../db/database.service";

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly temporalService: TemporalService,
    private readonly cadencesService: CadencesService,
    private readonly database: DatabaseService,
  ) {}

  async create(cadenceId: string, contactEmail: string): Promise<Enrollment> {
    // Validate cadence exists and get its steps
    const cadence = await this.cadencesService.findById(cadenceId);

    const enrollmentId = `enr_${nanoid(10)}`;
    const workflowId = await this.temporalService.startWorkflow(
      enrollmentId,
      cadenceId,
      contactEmail,
      cadence.steps,
    );

    const now = new Date().toISOString();

    await this.database.db
      .insertInto("Enrollment")
      .values({
        id: enrollmentId,
        cadenceId,
        contactEmail,
        workflowId,
        createdAt: now,
      })
      .execute();

    return {
      id: enrollmentId,
      cadenceId,
      contactEmail,
      workflowId,
      createdAt: Date.now(),
    };
  }

  async findById(
    id: string,
  ): Promise<Enrollment & { workflowState: WorkflowState | null }> {
    const row = await this.database.db
      .selectFrom("Enrollment")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!row) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    const enrollment: Enrollment = {
      id: row.id,
      cadenceId: row.cadenceId,
      contactEmail: row.contactEmail,
      workflowId: row.workflowId,
      createdAt: new Date(row.createdAt).getTime(),
    };

    let workflowState: WorkflowState | null = null;
    try {
      workflowState = await this.temporalService.getWorkflowState(
        enrollment.workflowId,
      );
    } catch (err) {
      // Workflow may have already completed; return null state
      console.warn(
        `Could not query workflow ${enrollment.workflowId}:`,
        (err as Error).message,
      );
    }

    return { ...enrollment, workflowState };
  }

  async findAll(): Promise<Enrollment[]> {
    const rows = await this.database.db
      .selectFrom("Enrollment")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute();

    return rows.map((row) => ({
      id: row.id,
      cadenceId: row.cadenceId,
      contactEmail: row.contactEmail,
      workflowId: row.workflowId,
      createdAt: new Date(row.createdAt).getTime(),
    }));
  }

  async updateCadence(id: string, steps: CadenceStep[]): Promise<void> {
    const row = await this.database.db
      .selectFrom("Enrollment")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!row) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    // Also persist updated steps on the cadence record
    await this.cadencesService.update(row.cadenceId, { steps });

    // Signal the running workflow
    await this.temporalService.signalUpdateCadence(row.workflowId, steps);
  }
}
