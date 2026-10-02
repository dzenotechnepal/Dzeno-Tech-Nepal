import express from "express";
import { getEmailStatus, sendInternalEmail } from "../controller/email.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(authenticate, authorize("admin", "superadmin", "ceo"));
router.get("/status", getEmailStatus);
router.post("/send", sendInternalEmail);

export default router;
