import { Request,Response } from "express";
import aiResponse from "../utils/gemini";
export const analyzeResume = async (req:Request,res:Response) => {
    try {
        const {resumeText} = req.body;
        const response = await aiResponse(resumeText);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}