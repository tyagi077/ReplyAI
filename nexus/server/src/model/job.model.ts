import { model, Schema } from "mongoose";

const stepSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "done", "failed"], default: "pending" },
  message: { type: String, default: "" },
}, { _id: false });

const jobSchema = new Schema({
  type: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "completed", "failed"], default: "pending" },
  steps: [stepSchema],
  error: String,
}, { timestamps: true });

export const Job = model("Job", jobSchema);
