import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import ProfilePicUpload from "./ProfilePicUpload";
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
            select: { contenu: true, file: true }
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
  function serializeUser(user: any) {
    return {
      ...user,
      note: user.note.map((n: any) => ({
        ...n,
        note: n.note?.toString() ?? null,
      })),
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000 text-white flex flex-col">
      <NavBar />
      <div className="max-w-2xl mx-auto p-8">
        <ProfilClientSection user={serializeUser(user)} />
        <div>
          <h2 className="text-xl font-semibold mb-4">Mes notes</h2>
          {user.note.length === 0 ? (
            <p className="text-gray-400">Aucune note pour l'instant.</p>
          ) : (
            <ul className="space-y-4">
              {user.note.map((n: any, idx: number) => (
                <li
                  key={`${n.idnote}-${n.anime?.contenu ?? idx}`}
                  className="flex items-center gap-4 bg-purple-950 p-4 rounded-md"
                >
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}