import { Router } from "express";
import { getJobStatus } from "../controller/job.controller.js";

const jobRouter = Router();

jobRouter.get("/:id", getJobStatus);

export default jobRouter;
