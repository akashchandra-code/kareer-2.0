import { Router } from "express";
import multer, { StorageEngine } from "multer";
const router = Router();
const storage: StorageEngine = multer.memoryStorage();
const upload = multer({ storage });

import {
  validateRegistration,
  validateLogin,
    validateEmailOtp,
} from "../middlewares/validator.middleware";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  verifyEmailOtp,
  resendEmailOtp,
  addCredits,
  deductCredits,
  updateUserProfile,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import passport from "../config/passport";
import {env} from '../config/env'

router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/profile", authMiddleware, getCurrentUser);
router.patch("/profile",authMiddleware,upload.single("avatar"), updateUserProfile);
router.get("/logout", logoutUser);
router.post("/verify-otp", validateEmailOtp, verifyEmailOtp);
router.post('/resend-otp', authMiddleware, resendEmailOtp);
router.post("/addCredits", authMiddleware, addCredits);
router.post("/deductCredits", authMiddleware, deductCredits);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "select_account",
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user as { token: string };

    // Redirect back to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth-success?token=${token}`
    );
  }
);

export default router;
