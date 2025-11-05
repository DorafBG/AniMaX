import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const animes = await prisma.anime.findMany({
      select: {
        idanime: true,
        contenu: true,
        synopsis: true,
        genre: true,
        notemoyenne: true,
        dateparution: true,
        file: {
          select: {
            url: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(animes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération des animes" }), { status: 500 });
  }
}
