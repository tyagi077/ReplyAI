import { model, Schema } from "mongoose";

const newsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    thumbnail: { type: String },
    files: [{ type: String, url: String }],

    topic: { type: String, enum: ["Sensitive", "Emergency", "Solution", "Unknown"], default: "Unknown" },
    sub_topic: { type: String, enum: ["Verified", "Potential Flagged", "Trending", "Unknown"], default: "Unknown" },
    tags: [{ type: String }],

    score: { type: Number, default: 50 },
    score_reasoning: [{ type: String }],

    insights: String,
    txnHash: String,

    lastRevalidated: Date
}, { timestamps: true });

export const News = model("News", newsSchema);
