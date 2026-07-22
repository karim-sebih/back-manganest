import "dotenv/config";
import express from "express";
import router from "./src/routes/index.js";
import { setupassociations } from "./src/models/associations.js";
import sequelize from "./src/db/connection.js";

setupassociations();

const app = express();

// ✅ CORS "debug" ultra sûr : répond pour TOUTES les routes + préflight
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// IMPORTANT pour i18next (si loadPath = /translations/{{lng}})
import path from "path";
app.use("/translations", express.static(path.join(process.cwd(), "translations")));

app.use("/", router);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => console.log("✅ DB CONNECTED"))
  .catch((err) => console.error("❌ DB CONNECTION FAILED:", err.message));

app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});