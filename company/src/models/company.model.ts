import mongoose, { Document, Schema } from "mongoose";

/* ---------- Sub Types ---------- */

export interface ISocialLinks {
  
  linkedin?: string;
  website?:string;
  twitter?: string;
  
}

/* ---------- Main User Interface ---------- */

export interface ICompany extends Document {
  name: string;
  email: string;
  password?: string; 
  role:  "company";
  provider: "local" | "google";

  bio?: string;
  logo?: string;
  industry?:string;
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
    
    linkedin: String,
    website:String,
    twitter: String,
    
  },
  { _id: false }
);
const companySchema = new Schema<ICompany>(
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
      enum: [ "company"],
      default: "company",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    bio: String,
    logo: String,
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
const companyModel = mongoose.model<ICompany>("company", companySchema);
export default companyModel; 