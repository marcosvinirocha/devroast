import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não definida no .env.local");
}

export const db = drizzle({
  schema,
  connection: databaseUrl,
});

export { schema, sql };
