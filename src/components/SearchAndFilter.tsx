
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchAndFilterProps {
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
}

export const SearchAndFilter = ({
  searchQuery,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onClearFilters
}: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchQuery || (selectedCategory && selectedCategory !== 'Alle');
  const activeFilterCount = [
    searchQuery,
    selectedCategory !== 'Alle' ? selectedCategory : null
  ].filter(Boolean).length;

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-premium-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Zoek in alle artikelen..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-premium-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-az-red/20 focus:border-az-red bg-white text-premium-gray-800 placeholder:text-premium-gray-400 shadow-sm transition-all duration-200"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 border-premium-gray-200 hover:border-az-red hover:bg-az-red/5 transition-all duration-200 ${
            hasActiveFilters ? 'border-az-red bg-az-red/5' : ''
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">Categorieën</span>
          {hasActiveFilters && (
            <span className="bg-az-red text-white text-xs px-2 py-0.5 rounded-full font-semibold min-w-[20px] h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-premium-gray-500 hover:text-az-red hover:bg-az-red/5 flex items-center gap-2 font-medium transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Wis alle filters
          </Button>
        )}
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-premium-gray-100 p-6 shadow-sm animate-slide-up">
          <div className="space-y-4">
            <h3 className="headline-premium text-headline-sm text-az-black">
              Filter op categorie
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    selectedCategory === category
                      ? 'bg-az-red text-white border-az-red shadow-md hover:bg-red-700'
                      : 'bg-white text-premium-gray-700 border-premium-gray-200 hover:border-az-red hover:bg-az-red/5 hover:text-az-red'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
