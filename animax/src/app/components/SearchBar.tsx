"use client"
import { Search, ListFilter } from "lucide-react"
import { useState } from "react"

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
  onToggleFilters: () => void;
}

export default function SearchBar({ onSearch, onToggleFilters }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center bg-gradient-to-r from-purple-700 to-purple-600 rounded-md p-2 m-4">
      <Search className="text-gray-300 mr-2" />
      <input
        type="text"
        placeholder="Rechercher un anime..."
        value={searchTerm}
        onChange={handleInputChange}
        className="bg-transparent outline-none text-white w-full placeholder-gray-300"
      />
      <button 
        onClick={onToggleFilters}
        className="ml-2 p-1 hover:bg-purple-500 rounded-md transition-colors"
        title="Filtres avancés"
      >
        <ListFilter className="text-gray-300 hover:text-white" size={20} />
      </button>
    </div>
  )
}
