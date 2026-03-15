import cron from "node-cron";
import { News } from "../model/news.model.js";


// Run every 24 hours (daily at midnight)
// Using @daily makes it clear this is not a per-minute schedule.
cron.schedule("@daily", async () => {
    console.log("🔄 Cron Job Started: Revalidating low-credibility news");

    try {
        // Fetch ONLY news with credibility less than 40
        const lowCredNews = await News.find({ score: { $lt: 40 } });

        if (lowCredNews.length === 0) {
            console.log("✔ No low-credibility news found.");
            return;
        }

        console.log(`📌 Found ${lowCredNews.length} news items with credibility < 40`);

        // Process ONE by ONE
        for (const news of lowCredNews) {
            console.log(`🔍 Revalidating news: ${news._id} (${news.title})`);

            try {
                const formData = new FormData();
                formData.append("title", news.title || "No title provided");
                formData.append("description", news.description || "No description available");

                const response = await fetch("http://localhost:8001/", {
                    method: "POST",
                    body: formData as any, // TS fix
                });

                const llmResponse = await response.json();

                const quotaError = llmResponse?.error?.code === 429 ||
                    llmResponse?.error?.status === "RESOURCE_EXHAUSTED" ||
                    llmResponse?.error?.message?.includes("Quota exceeded");

                if (llmResponse.status === "false") {
                    if (quotaError) {
                        console.error(`❌ Gemini quota exceeded for ${news._id}:`, llmResponse.error);
                        console.error("📌 Gemini quota limit hit — please check your API plan/billing or reduce request volume.");
                    } else {
                        console.error(`❌ Gemini failed for ${news._id}:`, llmResponse.error);
                    }
                    continue;
                }

                await News.updateOne(
                    { _id: news._id },
                    {
                        score: llmResponse.score,
                        score_reasoning: llmResponse.reasoning,
                        topic: llmResponse.topic,
                        sub_topic: llmResponse.sub_topic,
                        tags: llmResponse.tags,
                        insights: llmResponse.insights,
                        lastRevalidated: new Date(),
                    }
                );

                console.log(`✔ Updated credibility for news: ${news._id}`);
            } catch (err: any) {
                const quotaError =
                    err?.code === 429 ||
                    err?.message?.includes("Quota exceeded") ||
                    err?.message?.includes("RESOURCE_EXHAUSTED");

                if (quotaError) {
                    console.error(`❌ Gemini quota exceeded while revalidating ${news._id}:`, err);
                    console.error("📌 Gemini quota limit hit — please check your API plan/billing or reduce request volume.");
                } else {
                    console.error(`❌ Error revalidating news ${news._id}`, err?.message ?? err);
                }
            }

            // Delay to prevent API overload
            await new Promise(resolve => setTimeout(resolve, 700));
        }

        console.log("🎉 Cron Job Completed.");
    } catch (err: any) {
        console.error("❌ Cron Job Failed:", err.message);
    }
});
