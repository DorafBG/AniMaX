import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return new Response(JSON.stringify({ error: "ID invalide" }), { status: 400 });
  }

  try {
    const anime = await prisma.anime.findUnique({
      where: { idanime: idNumber },
      include: {
        file: { select: { url: true } },
        commentaire: {
          include: {
            // On inclut maintenant l'id et le nom de l'utilisateur pour pouvoir lier vers /profil/[iduser]
            utilisateur: { select: { iduser: true, nomutilisateur: true } },
          },
          orderBy: {
            datecommentaire: 'desc'
          }
        },
        note: true,
      },
    });

    if (!anime)
      return new Response(JSON.stringify({ error: "Anime introuvable" }), { status: 404 });

    // on ajoute le champ note à chaque commentaire (pr eviter le traitement des données côté client)
    const commentairesAvecNotes = anime.commentaire.map((commentaire) => {
      const noteAssociee = anime.note.find(
        (n) => n.iduser === commentaire.iduser
      );
      return {
        ...commentaire,
        note: noteAssociee ? Number(noteAssociee.note) : null, // ajout du champ note
      };
    });

    const animeComplet = {
      ...anime,
      commentaire: commentairesAvecNotes,
    };

    return new Response(JSON.stringify(animeComplet), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
