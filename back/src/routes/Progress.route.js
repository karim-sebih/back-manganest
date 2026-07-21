import express from "express";
import { getProgress, saveProgress, getAllProgress } from "../controllers/ProgressController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", AuthMiddleware, getAllProgress);
router.get("/:mangadex_id", AuthMiddleware, getProgress);
router.post("/", AuthMiddleware, saveProgress);

export default router;