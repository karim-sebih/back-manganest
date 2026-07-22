// routes/db.route.js
import express from "express";
import { sequelize } from "../models/index.js"; // <-- adapte si ton export est ailleurs

const router = express.Router();

router.get("/db-test", async (req, res) => {
    try {
        await sequelize.authenticate();
        return res.json({ ok: true, message: "DB connection OK" });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e.message });
    }
});

export default router;