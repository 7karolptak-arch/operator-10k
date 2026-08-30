const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 5174;
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

http
  .createServer((req, res) => {
    let u = decodeURIComponent((req.url || "/").split("?")[0]);
    if (u === "/") u = "/index.html";
    const fp = path.join(root, path.normalize(u).replace(/^(\.\.[/\\])+/, ""));
    fs.readFile(fp, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": mime[path.extname(fp)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, () => console.log(`http://127.0.0.1:${port}`));
