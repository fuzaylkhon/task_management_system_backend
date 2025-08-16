import { Router } from "express";
import { body } from "express-validator";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from "../controllers/taskController";
import { protect } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(protect);

router
  .route("/")
  .get(getTasks)
  .post(
    [body("title").notEmpty().trim(), body("description").notEmpty().trim()],
    createTask
  );

router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

router.patch("/:id/toggle", toggleTaskComplete);

export default router;
