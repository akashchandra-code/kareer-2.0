import mongoose, { Document } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  resumeUrl: string;
  coverLetter: string;
  status: "pending" | "accepted" | "rejected" | "hired";
  isWithdrawn: boolean;
  appliedAt: Date;
  reviewedAt?: Date;
  updatedAt: Date;
}
const applicationSchema = new mongoose.Schema<IApplication>({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "hired"],
    default: "pending",
  },
  isWithdrawn: { type: Boolean, default: false },
  appliedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
});
const application = mongoose.model<IApplication>(
  "applicationSchema",
  applicationSchema,
);
export default application;
