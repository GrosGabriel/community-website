import postgres from "postgres";

const databaseUrl = Deno.env.get("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const url = new URL(databaseUrl);

export const sql = postgres({
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.slice(1),
  username: url.username,
  password: url.password,
  ssl: { rejectUnauthorized: false },
  connect_timeout: 10,
});