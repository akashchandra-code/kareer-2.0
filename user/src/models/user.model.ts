import mongoose, { Document, Schema } from "mongoose";

/* ---------- Sub Types ---------- */

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

/* ---------- Main User Interface ---------- */

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; 
  role: "user" | "company";
  provider: "local" | "google";

  bio?: string;
  avatar?: string;
  location?: string;

  socialLinks?: ISocialLinks;

  credits: number;

  isVerified: boolean;
  emailOtp?: string;
  emailOtpExpiry?: Date;
  emailOtpAttempts: number;
  emailOtpResendAt?: Date;

  isBlocked: boolean;

  createdAt: Date;
  updatedAt: Date;
}
const socialLinksSchema = new Schema<ISocialLinks>(
  {
    github: String,
    linkedin: String,
    twitter: String,
    portfolio: String,
  },
  { _id: false }
);
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "company"],
      default: "user",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    bio: String,
    avatar: String,
    location: String,

    socialLinks: socialLinksSchema,

    credits: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: String,
    emailOtpExpiry: Date,

    emailOtpAttempts: {
      type: Number,
      default: 0,
    },

    emailOtpResendAt: Date,

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model<IUser>("user", userSchema);
export default userModel; 