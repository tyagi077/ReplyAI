import { NewsItem } from "../types/news";

export const mapNewsFromAPI = (item: any): NewsItem => ({
  id: item._id ?? item.txnHash,
  title: item.title,
  excerpt: item.description,
  content: item.description,
  imageUrl: item.thumbnail,
  category: item.category ?? "General",
  publishedAt: item.createdAt ?? new Date().toISOString(),
  author: {
    name: "TruthChain",
    initials: "TC",
    avatar: ""
  },
  truthScore: item.score,
  sourceUrl: `https://explorer.aptoslabs.com/txn/${item.txnHash}?network=testnet`,
  views: 0,
  tags: []
});