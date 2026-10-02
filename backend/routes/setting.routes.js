import express from "express";
import { getSettings, updateSettings } from "../controller/setting.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(authenticate);
router.get("/", getSettings);
router.put("/", authorize("admin", "superadmin"), updateSettings);

export default router;
