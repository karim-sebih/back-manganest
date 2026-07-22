import { Router } from "express";
import { proxyImage } from "../controllers/imageProxy.controller.js";

const router = Router();

router.get("/api/image", proxyImage);

export default router;