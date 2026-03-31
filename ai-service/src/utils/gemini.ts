import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
const ai = new GoogleGenAI({
  apiKey: env.GEMINI_KEY,
});

const aiResponse = async (prompt: string) => {
    
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an AI Resume Analyzer built for a Job Matching System.

Your task is to analyze the resume text and extract structured data 
that directly maps to a job database schema.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do NOT include explanations.
- Do NOT include markdown.
- No extra text.
- Skills must be lowercase.
- Remove duplicate skills.
- Experience level must match EXACTLY one of:
  "Fresher", "1-3 years", "3-5 years", "5+ years"
- Work mode must match EXACTLY one of:
  "On-site", "Remote", "Hybrid"
- Work type must match EXACTLY one of:
  "Full-time", "Part-time", "Contract", "Internship"

Analyze the resume and extract:

1. experienceLevel (must match allowed values exactly)
2. primary_category (e.g., "Frontend Development", "Backend Development", "Full Stack Development", "DevOps", "Data Science", etc.)
3. matching_job_titles (array of 5-10 realistic job titles)
4. skills (array of technical skills only, lowercase)
5. preferred_locations (array of city names if mentioned, otherwise empty array)
6. preferred_work_modes (array from allowed values)
7. preferred_work_types (array from allowed values)
8. searchable_keywords (compact array of important keywords combining skills, domain, and role)

Resume Text:
------------------------
${prompt}
------------------------

Return response in this exact JSON format:

{
  "experienceLevel": "",
  "primary_category": "",
  "matching_job_titles": [],
  "skills": [],
  "preferred_locations": [],
  "preferred_work_modes": [],
  "preferred_work_types": [],
  "searchable_keywords": []
}`,
    config:{
        temperature:0.2,
        responseMimeType:"application/json"
    }
  });
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response text from AI");
  }

  const parsed = JSON.parse(text);

  return parsed;
};

export default aiResponse;
