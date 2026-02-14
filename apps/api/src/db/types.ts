import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Cadence = {
    id: string;
    name: string;
    steps: string;
    createdAt: Generated<string>;
    updatedAt: string;
};
export type Enrollment = {
    id: string;
    cadenceId: string;
    contactEmail: string;
    workflowId: string;
    createdAt: Generated<string>;
};
export type DB = {
    Cadence: Cadence;
    Enrollment: Enrollment;
};
