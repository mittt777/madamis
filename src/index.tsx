import { Hono } from "hono";
import { renderToString } from "react-dom/server";
import { api } from "./api";

const app = new Hono();

app.route("/api", api).get("*", (c) => {
  return c.html(
    renderToString(
      <html lang="ja">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>j∞マダミス部</title>
          <link
            rel="shortcut icon"
            href="/static/icon.svg"
            type="image/svg+xml"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap"
            rel="stylesheet"
          ></link>
          {import.meta.env.PROD ? (
            <>
              <script type="module" src="/static/client.js"></script>
            </>
          ) : (
            <script type="module" src="/src/client.tsx"></script>
          )}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>,
    ),
  );
});

export default app;
