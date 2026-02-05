import userModel,{IUser} from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken,verifyToken } from "../utlis/jwt";
import { uploadImage } from "../utlis/imagekit.service";


export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp=Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Generated OTP:", otp);
        const hashedOtp=await bcrypt.hash(otp,10);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            emailOtp: hashedOtp,
            emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        });
        await newUser.save();
        const token = generateToken({ userId: newUser._id.toString(), role: role || "user", provider: "local" });
        res.cookie("token", token, {
            httpOnly: true,
            secure:true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
        console.error("Registration error:", error);
    }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        message: "Please login using Google"
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Password not set for this account"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      provider: user.provider,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    return res.status(200).json({ user: req.user });
}

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = (req.user as { id: string }).id;
  const { name, bio, location, socialLinks } = req.body;
  const avatarFile = req.file;
  const updateData: Partial<IUser> = {};
  try {
    if(name){
      updateData.name = name;
    }
    if(bio){
      updateData.bio = bio;
    }
    if(location){
      updateData.location = location
    };
    if(socialLinks){
      updateData.socialLinks = socialLinks;
    }
    if(avatarFile){
      const image = await uploadImage({
        buffer: avatarFile.buffer,
        folder: "/pfp",
      });
      updateData.avatar = image.url;
    }
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({ message: "Logged out successfully" });
}

export const verifyEmailOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    /* 1️⃣ Find user */
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* 2️⃣ Blocked user check */
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    /* 3️⃣ Already verified */
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    /* 4️⃣ OTP existence */
    if (!user.emailOtp || !user.emailOtpExpiry) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    /* 5️⃣ OTP expired */
    if (user.emailOtpExpiry.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    /* 6️⃣ OTP attempts limit */
    if (user.emailOtpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    /* 7️⃣ Compare OTP */
    const isOtpValid = await bcrypt.compare(otp, user.emailOtp);

    if (!isOtpValid) {
      user.emailOtpAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    /* 8️⃣ SUCCESS — verify user */
    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    user.emailOtpAttempts = 0;
    user.emailOtpResendAt = undefined;

    await user.save();

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
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    if (user.emailOtpResendAt && user.emailOtpResendAt.getTime() > Date.now()) {
      const waitTime = Math.ceil((user.emailOtpResendAt.getTime() - Date.now()) / 1000);
      return res.status(429).json({ message: `Please wait ${waitTime} seconds before requesting a new OTP.` });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.emailOtp = hashedOtp;
    user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.emailOtpAttempts = 0;
    user.emailOtpResendAt = new Date(Date.now() + 60 * 1000);
    await user.save();
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
    console.error("Resend OTP error:", error);
  }
}

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

    const user: IUser | null = await userModel.findById(authUser.id);

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

    const user: IUser | null = await userModel.findById(authUser.id);

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