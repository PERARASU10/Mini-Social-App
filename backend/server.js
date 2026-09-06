import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/posts.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
  })
);
app.use(express.json({ limit: "6mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

await connectDb();
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
