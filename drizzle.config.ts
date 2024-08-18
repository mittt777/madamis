import type { Config } from "drizzle-kit";

export default {
  schema: "./schema.ts",
  out: "./migrations",
  driver: "d1-http",
  dialect: "sqlite",
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID!,
    databaseId: process.env.DATABASE_ID!,
    token: process.env.TOKEN!,
  },
} satisfies Config;
