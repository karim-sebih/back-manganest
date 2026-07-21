import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post("/login", AuthController.login);

authRouter.post("/register", AuthController.register);

authRouter.post("/checkToken", AuthController.checkToken);

export default authRouter;
