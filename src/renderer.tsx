import { reactRenderer } from "@hono/react-renderer";

export const renderer = reactRenderer(({ children }) => {
  return (
    <html>
      <head>
        <link
          rel="shortcut icon"
          href="/static/icon.svg"
          type="image/svg+xml"
        />
      </head>
      <body>{children}</body>
    </html>
  );
});
