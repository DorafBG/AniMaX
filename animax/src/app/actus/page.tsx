import { PrismaClient } from "@prisma/client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";
import ActusAdminPostForm from "./ActusAdminPostForm";

const prisma = new PrismaClient();

export default async function ActusPage() {
  // Récupère les posts les plus récents
  const posts = await prisma.post.findMany({
    orderBy: { datepost: "desc" },
    include: {
      // Inclure également la relation file pour récupérer l'URL de la photo de profil
      utilisateur: { 
        select: { 
          iduser: true, 
          nomutilisateur: true,
          file: { select: { url: true } }
        } 
      }
    },
    take: 50 // charge les 50 derniers posts (ajuste si nécessaire)
  });

  const buildFileUrl = (url?: string | null) => {
    if (!url) return null;
    const clean = url.startsWith("/") ? url : `/${url.replace(/^\/+/, "")}`;
    return `${process.env.NEXT_PUBLIC_BASE_URL}${clean}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000 text-white flex flex-col">
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Actus</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Les dernières actualités et articles autour des animes, nouveautés, critiques et discussions.
          </p>
        </header>

        {/* Formulaire création post (visible côté client uniquement pour admins) */}
        <ActusAdminPostForm />

        {/* Grid posts */}
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center">Aucune actualité pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.idpost}
                className="group bg-gradient-to-br from-purple-950/50 to-purple-950/30 border border-purple-800 rounded-lg p-5 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition"
              >
                {/* colored header strip */}
                <div className="h-1 w-full rounded-sm mb-4 bg-gradient-to-r from-cyan-400 to-purple-400" />

                <h2 className="text-xl font-semibold mb-2 group-hover:text-cyan-300">
                  {post.titrepost}
                </h2>

                <div className="flex items-center justify-between gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar : image si disponible, sinon initiale */}
                    {post.utilisateur?.file?.url ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-700 bg-gray-700">
                        <Image
                          src={buildFileUrl(post.utilisateur.file.url) || ""}
                          alt={post.utilisateur.nomutilisateur || "avatar"}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center font-semibold text-white">
                        {post.utilisateur?.nomutilisateur?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <div>
                      <Link href={`/profil/${post.utilisateur.iduser}`} className="text-cyan-300 hover:underline">
                        {post.utilisateur.nomutilisateur}
                      </Link>
                      <div className="text-xs text-gray-400">
                        {post.datepost ? new Date(post.datepost).toLocaleDateString() : ""}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    {post.contenu.length > 120 ? `${post.contenu.slice(0, 120)}…` : post.contenu}
                  </div>
                </div>

                <p className="text-gray-200 mb-4 leading-relaxed">
                  {post.contenu.length > 240 ? `${post.contenu.slice(0, 240)}…` : post.contenu}
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/post/${post.idpost}`}
                    className="text-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-800/60 hover:bg-purple-800 text-cyan-300 transition"
                  >
                    Lire la suite
                  </Link>

                  <div className="text-xs text-gray-400">
                    ID #{post.idpost}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
