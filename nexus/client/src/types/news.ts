export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  author: {
    name: string;
    initials: string;
    avatar: string;
  };
  truthScore: number;
  sourceUrl: string;
  views: number;
  isFeatured?: boolean;
  tags: string[];
}