import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "dist");
const port = Number(process.env.PORT || 3100);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
if (!existsSync(resolve(root, "index.html"))) {
  console.error("Sunum dosyalari bulunamadi. Once npm run build calistirin.");
  process.exit(1);
}
const server = createServer((req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-cache");
  if (!["GET", "HEAD"].includes(req.method ?? "")) {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
  } catch {
    res.writeHead(400);
    res.end("Invalid URL");
    return;
  }
  const file = resolve(root, pathname === "/" ? "index.html" : `.${pathname}`);
  if (
    !file.startsWith(root + sep) ||
    !existsSync(file) ||
    !statSync(file).isFile()
  ) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.writeHead(200, {
    "Content-Type": mime[extname(file)] || "application/octet-stream",
  });
  if (req.method === "HEAD") res.end();
  else
    createReadStream(file)
      .on("error", () => res.destroy())
      .pipe(res);
});
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `Port ${port} zaten kullanimda. Acik demo icin http://127.0.0.1:${port} adresini kontrol edin.`
      : error.message,
  );
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () =>
  console.log(
    `\nKariyer Kure - Ideathon demosu\nhttp://127.0.0.1:${port}\n\nInternet gerekmez. Durdurmak icin Ctrl+C.\n`,
  ),
);
