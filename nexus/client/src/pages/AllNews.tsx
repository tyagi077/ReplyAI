import React, { useEffect, useState } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TruthScore from '../components/news/TruthScore';

interface NewsItem {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  score: number;
  txnHash: string;
  createdAt?: string;
}

const AllNews: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const fetchNews = async () => {
      setLoading(true);
      try {
        const resp = await axios.get('http://localhost:8000/news');
        const fetched = resp.data.newsItems as NewsItem[];

        const sorted = [...fetched].sort((a, b) => {
          const aDate = new Date(a.createdAt || '').getTime();
          const bDate = new Date(b.createdAt || '').getTime();
          return bDate - aDate;
        });

        setNews(sorted);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-navy min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center">
            <TrendingUp className="text-primary mr-3" size={28} />
            <h1 className="text-3xl font-bold text-white">All Latest News</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/20 transition"
          >
            Back to Home
          </button>
        </div>

        {loading ? (
          <div className="text-white text-center py-20">Loading news…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, idx) => {
              const articleId = article._id ?? article.txnHash;
              return (
                <Link
                  key={articleId}
                  to={`/article/${articleId}`}
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
                      {idx + 1}
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

                  <div className="p-4 pt-0 mt-auto">
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
        )}
      </div>
    </div>
  );
};

export default AllNews;
