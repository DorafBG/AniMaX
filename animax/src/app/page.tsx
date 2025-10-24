import NavBar from "./components/NavBar";
import AnimesList from "./components/AnimesList";

async function getAnimes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/animes`, { cache: "no-store" });
  const data = await res.json();
  return data;
}

export default async function Home() {
  const animes = await getAnimes();

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000">
      <NavBar />
      {(!Array.isArray(animes)) ? (
        <div className="text-center text-white mt-8">
          <p>Erreur dans le chargement des animes ...</p>
        </div>
      ) : (
        <AnimesList animes={animes} />
      )}
    </main>
  );
}
