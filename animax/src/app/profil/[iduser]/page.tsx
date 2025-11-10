import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function ProfilPublicPage({ params }: { params: { iduser: string } }) {
  // Récupère l'id depuis l'URL
  const { iduser: iduserParam } = await params;
  const iduser = Number(iduserParam);
  if (isNaN(iduser)) {
    return (
      <div>
        <NavBar />
        <div className="p-8 text-center">Profil invalide.</div>
        <Footer />
      </div>
    );
  }

  // Récupère l'utilisateur et ses notes
  const user = await prisma.utilisateur.findUnique({
    where: { iduser },
    include: {
      file: true,
      note: {
        include: {
          anime: { 
            select: { 
              idanime: true,
              contenu: true, 
              file: true 
            } 
          }
        }
      },
      commentaire: {
        include: {
          anime: {
            select: {
              idanime: true,
              contenu: true
            }
          }
        }
      }
    }
  });

  if (!user) return notFound();

  // Créer un mapping des commentaires par anime
  // Filtrer pour ne garder que les commentaires sur les animes (pas sur les posts)
  const commentairesByAnime = new Map<number, typeof user.commentaire>();
  user.commentaire.forEach((comment) => {
    // Ne traiter que les commentaires qui sont vraiment sur des animes (idpost doit être null/undefined)
    if ((comment.idpost === null || comment.idpost === undefined) && comment.idanime) {
      if (!commentairesByAnime.has(comment.idanime)) {
        commentairesByAnime.set(comment.idanime, []);
      }
      commentairesByAnime.get(comment.idanime)!.push(comment);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000 text-white flex flex-col">
      <NavBar />
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-400">
            {user.file?.url ? (
              <Image
                src={user.file.url.startsWith("/") ? user.file.url : `/${user.file.url.replace(/^\/+/, "")}`}
                alt="Photo de profil"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl">?</div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.nomutilisateur}</h1>
            <p className="text-gray-300">{user.adressemail}</p>
            <p className="mt-2 text-cyan-300">{user.note.length} animes notés</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Ses notes et commentaires</h2>
          {user.note.length === 0 ? (
            <p className="text-gray-400">Aucune note pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-4">
              {user.note.map((n, idx: number) => {
                const animeComments = commentairesByAnime.get(n.anime?.idanime || 0) || [];
                return (
                  <li
                    key={`${n.iduser}-${n.idanime}-${idx}`}
                    className="bg-purple-950 p-4 rounded-md"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      {n.anime?.file?.url && (
                        <Image
                          src={n.anime.file.url.startsWith("/") ? n.anime.file.url : `/${n.anime.file.url}`}
                          alt={n.anime.contenu}
                          width={48}
                          height={64}
                          className="rounded"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{n.anime?.contenu}</div>
                        <div className="text-cyan-300 font-bold">★ {n.note?.toString()}/10</div>
                      </div>
                    </div>
                    {animeComments.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-cyan-400">
                        <p className="text-sm text-gray-400 mb-2">
                          {animeComments.length === 1 ? "Son commentaire :" : "Ses commentaires :"}
                        </p>
                        {animeComments.map((comment) => (
                          <div key={comment.idcommentaire} className="bg-purple-800/40 p-3 rounded-md mb-2">
                            <p className="text-sm text-gray-200">{comment.contenu}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {comment.datecommentaire && new Date(comment.datecommentaire).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
