import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import { setupassociations } from "./src/models/associations.js";
import sequelize from "./src/db/connection.js";


dotenv.config(); // Charger les variables d'environnement depuis le fichier .env

// Setup model associations
setupassociations();

const app = express(); // Créer une application Express




const corsOrigins = process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [];

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://front-manganest-5lai-l1r8rrzq9-karim-sebihs-projects.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    // important: si origin est undefined (parfois lors de certains appels), on autorise
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// 3. Parsing JSON → ABSOLUMENT AVANT LES ROUTES
app.use(express.json());          // ← pour req.body JSON
app.use(express.urlencoded({ extended: true }));  // ← si tu utilises forms aussi

// 4. Static files
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000; // Définir le port du serveur


// 5. Tes routes
app.use("/", router);

// Démarrer le serveur
sequelize.authenticate()
  .then(() => console.log("✅ DB CONNECTED (Railway)"))
  .catch((err) => console.error("❌ DB CONNECTION FAILED:", err.message))

app.listen(PORT, () => {
  console.log("-----------------------------");
  console.log("--        OUVERT        --");
  console.log("-----------------------------");

  console.log(`Le serveur est lancé sur http://localhost:${PORT}`);
});