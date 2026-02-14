import { Injectable, NotFoundException } from "@nestjs/common";
import { nanoid } from "nanoid";
import type {
  Cadence,
  CadenceStep,
  CreateCadenceDto,
  UpdateCadenceDto,
} from "@cadence/shared";
import { DatabaseService } from "../db/database.service";

@Injectable()
export class CadencesService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateCadenceDto): Promise<Cadence> {
    const id = `cad_${nanoid(10)}`;
    const now = new Date().toISOString();

    await this.database.db
      .insertInto("Cadence")
      .values({
        id,
        name: dto.name,
        steps: JSON.stringify(dto.steps),
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    return { id, name: dto.name, steps: dto.steps };
  }

  async findById(id: string): Promise<Cadence> {
    const row = await this.database.db
      .selectFrom("Cadence")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!row) {
      throw new NotFoundException(`Cadence ${id} not found`);
    }

    return { id: row.id, name: row.name, steps: JSON.parse(row.steps) };
  }

  async findAll(): Promise<Cadence[]> {
    const rows = await this.database.db
      .selectFrom("Cadence")
      .selectAll()
      .orderBy("createdAt", "desc")
      .execute();

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      steps: JSON.parse(row.steps),
    }));
  }

  async update(id: string, dto: UpdateCadenceDto): Promise<Cadence> {
    // Ensure exists
    await this.findById(id);

    const updates: Record<string, string> = {
      updatedAt: new Date().toISOString(),
    };
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.steps !== undefined) updates.steps = JSON.stringify(dto.steps);

    await this.database.db
      .updateTable("Cadence")
      .set(updates)
      .where("id", "=", id)
      .execute();

    return this.findById(id);
  }
}
