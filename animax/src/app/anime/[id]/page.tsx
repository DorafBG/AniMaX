import { notFound } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import RatingChart from "@/app/components/RatingChart";
import Link from "next/link";
import Image from "next/image";

async function getAnime(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/animes/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AnimePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const anime = await getAnime(id);
  if (!anime) return notFound();

  // Préparation des données du graphique
  const notes = anime.note || [];
  const distribution = Array.from({ length: 11 }, (_, i) => ({
    note: i,
    count: notes.filter((n: any) => Math.round(n.note) === i).length,
  }));

  const date = anime.dateparution ? new Date(anime.dateparution).getFullYear() : "N/A";

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white">
      <NavBar />

      <div className="px-6 py-4">
        <Link
          href="/"
          className="inline-block bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-md mb-4"
        >
          ← Retour
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Gauche */}
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="relative w-[300px] h-[440px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${anime.file?.url}`}
                alt={anime.contenu}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold mt-4">{anime.contenu}</h1>
            <p className="text-gray-300 mt-2">{date}</p>
          </div>

          {/* Droite */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-semibold text-purple-200 mb-2">
              {anime.genre}
            </h2>
            <p className="text-gray-200 mb-6">{anime.synopsis}</p>

            {/* Ligne des notes */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <p className="text-sm text-gray-400">Ta note :</p>
                <p className="text-lg font-semibold">-</p>
              </div>

              <div className="flex-1 text-right">
                <p className="text-sm text-gray-400">Note moyenne :</p>
                <p className="text-lg font-semibold">{anime.notemoyenne ?? "N/A"}/10</p>
              </div>
            </div>

            {/* Petit graphique */}
            <RatingChart data={distribution} />

            {/* Commentaires */}
            <div className="bg-purple-950 p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-3">Commentaires</h3>
              <div className="space-y-3">
                {anime.commentaire.length === 0 ? (
                  <p className="text-gray-400">Aucun commentaire.</p>
                ) : (
                  anime.commentaire.map((c: any) => (
                    <div
                      key={c.idcommentaire}
                      className="bg-purple-800/40 rounded-md p-3"
                    >
                      <p className="text-sm">
                        <span className="font-semibold">{c.utilisateur.nomutilisateur}</span>:{" "}
                        {c.contenu}
                      </p>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{c.nblike ?? 0} {c.nblike > 0 ? "❤️" : "🤍"}</span>
                        {c.note ? (
                          <span className="text-base md:text-lg font-bold">
                            ★ {c.note}/10
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
