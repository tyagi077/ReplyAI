import { Router } from "express";
import { createNews, getAllNews, getNews } from "../controller/news.controller.js";
import { upload } from "../middlewares/upload.js";

const newsRouter = Router();

newsRouter.post("/", upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "files", maxCount: 10 }]), createNews);

newsRouter.get("/", getAllNews);

newsRouter.get("/:id", getNews);

export default newsRouter;
