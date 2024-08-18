import { Hono } from "hono";
import { renderer } from "./renderer";
import { api } from "./api";

const app = new Hono();

app.use(renderer);

app.route("/api/", api);

app.get("*", (c) => {
  return c.render(<h1>Hello!</h1>);
});

export default app;
