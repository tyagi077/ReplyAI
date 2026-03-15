import React from 'react';

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="flex flex-wrap space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelectCategory('all')}
        className={`
          px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
          transition-all duration-200
          ${selectedCategory === 'all' 
            ? 'bg-primary text-navy shadow-lg shadow-primary/30' 
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}
        `}
      >
        All Categories
      </button>
      
    
    </div>
  );
};

export default CategoryTabs;