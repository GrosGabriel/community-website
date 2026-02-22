import postgres from "postgres";

const databaseUrl = Deno.env.get("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export const sql = postgres(databaseUrl);