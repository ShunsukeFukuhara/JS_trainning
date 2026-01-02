import express from "express";

export const createApp = (rootDirectory) => {
  const app = express();

  app.use(express.static(rootDirectory));

  app.use("/test/mirror", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=UTF-8");
    res.writeHead(200);
    res.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`);
    for (const [key, value] of Object.entries(req.headers)) {
      res.write(`${key}: ${value}\r\n`);
    }
    res.write("\r\n");
    req.pipe(res);
  });

  return app;
};
