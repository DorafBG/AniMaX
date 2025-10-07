"use client";
import { useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import AnimeCard from "./AnimeCard";

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
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Si "animes" ou "searchTerm" change, on recalcule "filteredAnimes"
  // (useMemo evite des recalculs inutiles)
  const filteredAnimes = useMemo(() => {
    if (!searchTerm.trim()) { // si le terme de recherche est vide, retourner la liste entiere
      return animes;
    }

    // filtre en fonction du terme de recherche dans le titre, le genre ou le synopsis
    return animes.filter((anime) =>
      anime.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (anime.genre && anime.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (anime.synopsis && anime.synopsis.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [animes, searchTerm]);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      
      {searchTerm && (
        <div className="text-center text-white/70 mb-4">
          {filteredAnimes.length} résultat(s) pour "{searchTerm}"
        </div>
      )}

      {filteredAnimes.length === 0 ? (
        <div className="text-center text-white/70 mt-8">
          {searchTerm ? "Aucun anime trouvé pour cette recherche." : "Aucun anime disponible."}
        </div>
      ) : (
        <section className="flex flex-wrap justify-center gap-21 px-6 py-4 max-w-screen-xl mx-auto">
          {filteredAnimes.map((anime) => (
            <AnimeCard
              key={anime.idanime}
              id={anime.idanime}
              title={anime.contenu}
              image={`${process.env.NEXT_PUBLIC_BASE_URL}/${anime.file.url}`}
              rating={anime.notemoyenne}
            />
          ))}
        </section>
      )}
    </>
  );
}