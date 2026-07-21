import express from "express"
import { CreateManga, GetUsersSelfManga, UpdateSelfManga, DeleteSelfManga, GetSelfMangaById, SubmitManga, GetAllSelfManga } from "../controllers/SelfMangaController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", AuthMiddleware, upload.single("cover"), CreateManga);
router.get("/", AuthMiddleware, GetUsersSelfManga);
router.get("/public", GetAllSelfManga);
router.get("/:id", GetSelfMangaById);
router.put("/:id", AuthMiddleware, UpdateSelfManga);
router.delete("/:id", AuthMiddleware, DeleteSelfManga);
router.put("/:id/submit", AuthMiddleware, SubmitManga);


export default router;