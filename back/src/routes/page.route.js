import express from "express"
import { CreatePages, GetPagesByChapter, UpdatePage, DeletePage } from "../controllers/PageController.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"
import upload from "../middlewares/upload.js";


const router = express.Router();

router.post("/chapter/:id", AuthMiddleware, upload.array("pages", 100), CreatePages);
router.get("/chapter/:chapter_id", GetPagesByChapter);
router.put("/:id", AuthMiddleware, UpdatePage);
router.delete("/:id", AuthMiddleware, DeletePage);


export default router