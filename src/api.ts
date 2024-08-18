import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { users } from "../schema";

export const api = new Hono<{ Bindings: Env }>();

api.get("users/", async (c) => {
  const db = drizzle(c.env.DB);

  const result = await db.select().from(users).all();
  return c.json(result);
});
