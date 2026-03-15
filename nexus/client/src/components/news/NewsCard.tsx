import React from 'react';
import { Clock, Tag, ExternalLink, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../types/news';
import TruthScore from './TruthScore';

interface NewsCardProps {
  article: NewsItem;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const {
    id,
    title,
    excerpt,
    imageUrl,
    category,
    publishedAt,
    author,
    truthScore,
    sourceUrl,
  } = article;

  return (
    <Link 
      to={`/article/${id}`}
      className={`
        group relative overflow-hidden bg-white/5 backdrop-blur-sm 
        hover:bg-white/10 transition-all duration-300 rounded-xl 
        border border-white/10 hover:border-primary/30 block
        ${featured ? 'lg:flex' : ''}
      `}
    >
      <div className={`relative overflow-hidden ${featured ? 'lg:w-2/5' : ''}`}>
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-navy/80 to-transparent"></div>
        
        <div className="absolute top-4 right-4 z-10">
          <TruthScore score={truthScore} />
        </div>
        
        <div className="absolute bottom-4 left-4 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
            <Tag size={12} className="mr-1" />
            {category}
          </span>
        </div>
      </div>
      
      <div className={`p-5 ${featured ? 'lg:w-3/5' : ''}`}>
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-white/70 mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex flex-wrap justify-between items-center mt-auto">
          
          
          <div className="flex items-center space-x-4 mb-2">
         
            
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary flex items-center text-sm hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Shield size={14} className="mr-1" />
              Source
              <ExternalLink size={12} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-xl pointer-events-none transition-all duration-300"></div>
    </Link>
  );
};

export default NewsCard;