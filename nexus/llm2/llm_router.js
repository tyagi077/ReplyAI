import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Save temp file
function saveTempFile(file) {
  const uploadDir = "./uploads";
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });  // this recursive is used to make the full directory path , including any missing parent folder 

  const filePath = path.join(uploadDir, `${uuidv4()}_${file.originalname}`);
  fs.writeFileSync(filePath, file.buffer);
  return filePath;
}

// Cleanup temp
function cleanupTemp(files) {
  files.forEach((f) => {
    try {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  });
}

async function retryGeminiCall(fn, retries = 5, delay = 500) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0 || err?.response?.status !== 503) {
      throw err;
    }
    console.log(`Gemini overloaded. Retrying in ${delay}ms...`);
    await new Promise((res) => setTimeout(res, delay));
    return retryGeminiCall(fn, retries - 1, delay * 2); // exponential backoff
  }
}


router.post("/", upload.any(), async (req, res) => {
  const tempFiles = [];

  try {
    const title = (req.body?.title || "").trim();
    const description = (req.body?.description || "").trim();

    if (!title || !description) {
      return res.status(400).json({
        status: "false",
        error: "Missing required fields: title and description",
      });
    }

    let thumbnailFile = "None";
    const files = Array.isArray(req.files) ? req.files : [];

    const thumb = files.find((f) => f.fieldname === "thumbnail");
    if (thumb) {
      thumbnailFile = thumb.originalname;
      tempFiles.push(saveTempFile(thumb));
    }

    const otherFiles = files.filter((f) => f.fieldname.startsWith("files["));
    const fileNames = otherFiles.map((f) => f.originalname);
    otherFiles.forEach((f) => tempFiles.push(saveTempFile(f)));

    const prompt = `
Analyze the following news article for credibility and topic classification.
Title: "${title}"
Description: "${description}"
Files: ${fileNames.join(", ") || "None"}
Thumbnail: ${thumbnailFile}

Provide the output:

### Credibility Score
\`\`\`json
{ "score": 1-100, "reasoning": [] }
\`\`\`

### Topic Classification
\`\`\`json
{ "topic": "", "sub_topic": "", "tags": [] }
\`\`\`
`;

    // ----------- NEW GEMINI SDK -----------  
    const response = await retryGeminiCall(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
    );


    const insights =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";


    // Extract JSON sections
    const scoreMatch = insights.match(/### Credibility Score[\s\S]*?```json([\s\S]*?)```/);
    const catMatch = insights.match(/### Categorization[\s\S]*?```json([\s\S]*?)```/);

    const credibility = scoreMatch
      ? JSON.parse(scoreMatch[1].trim())
      : { score: 0, reasoning: ["Default"] };

    const categorization = catMatch
      ? JSON.parse(catMatch[1].trim())
      : { topic: "Unknown", sub_topic: "Unknown", tags: [] };

    res.json({
      status: "success",
      insights,
      ...credibility,
      ...categorization,
    });
  } catch (err) {
    console.error("LLM Error:", err);
    res.status(500).json({ status: "false", error: err.message });
  } finally {
    cleanupTemp(tempFiles);
  }
});

export default router;
