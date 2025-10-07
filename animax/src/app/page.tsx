import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import AnimeCard from "./components/AnimeCard";

async function getAnimes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/animes`, { cache: "no-store" });
  const data = await res.json();
  return data;
}

export default async function Home() {
  const animes = await getAnimes();

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800">
      <NavBar />
      <SearchBar />
      {(!Array.isArray(animes)) ? (
        <p>Erreur dans le chargement des animes ...</p>
      ) : (
        <section className="grid grid-cols-4 gap-6 px-6 py-4">
          {animes.map((anime: any) => (
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

    </main>
  );
}
