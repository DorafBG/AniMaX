"use client";
import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import AnimeCard from "./AnimeCard";
import FilterDropdown, { FilterCriteria } from "./FilterDropdown";

type Anime = {
  idanime: number;
  contenu: string;
  file: {
    url: string;
  };
  notemoyenne: number;
  genre?: string;
  synopsis?: string;
};

type AnimesListProps = {
  animes: Anime[];
};

export default function AnimesList({ animes }: AnimesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({
    genres: [],
    sortBy: 'none'
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApplyFilters = (filters: FilterCriteria) => {
    setActiveFilters(filters);
  };

  // on recupere la liste des genres
  const availableGenres = useMemo(() => {
    const genres = animes.map(anime => anime.genre).filter(Boolean);
    return [...new Set(genres)] as string[];
  }, [animes]);

  // Si "animes", "searchTerm" ou "activeFilters" change, on recalcule "filteredAnimes"
  // (useMemo evite des recalculs inutiles)
  const filteredAnimes = useMemo(() => {
    let filtered = animes;

    // Filtrage par terme de recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter((anime) =>
        anime.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (anime.genre && anime.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (anime.synopsis && anime.synopsis.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrage par genres
    if (activeFilters.genres.length > 0) {
      filtered = filtered.filter(anime => 
        anime.genre && activeFilters.genres.includes(anime.genre)
      );
    }

    // Tri par note moyenne
    if (activeFilters.sortBy === 'rating-asc') {
      filtered = filtered.sort((a, b) => (a.notemoyenne || 0) - (b.notemoyenne || 0));
    } else if (activeFilters.sortBy === 'rating-desc') {
      filtered = filtered.sort((a, b) => (b.notemoyenne || 0) - (a.notemoyenne || 0));
    }

    return filtered;
  }, [animes, searchTerm, activeFilters]); // si l'un de ces 3 change, on recalcule

  return (
    <div className="relative">
      <SearchBar onSearch={handleSearch} onToggleFilters={handleToggleFilters} />
      
      <FilterDropdown
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        availableGenres={availableGenres}
      />
      
      {(searchTerm || activeFilters.genres.length > 0 || activeFilters.sortBy !== 'none') && (
        <div className="text-center text-white/70 mb-4">
          {filteredAnimes.length} résultat(s) trouvé(s)
          {searchTerm && ` pour "${searchTerm}"`}
          {activeFilters.sortBy !== 'none' && (
            <span className="block text-sm text-cyan-300">
              Triés par note {activeFilters.sortBy === 'rating-asc' ? 'croissante' : 'décroissante'}
            </span>
          )}
        </div>
      )}

      {filteredAnimes.length === 0 ? (
        <div className="text-center text-white/70 mt-8">
          {searchTerm || activeFilters.genres.length > 0 || activeFilters.sortBy !== 'none'
            ? "Aucun anime trouvé avec ces critères." 
            : "Aucun anime disponible."}
        </div>
      ) : (
        <section className="flex flex-wrap justify-center gap-6 px-6 py-4 max-w-screen-xl mx-auto">
          {filteredAnimes.map((anime) => {
            const imageSrc = anime.file?.url
              ? (anime.file.url.startsWith("http")
                  ? anime.file.url
                  : anime.file.url.startsWith("/")
                  ? anime.file.url
                  : `/${anime.file.url.replace(/^\/+/, "")}`)
              : "/placeholder.png";

            return (
              <AnimeCard
                key={anime.idanime}
                id={anime.idanime}
                title={anime.contenu}
                image={imageSrc}
                rating={anime.notemoyenne}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}