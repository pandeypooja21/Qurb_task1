
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="flex flex-wrap gap-3 my-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category.toLowerCase())}
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors
            ${selectedCategory === category.toLowerCase()
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"}
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
