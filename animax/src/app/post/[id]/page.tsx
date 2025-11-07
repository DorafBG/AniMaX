import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import CommentsSection from "@/app/components/CommentsSection";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) return notFound();

  const post = await prisma.post.findUnique({
    where: { idpost: idNumber },
    include: {
      utilisateur: { select: { iduser: true, nomutilisateur: true } },
      commentaire: {
        include: {
          utilisateur: { select: { iduser: true, nomutilisateur: true } }
        },
        orderBy: { datecommentaire: "desc" }
      }
    }
  });

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000 text-white flex flex-col">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <article className="bg-purple-950/60 p-6 rounded-lg shadow-md">
          <header className="mb-4">
            <h1 className="text-3xl font-bold">{post.titrepost}</h1>
            <p className="text-sm text-gray-400 mt-2">
              Publié par{" "}
              <Link href={`/profil/${post.utilisateur.iduser}`} className="text-cyan-300 hover:underline">
                {post.utilisateur.nomutilisateur}
              </Link>
              {post.datepost && (
                <span className="ml-2 text-xs text-gray-500">
                  • {new Date(post.datepost).toLocaleDateString()}
                </span>
              )}
            </p>
          </header>

          <section className="prose prose-invert text-gray-100 whitespace-pre-line">
            {post.contenu}
          </section>
        </article>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Commentaires</h2>
          <div className="bg-purple-950 p-4 rounded-md shadow-md">
            <CommentsSection comments={post.commentaire} idpost={post.idpost} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
