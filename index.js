import "dotenv/config";
import express from "express";
import router from "./src/routes/index.js";
import { setupassociations } from "./src/models/associations.js";
import sequelize from "./src/db/connection.js";
import path from "path";

setupassociations();

const app = express();

// ---- CORS (avant tout) ----
const corsOrigins = process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && corsOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---- Parsing ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Static uploads ----
app.use("/uploads", express.static("uploads"));

// ---- Static translations (IMPORTANT) ----
// i18next attend /translations/fr (dans TON loadPath)
app.use("/translations", express.static(path.join(process.cwd(), "translations")));

const PORT = process.env.PORT || 3000;

// Routes API
app.use("/", router);

// Start
sequelize.authenticate()
  .then(() => console.log("✅ DB CONNECTED"))
  .catch((err) => console.error("❌ DB CONNECTION FAILED:", err.message));

app.listen(PORT, () => {
  console.log(`-----------------------------`);
  console.log(`--        OUVERT        --`);
  console.log(`-- http://localhost:${PORT} --`);
  console.log(`-----------------------------`);
});