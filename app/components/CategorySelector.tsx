import React from "react";

interface Props {
  categories: { name: string }[];
  selectedCategory: string;
  setSelectedCategory: (name: string) => void;
}

const CategorySelector: React.FC<Props> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Categorías</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedCategory === cat.name ? "bg-blue-600" : "bg-gray-500"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
