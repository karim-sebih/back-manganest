import express from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const profileRouter = express.Router();

profileRouter.get(
    "/me",
    AuthMiddleware,
    UserController.getProfile
);

profileRouter.put(
    "/me",
    AuthMiddleware,
    UserController.updateUser
);

profileRouter.get(
    "/settings",
    AuthMiddleware,
    UserController.getSettings
);
export default profileRouter;