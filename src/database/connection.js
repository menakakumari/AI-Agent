import path from "path";
import { Kysely, SqliteDialect } from "kysely";
import Database from "better-sqlite3";

const { APP_PATH } = process.env;

const sqlite = new Database(path.join(APP_PATH, "sqlite/sqlite.db"), {
  fileMustExist: false,
});

sqlite.pragma("journal_mode = WAL"); // concurrency improve
sqlite.pragma("synchronous = NORMAL"); // performance vs safety balance
sqlite.pragma("foreign_keys = ON"); // enforce relations
sqlite.pragma("busy_timeout = 5000"); // avoid lock errors

const db = new Kysely({
  dialect: new SqliteDialect({
    database: sqlite,
  }),
});

export default db;
