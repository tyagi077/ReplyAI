import React, { useEffect, useState } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import TruthScore from "../news/TruthScore";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface NewsItemType {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  score: number;
  txnHash: string;
  createdAt?: string;
}

const TrendingSection: React.FC = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      const resp = await axios.get("http://localhost:8000/news");
      const fetched = resp.data.newsItems as NewsItemType[];

      const sorted = [...fetched].sort((a, b) => {
        const aDate = new Date(a.createdAt || "").getTime();
        const bDate = new Date(b.createdAt || "").getTime();
        return bDate - aDate;
      });

      setNews(sorted);
      console.log("Fetched news (sorted):", sorted);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const latestArticles = news.slice(0, 5);

  return (
    <section className="py-16 bg-navy-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-navy to-transparent"></div>
      <div className="absolute w-96 h-96 top-0 right-0 bg-primary/10 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center mb-8">
          <TrendingUp className="text-primary mr-3" size={28} />
          <h2 className="text-3xl font-bold text-white">Latest News</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article, index) => {
            const articleId = article._id ?? article.txnHash;

            return (
              <Link
                to={`/article/${articleId}`}
                key={articleId}
                className="bg-white/5 cursor-pointer backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-xl border border-white/10 hover:border-primary/30 overflow-hidden group relative flex flex-col"
              >
                <div className="relative h-[240px] w-full overflow-hidden rounded">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover object-top"
                  />

                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-2 py-1 rounded-md flex items-center">
                    <span className="text-primary mr-1">#</span>
                    {index + 1}
                  </div>

                  <div className="absolute top-3 right-3">
                    <TruthScore score={article.score} size="small" />
                  </div>

                  <div className="absolute left-3 bottom-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                        {article.category}
                      </span>

                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-grow">
                  <h3 className="text-white font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </div>

                <div className="p-4 pt-0 mt-auto flex items-center text-primary text-sm font-medium">
                  Read full story
                  <ArrowUpRight
                    size={14}
                    className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate("/all-news")}
            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/20 transition"
          >
            Show more
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;