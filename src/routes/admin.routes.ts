import express from "express";
import { adminSignup, adminLogin } from "../controllers/admin.controller";
import { adminAuthMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// router.post("/signup", adminSignup);
router.post("/login", adminLogin);

// Protect all routes after this middleware
router.use(adminAuthMiddleware);

// Add other protected admin routes here

export default router;