import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// Use the Node.js WebSocket implementation for Termux / Node runtime.
neonConfig.webSocketConstructor = ws;

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Please configure your Neon database connection.",
    );
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
  });

  const db = drizzle({
    client: pool,
    schema,
  });

  return { db, pool };
}

type DbInstance = ReturnType<typeof createDb>;

let dbInstance: DbInstance | undefined;

/**
 * Lazily initializes and reuses the Neon WebSocket Pool + Drizzle client.
 * Server-side only.
 */
function getInstance(): DbInstance {
  if (!dbInstance) {
    dbInstance = createDb();
  }

  return dbInstance;
}

export function getDb() {
  return getInstance().db;
}

export async function closeDb(): Promise<void> {
  if (dbInstance) {
    const instance = dbInstance;
    dbInstance = undefined;
    await instance.pool.end();
  }
}

export type Database = ReturnType<typeof getDb>;
