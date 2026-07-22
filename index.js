import "dotenv/config";
import express from "express";
import path from "path";
import router from "./src/routes/index.js";
import { setupassociations } from "./src/models/associations.js";
import sequelize from "./src/db/connection.js";

setupassociations();

const app = express();

// ✅ CORS (durci) - DOIT être avant les routes
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // debug: autorise ton front (ou "tout" si tu veux)
  res.header("Access-Control-Allow-Origin", origin || "*");
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  // C’est important pour les requêtes avec Authorization/headers
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Pour les preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// uploads (si tu as des covers/images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/", router);

const PORT = process.env.PORT || 3000;

// auth + DB
sequelize
  .authenticate()
  .then(() => console.log("✅ DB CONNECTED"))
  .catch((err) => console.error("❌ DB CONNECTION FAILED:", err.message));

app.listen(PORT, () => {
  console.log("-----------------------------");
  console.log(`✅ Server running on port ${PORT}`);
  console.log("-----------------------------");
});