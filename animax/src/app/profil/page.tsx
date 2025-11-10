import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import ProfilClientSection from "./ProfilClientSection";

const prisma = new PrismaClient();

export default async function ProfilPage() {
  // Récupère l'ID utilisateur depuis le cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) {
    return (
      <div>
        <NavBar />
        <div className="p-8 text-center">Veuillez vous connecter pour accéder à votre profil.</div>
        <Footer />
      </div>
    );
  }

  // Récupère l'utilisateur et ses notes
  const user = await prisma.utilisateur.findUnique({
    where: { iduser: parseInt(userId) },
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

  if (!user) {
    return (
      <div>
        <NavBar />
        <div className="p-8 text-center">Utilisateur introuvable.</div>
        <Footer />
      </div>
    );
  }

  // Transforme les Decimal en string pour les props client
  function serializeUser(user: typeof userResult) {
    return {
      ...user,
      note: user.note.map((n) => ({
        ...n,
        note: n.note?.toString() ?? null,
      })),
      commentaire: user.commentaire
    };
  }

  // Garder une référence du type original pour le typage
  const userResult = user;

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
        <ProfilClientSection user={serializeUser(userResult)} />
        <div>
          <h2 className="text-xl font-semibold mb-4">Mes notes et commentaires</h2>
          {userResult.note.length === 0 ? (
            <p className="text-gray-400">Aucune note pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-4">
              {userResult.note.map((n, idx: number) => {
                const animeComments = commentairesByAnime.get(n.idanime) || [];
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
                        <div className="text-cyan-300 font-bold">
                          ★ {n.note?.toString()}/10
                        </div>
                      </div>
                    </div>
                    {animeComments.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-cyan-400">
                        <p className="text-sm text-gray-400 mb-2">
                          {animeComments.length === 1 ? "Mon commentaire :" : "Mes commentaires :"}
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