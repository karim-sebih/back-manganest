import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const userRouter = express.Router();



userRouter.get("/", UserController.getUsers);
userRouter.get("/roles", UserController.getRoles);
userRouter.delete("/me", AuthMiddleware, UserController.deleteUser);


export default userRouter;
