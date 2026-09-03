import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/models/schema";
import { getDatabaseEnv } from "@/lib/env";

export function getDb() {
	const sql = neon(getDatabaseEnv().DATABASE_URL);

	return drizzle({ client: sql, schema });
}