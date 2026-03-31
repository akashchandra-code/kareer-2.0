import { jobModel } from "../models/job.model";
import fs from "fs";
import PDFParser from "pdf2json";
import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import { rankJobs } from "../utils/rankJobs";

export const createJob = async (req:Request, res:Response) => {
    const { title, description, location, workType, workMode, experienceLevel, category, skills, salaryRange, openings, status } = req.body;
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
export const processAIResume = async (req: Request, res: Response) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  const pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", (err) => {
    console.error(err);
    return res.status(500).json({
      message: "PDF parsing error",
      error: err,
    });
  });

  pdfParser.on("pdfParser_dataReady", async (pdfData) => {
    try {
      let extractedText = "";

      pdfData.Pages.forEach((page: any) => {
        page.Texts.forEach((text: any) => {
          text.R.forEach((r: any) => {
            extractedText += decodeURIComponent(r.T) + " ";
          });
        });
        extractedText += "\n";
      });

      // 🔥 STEP 1: AI ANALYSIS
      const aiRes = await axios.post(
        "http://localhost:3004/api/ai",
        { resumeText: extractedText },
        {
          headers: {
            Authorization: `Bearer ${req.cookies.token}`,
          },
        }
      );

      const aiData = aiRes.data;

      // 🔥 STEP 2: BASIC FILTER (reduce DB load)
      const jobs = await jobModel.find({
        $or: [
          {
            title: {
              $in: aiData.matching_job_titles.map(
                (t: string) => new RegExp(t, "i")
              ),
            },
          },
          {
            skills: {
              $in: aiData.skills,
            },
          },
        ],
      });

      // 🔥 STEP 3: RANK JOBS
      const rankedJobs = rankJobs(jobs, aiData);

      // 🔥 STEP 4: RETURN TOP JOBS
      return res.status(200).json({
        success: true,
        totalJobs: rankedJobs.length,
        topMatches: rankedJobs.slice(0, 10), // top 10
        jobs: rankedJobs,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "AI processing failed" });
    }
  });

  pdfParser.parseBuffer(req.file.buffer);
};
export const bulkCreateJobs = async (req: Request, res: Response) => {
  try {
    const jobs = req.body.jobs;

    // ✅ Check array
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Jobs must be a non-empty array",
      });
    }

    // ✅ Optional: limit size (VERY IMPORTANT)
    if (jobs.length > 500) {
      return res.status(400).json({
        success: false,
        message: "You can only insert up to 500 jobs at a time",
      });
    }

    // ✅ Validate each job manually (light validation)
    const validatedJobs = jobs.map((job) => ({
      companyId: job.companyId,
      companyName: job.companyName,
      title: job.title,
      description: job.description,
      location: job.location,
      workType: job.workType,
      workMode: job.workMode,
      experienceLevel: job.experienceLevel,
      category: job.category,
      skills: job.skills,
      salaryRange: {
        min: job.salaryRange?.min,
        max: job.salaryRange?.max,
      },
      openings: job.openings,
      status: job.status || "Open",
    }));

    // ✅ Insert in DB
    const createdJobs = await jobModel.insertMany(validatedJobs, {
      ordered: false, // 🔥 continues even if some fail
    });

    return res.status(201).json({
      success: true,
      message: "Bulk jobs created successfully",
      count: createdJobs.length,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};