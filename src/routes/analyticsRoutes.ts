import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// Only admins can access analytics
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAnalytics);

export default router;
