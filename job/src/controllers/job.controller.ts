import { jobModel } from "../models/job.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
export const createJob = async (req:Request, res:Response) => {
    const { title, description, location, workType, workMode, experienceLevel, category, skills, salaryRange, openings, status } = req.body;
    console.log("Creating job with data:", req.body);
    console.log("User info from request:", req.user);
    console.log("Company ID from request:", req.user?.companyId);
    console.log("Company Name from request:", req.user?.name);
    console.log("JWT Secret in environment:", process.env.JWT_SECRET);
    try {
        const newJob = new jobModel({
            companyId: req.user!.companyId,
            companyName: req.user!.name,
            title,
            description,
            location,   
            workType,
            workMode,
            experienceLevel,
            category,
            skills,
            salaryRange,
            openings,
            status,
        });
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
        
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error("Error creating job:", error);
    }
}
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const {
      jobType,
      workMode,
      experience,
      minSalary,
      maxSalary,
      search,
      page = "1",
      limit = "10",
    } = req.query;

    // Convert page & limit to number
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object dynamically
    const filter: any = {
      status: "Open",
    };

    // Job Type filter
    if (jobType) {
      filter.workType = jobType;
    }

    // Work Mode filter
    if (workMode) {
      filter.workMode = workMode;
    }

    // Experience filter
    if (experience) {
      filter.experienceLevel = experience;
    }

    // Salary filter
    if (minSalary || maxSalary) {
      filter.salaryRange = {};
      if (minSalary) {
        filter.salaryRange.$gte = Number(minSalary);
      }
      if (maxSalary) {
        filter.salaryRange.$lte = Number(maxSalary);
      }
    }

    // Search filter (title + skills)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query
    const jobs = await jobModel
      .find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalJobs = await jobModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalJobs,
      page: pageNumber,
      totalPages: Math.ceil(totalJobs / limitNumber),
      jobs,
    });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await jobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
    } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error("Error fetching job by ID:", error);
  }
};

export const getCompanyJobs = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    console.log("Fetching jobs for company ID:", companyId);
    if (!companyId) {
      return res.status(401).json({
        message: "Unauthorized: Company ID missing",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID",
      });
    }

    const jobs = await jobModel.find({
      companyId: companyId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await jobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.companyId.toString() !== req.user!.companyId) {
      return res.status(403).json({ message: "Forbidden: Not your job" });
    }
    const updates = req.body;
    Object.assign(job, updates);
    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error("Error updating job:", error);
  }
};
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await jobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.companyId.toString() !== req.user!.companyId) {
      return res.status(403).json({ message: "Forbidden: Not your job" });
    }
    await jobModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error("Error deleting job:", error);
  }
};