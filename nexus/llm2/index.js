import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import llmRouter from "./llm_router.js";

// Load the .env file for this service (PORT=8001)
dotenv.config();

const PORT = process.env.PORT || 8001;

const app = express();

// Set up middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Mount the LLM router at the root path of this service
// This means the route is accessed at http://localhost:8001/
app.use("/", llmRouter);

app.get("/health", (req, res) => {
    res.json({ msg: "LLM Insight Service is running" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`LLM Insight Service is working at http://localhost:${PORT}`);
});