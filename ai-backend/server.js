require("dotenv").config();

const express = require("express");
const cors = require("cors");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const app = express();

app.use(cors());
app.use(express.json());
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 requests per minute per IP
  message: {
    error: "Too many requests. Please slow down."
  }
});
const aiCache = new NodeCache({ stdTTL: 3600 });

app.get("/",(req,res)=>{
    res.json({
        "running":"yes"
    })
})
app.post("/generate", limiter, async (req, res) => {

  try {

    const { tweetText, images } = req.body;

    if (!tweetText) {
      return res.status(400).json({
        error: "tweetText is required"
      });
    }

    const cacheKey = tweetText;

    const cached = aiCache.get(cacheKey);

    if (cached) {
      console.log("Cache hit");
      return res.json(cached);
    }

    let prompt = `
Generate 5 engaging replies for this tweet.

Tweet:
${tweetText}

Rules:
- Short replies
- Natural tone
- Under 200 characters
- Each reply on a new line
`;

    if (images && images.length > 0) {
      prompt += `

The tweet also contains images:
${images.join("\n")}

Consider them when generating replies.
`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    clearTimeout(timeout);

    const data = await response.json();

    // save to cache
    aiCache.set(cacheKey, data);

    console.log("AI response:", data);

    res.json(data);

  } catch (err) {

    console.error("AI error:", err);

    res.status(500).json({
      error: "AI generation failed"
    });

  }

});

app.listen(3000, () => {
  console.log("AI server running on port 3000");
});