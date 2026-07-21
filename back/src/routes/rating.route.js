import express from 'express';
import { createOrUpdateRating, getRatingsByManga, deleteRating } from '../controllers/RatingController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", AuthMiddleware, createOrUpdateRating);
router.get("/manga/:id", getRatingsByManga);
router.delete("/manga/:id", AuthMiddleware, deleteRating);

export default router;