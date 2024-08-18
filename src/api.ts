import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";

export const api = new Hono<{ Bindings: Env }>();

api.get("users/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.users.findMany();
  return c.json(users);
});
