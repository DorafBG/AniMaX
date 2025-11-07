import { PrismaClient } from "@prisma/client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function ActusPage() {
  // Récupère les posts les plus récents
  const posts = await prisma.post.findMany({
    orderBy: { datepost: "desc" },
    include: {
      utilisateur: { select: { iduser: true, nomutilisateur: true } }
    },
    take: 50 // charge les 50 derniers posts (ajuste si nécessaire)
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000 text-white flex flex-col">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Actus</h1>

        {posts.length === 0 ? (
          <p className="text-gray-400">Aucune actualité pour le moment.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.idpost} className="bg-purple-950/60 p-5 rounded-lg shadow-md">
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{post.titrepost}</h2>
                    <p className="text-sm text-gray-400">
                      Publié par{" "}
                      <Link href={`/profil/${post.utilisateur.iduser}`} className="text-cyan-300 hover:underline">
                        {post.utilisateur.nomutilisateur}
                      </Link>
                      {post.datepost ? (
                        <span className="ml-2 text-xs text-gray-500">
                          • {new Date(post.datepost).toLocaleDateString()}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </header>

                <div className="mt-3 text-gray-100">
                  <p className="whitespace-pre-line">{post.contenu}</p>
                </div>

                {/* Optionnel : lien vers page de post détaillée si ajoutée plus tard */}
                {/* <div className="mt-4">
                  <Link href={`/post/${post.idpost}`} className="text-cyan-300 hover:underline text-sm">
                    Lire la suite
                  </Link>
                </div> */}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
