import express from "express";
import { CreateChapter, GetChaptersByManga, UpdateChapter, DeleteChapter, GetChapterById } from "../controllers/ChapterController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router()

router.post("/", AuthMiddleware, CreateChapter);
router.get("/manga/:manga_id", GetChaptersByManga);
router.get("/:id", GetChapterById);
router.put("/:id", AuthMiddleware, UpdateChapter);
router.delete("/:id", AuthMiddleware, DeleteChapter);


export default router
