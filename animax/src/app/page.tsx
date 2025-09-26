import NavBar from "./components/NavBar"
import SearchBar from "./components/SearchBar"
import AnimeCard from "./components/AnimeCard"

export default function Home() {
  const animes = [
    { title: "Demon Slayer", image: "/demon-slayer.jpg", rating: 3 },
    { title: "One Piece", image: "/one-piece.jpg", rating: 4 },
    { title: "Anime 3", image: "/placeholder.png", rating: 0 },
    { title: "Anime 4", image: "/placeholder.png", rating: 0 },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800">
      <NavBar />
      <SearchBar />
      <section className="grid grid-cols-4 gap-6 px-6 py-4">
        {animes.map((anime) => (
          <AnimeCard key={anime.title} {...anime} />
        ))}
      </section>
    </main>
  )
}
