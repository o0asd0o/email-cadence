import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { DB } from "./types";

// Resolve DB path relative to this source file → apps/api/data/cadence.db
const DB_PATH = path.resolve(__dirname, "..", "..", "data", "cadence.db");

@Injectable()
export class DatabaseService implements OnModuleInit {
  public readonly db: Kysely<DB>;

  constructor() {
    // Ensure the data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const dialect = new SqliteDialect({
      database: new SQLite(DB_PATH),
    });

    this.db = new Kysely<DB>({ dialect });
  }

  async onModuleInit() {
    console.log(`SQLite database ready at ${DB_PATH}`);
  }
}
