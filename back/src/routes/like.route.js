import express from "express";
import { getLikesByChapter, addLike, removeLike } from "../controllers/LikeController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/chapter/:id", getLikesByChapter);
router.post("/chapter/:id", AuthMiddleware, addLike);
router.delete("/chapter/:id", AuthMiddleware, removeLike);

export default router;