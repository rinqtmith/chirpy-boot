import express, { NextFunction, Response, Request } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const middlewareLogResponses: Middleware = (req, res, next) => {
  res.on("finish", () => {
    const status = res.statusCode;
    if (status !== 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
    }
  });
  next();
};

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);

app.use("/app", express.static("./src/app"));

app.get("/healthz", (_, res) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
