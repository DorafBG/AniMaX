"use client";
import { useState } from "react";
import { X } from "lucide-react";

export type FilterCriteria = {
  genres: string[];
  sortBy: 'none' | 'rating-asc' | 'rating-desc';
};

type FilterDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterCriteria) => void;
  availableGenres: string[];
};

export default function FilterDropdown({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  availableGenres
}: FilterDropdownProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'none' | 'rating-asc' | 'rating-desc'>('none');

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      genres: selectedGenres,
      sortBy: sortBy
    });
    onClose();
  };

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSortBy('none');
    onApplyFilters({
      genres: [],
      sortBy: 'none'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute top-16 right-4 bg-purple-800 border border-purple-600 rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-lg">Filtres</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Genres */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Genres</label>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {availableGenres.map(genre => (
                <label key={genre} className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="mr-2"
                  />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tri par popularité */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Popularité</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'none' | 'rating-asc' | 'rating-desc')}
              className="w-full bg-purple-700 text-white border border-purple-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="none">Aucun tri</option>
              <option value="rating-asc">Note croissante</option>
              <option value="rating-desc">Note décroissante</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex gap-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-md transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}