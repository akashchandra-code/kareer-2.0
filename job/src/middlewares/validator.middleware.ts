import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const respondValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
console.log("Validator middleware loaded");
export const validateJobCreation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("workType")
    .isIn(["Full-time", "Part-time", "Contract", "Internship"])
    .withMessage("Invalid work type"),
  body("workMode")
    .isIn(["On-site", "Remote", "Hybrid"])
    .withMessage("Invalid work mode"),
  body("experienceLevel")
    .isIn(["Fresher", "1-3 years", "3-5 years", "5+ years"])
    .withMessage("Invalid experience level"),
  body("category").notEmpty().withMessage("Category is required"),
  body("skills").isArray().withMessage("Skills must be an array of strings"),
  body("openings")
    .isInt({ min: 1 })
    .withMessage("Openings must be a positive integer"),
  body("status").isIn(["Open", "Closed"]).withMessage("Invalid status"),
  body("salaryRange").custom((value) => {
    if (typeof value !== "object" || value === null) {
      throw new Error("Salary range must be an object with min and max");
    }
    if (typeof value.min !== "number" || typeof value.max !== "number") {
      throw new Error("Salary range min and max must be numbers");
    }
    if (value.min < 0 || value.max < 0) {
      throw new Error("Salary range min and max must be non-negative");
    }
    if (value.min > value.max) {
      throw new Error("Salary range min cannot be greater than max");
    }
    return true;
  }),
  respondValidationErrors,
];

export const validateJobUpdate = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("location")
    .optional()
    .notEmpty()
    .withMessage("Location cannot be empty"),
  body("workType")
    .optional()
    .isIn(["Full-time", "Part-time", "Contract", "Internship"])
    .withMessage("Invalid work type"),
  body("workMode")
    .optional()
    .isIn(["On-site", "Remote", "Hybrid"])
    .withMessage("Invalid work mode"),
  body("experienceLevel")
    .optional()
    .isIn(["Fresher", "1-3 years", "3-5 years", "5+ years"])
    .withMessage("Invalid experience level"),
  body("category")
    .optional()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array of strings"),
  body("openings")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Openings must be a positive integer"),
  body("status")
    .optional()
    .isIn(["Open", "Closed"])
    .withMessage("Invalid status"),
  body("salaryRange")
    .optional()
    .custom((value) => {
      if (typeof value !== "object" || value === null) {
        throw new Error("Salary range must be an object with min and max");
      }
      if (typeof value.min !== "number" || typeof value.max !== "number") {
        throw new Error("Salary range min and max must be numbers");
      }
      if (value.min < 0 || value.max < 0) {
        throw new Error("Salary range min and max must be non-negative");
      }
      if (value.min > value.max) {
        throw new Error("Salary range min cannot be greater than max");
      }
      return true;
    }),
  respondValidationErrors,
];

