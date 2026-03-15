import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsyncHandler.js";
import { AppError } from "../utils/appErrors.js";
import { Job } from "../model/job.model.js";

export const getJobStatus = catchAsync(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  res.status(200).json({ success: true, job });
});
