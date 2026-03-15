import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import axios from 'axios';
import { NewsItem as UI_NewsItem } from '../../types/news';

interface BackendNewsItem {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category?: string;
  score: number;
  txnHash: string;
  createdAt?: string;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<UI_NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const resp = await axios.get('http://localhost:8000/news');
        const fetched = (resp.data.newsItems as BackendNewsItem[])
          .filter((item) => item.score > 40)
          .sort((a, b) => {
            const aDate = new Date(a.createdAt || '').getTime();
            const bDate = new Date(b.createdAt || '').getTime();
            return bDate - aDate;
          })
          .map((item) => ({
            id: item._id ?? item.txnHash,
            title: item.title,
            excerpt: item.description ? item.description.slice(0, 130) : '',
            content: item.description || '',
            imageUrl: item.thumbnail || 'https://via.placeholder.com/400x240?text=No+Image',
            category: item.category || 'General',
            publishedAt: item.createdAt || new Date().toISOString(),
            author: {
              name: 'Anonymous',
              initials: 'AN',
              avatar: 'https://via.placeholder.com/40?text=A',
            },
            truthScore: item.score,
            sourceUrl: 'https://explorer.aptoslabs.com/txn/' + item.txnHash + '/payload?network=testnet',
            views: 0,
            tags: [],
            isFeatured: false,
          }));

        setNews(fetched);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-16 bg-navy">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Latest Verified News</h2>
            <p className="text-white/60">Showing news items with credibility score &gt; 40 (newest first)</p>
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center py-16">Loading news…</div>
        ) : (
          <>
            {news.length > 0 ? (
              <>
                <div className="mb-10">
                  <NewsCard article={news[0]} featured={true} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.slice(1).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10">
                <h3 className="text-white text-xl font-bold mb-2">No verified news yet</h3>
                <p className="text-white/60">Submit an article to have it appear here once it's verified.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default NewsFeed;
