import express from 'express';

import { createComment, getCommentsByManga, getCommentsByChapter, deleteComment, updateComment } from '../controllers/CommentsController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";


const router = express.Router();


router.post("/", AuthMiddleware, createComment);
router.get("/manga/:id", getCommentsByManga);
router.get("/chapter/:id", getCommentsByChapter);
router.delete("/:id", AuthMiddleware, deleteComment);
router.put("/:id", AuthMiddleware, updateComment);


export default router;