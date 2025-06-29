import React from 'react';
import { Heart, Users, Star, AlertTriangle, Award, MessageCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  postCount: number;
  color: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`p-3 md:p-4 rounded-kawaii border-2 transition-all duration-300 hover:scale-105 ${
            selectedCategory === category.id
              ? 'border-kawaii-purple bg-kawaii-purple/20 shadow-md'
              : 'border-gray-200 bg-white/60 hover:bg-white/80'
          }`}
        >
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${category.color}`}>
            {React.cloneElement(category.icon as React.ReactElement, { size: window.innerWidth < 768 ? 16 : 20 })}
          </div>
          <h3 className="font-bold text-gray-800 text-xs md:text-sm mb-1 leading-tight">{category.name}</h3>
          <p className="text-xs text-gray-600 mb-1 md:mb-2 hidden md:block">{category.description}</p>
          <span className="text-xs font-semibold text-gray-500">{category.postCount}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;