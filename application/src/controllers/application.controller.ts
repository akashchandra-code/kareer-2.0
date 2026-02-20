import { Request, Response } from 'express';
import mongoose from 'mongoose';
import application from '../models/application.model';
import uploadImage from '../utils/imagekit';
import axios from 'axios';
import { env } from '../config/env';


export const createApplication = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("Received application creation request");
    const userId = req.user?.userId;
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("Authenticated user ID:", userId);
    const { jobId, coverLetter } = req.body;

    // 1️⃣ Auth check
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2️⃣ Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // 3️⃣ Resume check
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    // 4️⃣ Prevent duplicate application
    const existing = await application.findOne({
      jobId,
      userId,
      isWithdrawn: false,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied to this job",
      });
    }
    console.log("Passed all checks, proceeding to fetch job details and upload resume");
    // 5️⃣ Fetch job from Job Service
    const jobResponse = await axios.get(
      `${env.JOB_SERVICE_URL}/api/jobs/${jobId}`,
      {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
    );
    console.log("Job details fetched from Job Service:", jobResponse.data.companyId);
    const companyId = jobResponse.data.companyId;
    console.log("Extracted company ID:", companyId);
    if (!companyId) {
      return res.status(400).json({
        message: "Invalid job data",
      });
    }

    // 6️⃣ Upload resume
    const result = await uploadImage(req.file);

    // 7️⃣ Create application
    const newApplication = await application.create({
      jobId,
      userId,
      companyId,
      resumeUrl: result.url,
      coverLetter,
    });

    return res.status(201).json({
      message: "Application created successfully",
      application: newApplication,
    });

  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserApplications = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const applications = await application.find({ userId, isWithdrawn: false });
    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.error("Error fetching user applications:", error);
  }
};

export const getJobApplicants = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId = req.user?.companyId;
    const jobId = req.params.jobId;
    console.log("Received request to fetch applicants for job ID:", jobId, "by company ID:", companyId);
    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const job = await application.findOne({ jobId: jobId });
    console.log("Fetched job for applicants:", job);
    if(!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.companyId.toString() !== companyId) {
      return res.status(403).json({ message: "Forbidden: You do not have access to this job's applicants" });
    }
    const applicants = await application.find({ jobId, isWithdrawn: false });
    return res.status(200).json({
      message: "Applicants fetched successfully",
      applicants,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.error("Error fetching company applications:", error);
  }
}

export const withdrawApplication = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const applicationId = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }
    const applicationToWithdraw = await application.findOne({
      _id: applicationId,
      userId,
      isWithdrawn: false,
    });
    if (!applicationToWithdraw) {
      return res.status(404).json({ message: "Application not found or already withdrawn" });
    }
    await application.findByIdAndUpdate(applicationId, { isWithdrawn: true });
    return res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
    console.error("Error withdrawing application:", error);
  }
}

export const getApplicantById = async (req: Request, res: Response) => {
  try {
    const applicantId = req.params.applicantId;
    console.log("Received request to fetch applicant by ID:", applicantId);
    if(!applicantId){
      return res.status(400).json({ message: "Applicant ID is required" });
    }
    const applicant = await application.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    return res.status(200).json({
      message: "Applicant fetched successfully",
      applicant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}