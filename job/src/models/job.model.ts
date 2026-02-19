import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  companyId: mongoose.Types.ObjectId;
  companyName: string;

  title: string;
  description: string;
  location: string;

  workType: "Full-time" | "Part-time" | "Contract" | "Internship";
  workMode: "On-site" | "Remote" | "Hybrid";

  experienceLevel: "Fresher" | "1-3 years" | "3-5 years" | "5+ years";
  category: string;

  skills: string[];

  salaryRange: {
    min: number;
    max: number;
  };

  openings: number;

  status: "Open" | "Closed";
}

const JobSchema: Schema = new Schema<IJob>({
  companyId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
    companyName: {
    type: String,
    required: true,
  },
    title: {    
    type: String,
    required: true,
  },
    description: {  
    type: String,
    required: true,
  },
    location: {
    type: String,
    required: true,
    },
    workType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],

    required: true,
    },
    workMode: {
    type: String,
    enum: ["On-site", "Remote", "Hybrid"],
    required: true,
    },
    experienceLevel: {
    type: String,
    enum: ["Fresher", "1-3 years", "3-5 years", "5+ years"],
    required: true,
    },
    category: {
    type: String,
    required: true,
    },
    skills: {
    type: [String],
    required: true,
    },
    salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    },
    openings: {
    type: Number,
    required: true,
    },
    status: {
    type: String,
    enum: ["Open", "Closed"],
    default: "Open",
    },
});

export const jobModel = mongoose.model<IJob>("job", JobSchema);