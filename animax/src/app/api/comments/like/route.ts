import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { idcommentaire } = await request.json();

    if (!idcommentaire) {
      return NextResponse.json(
        { error: "ID commentaire requis" },
        { status: 400 }
      );
    }

    const iduser = parseInt(userId);

    // Vérifier si le like existe déjà
    const existingLike = await prisma.like_.findUnique({
      where: {
        iduser_idcommentaire: {
          iduser,
          idcommentaire
        }
      }
    });

    if (existingLike) {
      // Unlike : supprimer le like
      await prisma.like_.delete({
        where: {
          iduser_idcommentaire: {
            iduser,
            idcommentaire
          }
        }
      });

      // Décrémenter nblike
      await prisma.commentaire.update({
        where: { idcommentaire },
        data: {
          nblike: {
            decrement: 1
          }
        }
      });

      return NextResponse.json({ liked: false });
    } else {
      // Like : créer le like
      await prisma.like_.create({
        data: {
          iduser,
          idcommentaire,
          hasliked: true,
          datelike: new Date()
        }
      });

      // Incrémenter nblike
      await prisma.commentaire.update({
        where: { idcommentaire },
        data: {
          nblike: {
            increment: 1
          }
        }
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Erreur like:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
