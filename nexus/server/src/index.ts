import Express from "express";
import cors from "cors"
import mongoose from "mongoose";
import newsRouter from "./router/news.router.js";
import jobRouter from "./router/job.router.js";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import "./cron/credibilityCron.js"
const PORT = process.env.PORT

const app = Express();

(async () => {
    await mongoose.connect(process.env.MONGO_URL ?? "")
})()

app.use(cors())
    .use("/news", newsRouter)
    .use("/jobs", jobRouter)
    .get("/", (req, res) => {
        res.json({ msg: "hi" })
    })
    .use(errorHandler as Express.ErrorRequestHandler)



app.listen(PORT, () => {
    console.log(`Server is working at http://localhost:${PORT}`);
})