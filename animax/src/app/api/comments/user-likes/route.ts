import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ likedComments: [] });
    }

    const body = await request.json();
    const { commentIds } = body;

    if (!Array.isArray(commentIds)) {
      return NextResponse.json(
        { error: "commentIds doit être un tableau" },
        { status: 400 }
      );
    }

    // Récupérer tous les likes de l'utilisateur pour ces commentaires
    const likes = await prisma.like_.findMany({
      where: {
        iduser: parseInt(userId),
        idcommentaire: { in: commentIds },
        hasliked: true
      },
      select: {
        idcommentaire: true
      }
    });

    const likedComments = likes.map(like => like.idcommentaire);

    return NextResponse.json({ likedComments });
  } catch (error) {
    console.error("Erreur récupération likes utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
