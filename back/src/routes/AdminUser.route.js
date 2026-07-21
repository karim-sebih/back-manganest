import express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import { getAllUsers, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin } from "../controllers/Admin/AdminUserController.js";

const router = express.Router();



router.get("/", AuthMiddleware, getAllUsers);
router.post("/", AuthMiddleware, createUserByAdmin);
router.put("/:id", AuthMiddleware, updateUserByAdmin);
router.delete("/:id", AuthMiddleware, deleteUserByAdmin);

export default router;
