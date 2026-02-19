import companyModel, { ICompany } from "../models/company.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../utils/jwt";
import { uploadImage } from "../utils/imagekit.service";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await companyModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    const hashedOtp = await bcrypt.hash(otp, 10);
    const newCompany = new companyModel({
      name,
      email,
      password: hashedPassword,
      emailOtp: hashedOtp,
      emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });
    await newCompany.save();
    const token = generateToken({
      companyId: newCompany._id.toString(),
      role: "company",
      name: newCompany.name,
      isVerified: newCompany.isVerified,
      provider: newCompany.provider,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.status(201).json({
      message: "company registered successfully",
      token,
      company: {
        name: newCompany.name,
        email: newCompany.email,
        role: newCompany.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
    console.error("Registration error:", error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const company = await companyModel.findOne({ email });

    if (!company) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (company.provider === "google") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    if (!company.password) {
      return res.status(400).json({
        message: "Password not set for this account",
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      companyId: company._id.toString(),
      role: "company",
      name: company.name,
      isVerified: company.isVerified,
      provider: company.provider,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        name: company.name,
        email: company.email,
        role: company.role,
      },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};

export const updateCompanyProfile = async (req: Request, res: Response) => {
  const companyId = (req.user as { id: string }).id;

  const { name, bio, location, industry, socialLinks } = req.body;

  const logoFile = req.file;

  const updateData: Partial<ICompany> = {};

  try {
    // Basic fields
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (industry) updateData.industry = industry;

    // Social links (nested object)
    if (socialLinks) {
      updateData.socialLinks = socialLinks;
    }

    // Logo Upload
    if (logoFile) {
      const image = await uploadImage({
        buffer: logoFile.buffer,
        folder: "/company-logos",
      });

      updateData.logo = image.url;
    }

    const updatedCompany = await companyModel.findByIdAndUpdate(
      companyId,
      updateData,
      { new: true },
    );

    return res.status(200).json({
      message: "Company profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update company profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    /* 1️⃣ Find company */
    const company = await companyModel.findOne({ email });

    if (!company) {
      return res.status(404).json({ message: "User not found" });
    }

    /* 2️⃣ Blocked user check */
    if (company.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    /* 3️⃣ Already verified */
    if (company.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    /* 4️⃣ OTP existence */
    if (!company.emailOtp || !company.emailOtpExpiry) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    /* 5️⃣ OTP expired */
    if (company.emailOtpExpiry.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    /* 6️⃣ OTP attempts limit */
    if (company.emailOtpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    /* 7️⃣ Compare OTP */
    const isOtpValid = await bcrypt.compare(otp, company.emailOtp);

    if (!isOtpValid) {
      company.emailOtpAttempts += 1;
      await company.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    /* 8️⃣ SUCCESS — verify user */
    company.isVerified = true;
    company.emailOtp = undefined;
    company.emailOtpExpiry = undefined;
    company.emailOtpAttempts = 0;
    company.emailOtpResendAt = undefined;

    await company.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resendEmailOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const company = await companyModel.findOne({ email });

    if (!company) {
      return res.status(404).json({ message: "User not found" });
    }
    if (company.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }
    if (company.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    if (
      company.emailOtpResendAt &&
      company.emailOtpResendAt.getTime() > Date.now()
    ) {
      const waitTime = Math.ceil(
        (company.emailOtpResendAt.getTime() - Date.now()) / 1000,
      );
      return res
        .status(429)
        .json({
          message: `Please wait ${waitTime} seconds before requesting a new OTP.`,
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    const hashedOtp = await bcrypt.hash(otp, 10);
    company.emailOtp = hashedOtp;
    company.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    company.emailOtpAttempts = 0;
    company.emailOtpResendAt = new Date(Date.now() + 60 * 1000);
    await company.save();
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
    console.error("Resend OTP error:", error);
  }
};

export const addCredits = async (req: Request, res: Response) => {
  const { credits } = req.body;

  if (!credits || credits <= 0) {
    return res.status(400).json({ message: "Invalid credits amount" });
  }

  try {
    const authUser = req.user as { id: string };

    if (!authUser?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user: ICompany | null = await companyModel.findById(authUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.credits += credits;
    await user.save();

    return res.status(200).json({
      message: "Credits added successfully",
      credits: user.credits,
    });
  } catch (error) {
    console.error("Add credits error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deductCredits = async (req: Request, res: Response) => {
  const { credits } = req.body;

  if (!credits || credits <= 0) {
    return res.status(400).json({ message: "Invalid credits amount" });
  }

  try {
    const authUser = req.user as { id: string };

    if (!authUser?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user: ICompany | null = await companyModel.findById(authUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < credits) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    user.credits -= credits;
    await user.save();

    return res.status(200).json({
      message: "Credits deducted successfully",
      credits: user.credits,
    });
  } catch (error) {
    console.error("Deduct credits error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
