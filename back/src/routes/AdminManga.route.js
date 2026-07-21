import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { GetPendingManga, ApproveManga, RejectManga, GetApprovedManga, DeleteManga } from "../controllers/Admin/AdminMangaController.js";

const router = express.Router();

router.get("/pending", AuthMiddleware, GetPendingManga);
router.get("/approved", AuthMiddleware, GetApprovedManga);
router.put("/:id/approve", AuthMiddleware, ApproveManga);
router.put("/:id/reject", AuthMiddleware, RejectManga);
router.delete("/:id", AuthMiddleware, DeleteManga);

export default router;
