import express from "express";
import {
  generatePayslip,
  getPayslips,
  getPayslipById,
  getEmployeePayslips,
  getMyPayslips,
} from "../controller/payslip.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/employee/me", authorize("developer", "employee", "intern"), getMyPayslips);
router.get(
  "/employee/:id",
  authorize("superadmin", "admin", "ceo", "developer", "employee", "intern"),
  getEmployeePayslips,
);
router.get(
  "/:id",
  authorize("superadmin", "admin", "ceo", "developer", "employee", "intern"),
  getPayslipById,
);

router.use(authorize("superadmin", "admin", "ceo"));

router.post("/generate", generatePayslip);
router.get("/", getPayslips);

export default router;
