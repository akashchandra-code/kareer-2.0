import { Router,Request } from "express";
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
  processAIResume,
  bulkCreateJobs
} from "../controllers/job.controller";
import multer, { StorageEngine, FileFilterCallback } from "multer";
const storage: StorageEngine = multer.memoryStorage();
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const isPdf =
    file.mimetype === "application/pdf" &&
    file.originalname.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

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
router.post('/ai', createAuthMiddleware(['user']),emailIsVerified,upload.single('file'),processAIResume);
router.post('/bulk',bulkCreateJobs);
export default router;
