import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Shield,
  ExternalLink,
  FileText,
  Image,
  Video,
} from "lucide-react";
import { mockNewsData } from "../data/mockNews";
import TruthScore from "../components/news/TruthScore";
import Button from "../components/ui/Button";
import axios from "axios";

interface ArticleAuthor {
  name: string;
  initials: string;
  avatar: string;
}

interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  author: ArticleAuthor;
  truthScore: number;
  sourceUrl: string;
}

const ArticlePage: React.FC = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/news/${id}`);
        const data = response.data?.news;

        if (data) {
          setArticle({
            id: data._id || id,
            title: data.title ?? "Untitled Article",
            excerpt: data.description
              ? data.description.slice(0, 140)
              : "No summary available.",
            content: data.description ?? "No content available.",
            imageUrl:
              data.thumbnail ||
              "https://via.placeholder.com/1200x600?text=No+Image",
            category: data.topic || data.sub_topic || "General",
            publishedAt: new Date(
              data.createdAt || data.updatedAt || Date.now()
            ).toISOString(),
            author: {
              name: "News Contributor",
              initials: "NC",
              avatar: "https://via.placeholder.com/40?text=N",
            },
            truthScore: data.score ?? 0,
            sourceUrl: data.txnHash
              ? `https://explorer.aptoslabs.com/txn/${data.txnHash}/payload?network=testnet`
              : "#",
          });

          setLoading(false);
          return;
        }

        const fallback = mockNewsData.find((itm) => itm.id === id);
        if (fallback) setArticle(fallback);
      } catch (error) {
        console.error("Failed to fetch article:", error);

        const fallback = mockNewsData.find((itm) => itm.id === id);
        if (fallback) setArticle(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 text-center text-white">
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="bg-white/5 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Article Not Found
          </h2>
          <p className="text-white/70 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const supportingDocs = [
    {
      type: "image",
      url: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg",
      title: "Blockchain Network Visualization",
      description: "Visual representation of the network topology",
    },
    {
      type: "pdf",
      url: "#",
      title: "Technical Whitepaper",
      description: "Detailed technical documentation",
    },
    {
      type: "video",
      url: "#",
      title: "Demo Walkthrough",
      description: "Video demonstration of the upgrade process",
    },
  ];

  return (
    <div className="min-h-screen bg-navy pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-white/70 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to News Feed
          </Link>
        </div>

        <article className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[400px] object-cover"
          />

          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {article.category}
              </span>
              <TruthScore score={article.truthScore} showLabel size="large" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {article.title}
            </h1>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">
                    {article.author.initials}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">
                    {article.author.name}
                  </div>
                  <div className="text-sm text-white/60">
                    {article.publishedAt}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-primary transition-all">
                  <Share2 size={20} />
                </button>
                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-primary transition-all">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                {article.excerpt}
              </p>
              <div className="text-white/80 leading-relaxed">
                {article.content}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">
                Supporting Documents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportingDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        {doc.type === "image" && <Image size={24} />}
                        {doc.type === "pdf" && <FileText size={24} />}
                        {doc.type === "video" && <Video size={24} />}
                      </div>

                      <div>
                        <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-white/60">
                  <Shield size={16} className="mr-2" />
                  Verified by NexusNews AI
                </div>

                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  View Source
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticlePage;