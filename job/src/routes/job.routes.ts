import { Router } from "express";
const router = Router();
import createAuthMiddleware from "../middlewares/auth.middleware";
import { emailIsVerified } from "../middlewares/auth.middleware";
import {
  validateJobCreation,
  validateJobUpdate,
} from "../middlewares/validator.middleware";
import {
  createJob,
  getAllJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
} from "../controllers/job.controller";

router.post(
  "/",
  createAuthMiddleware(["company", "admin"]),
  emailIsVerified,
  validateJobCreation,
  createJob,
);
router.get("/", getAllJobs);
router.get(
  "/company",
  createAuthMiddleware(["company", "admin"]),
  getCompanyJobs,
);
router.get(
  "/:id",
  createAuthMiddleware(["company", "user", "admin"]),
  getJobById,
);

router.patch(
  "/:id",
  createAuthMiddleware(["company", "admin"]),
  validateJobUpdate,
  updateJob,
);
router.delete("/:id", createAuthMiddleware(["company", "admin"]), deleteJob);

export default router;
