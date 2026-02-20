import { Router, Request } from "express";
const router = Router();
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
import createAuthMiddleware from "../middlewares/auth.middleware";
import { createApplication,
    getUserApplications,
     withdrawApplication,
     getJobApplicants,
     getApplicantById } from "../controllers/application.controller";
console.log("Application routes loaded");

router.post(
  "/",
  createAuthMiddleware(["user"]),
  upload.single("file"),
  createApplication,
);
router.get(
  "/user",
  createAuthMiddleware(["user"]),
  getUserApplications,
);
router.get('/job/:jobId',
    createAuthMiddleware(['company']),
    getJobApplicants
)
router.get('/:applicantId', createAuthMiddleware(['company']), getApplicantById)
router.patch(
  "/withdraw/:id",
  createAuthMiddleware(["user"]),
  withdrawApplication,
);

export default router;
