import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import { setupassociations } from "./src/models/associations.js";
import sequelize from "./src/db/connection.js";

setupassociations();

const app = express();

/**
 * CORS
 * - autorise uniquement les origins présentes dans CORS_ORIGINS
 * - répond correctement aux OPTIONS (preflight)
 */
app.use((req, res, next) => {
  const corsOrigins = process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [];
  const origin = req.headers.origin;

  if (origin && corsOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Expose-Headers", "Content-Length");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// (optionnel) ajoute cors pour sécuriser la config, mais le middleware ci-dessus gère déjà le preflight
app.use(cors({
  origin: (origin, cb) => {
    const corsOrigins = process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [];
    if (!origin) return cb(null, true);
    return corsOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parsing JSON → avant les routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;

// Routes
app.use("/", router);

// Start server
sequelize.authenticate()
  .then(() => console.log("✅ DB CONNECTED"))
  .catch((err) => console.error("❌ DB CONNECTION FAILED:", err.message));

app.listen(PORT, () => {
  console.log("-----------------------------");
  console.log("--        OUVERT        --");
  console.log("-----------------------------");
  console.log(`Le serveur est lancé sur http://localhost:${PORT}`);
});