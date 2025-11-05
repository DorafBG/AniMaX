import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { idanime, contenu } = body;

    if (!idanime || !contenu || contenu.trim() === "") {
      return NextResponse.json(
        { error: "Contenu du commentaire requis" },
        { status: 400 }
      );
    }

    // Récupérer l'ID max actuel
    const maxComment = await prisma.commentaire.findFirst({
      orderBy: { idcommentaire: "desc" },
      select: { idcommentaire: true }
    });

    const newId = (maxComment?.idcommentaire || 0) + 1;

    // Créer le commentaire
    const comment = await prisma.commentaire.create({
      data: {
        idcommentaire: newId,
        idanime: parseInt(idanime),
        iduser: parseInt(userId),
        contenu: contenu.trim(),
        nblike: 0,
        datecommentaire: new Date(),
      },
      include: {
        utilisateur: {
          select: {
            nomutilisateur: true
          }
        }
      }
    });

    // Récupérer la note de l'utilisateur pour cet anime s'il en a une
    const userNote = await prisma.note.findUnique({
      where: {
        iduser_idanime: {
          iduser: parseInt(userId),
          idanime: parseInt(idanime)
        }
      },
      select: {
        note: true
      }
    });

    // Ajouter la note au commentaire s'il y en a une
    const commentWithNote = {
      ...comment,
      note: userNote?.note ? parseFloat(userNote.note.toString()) : null
    };

    return NextResponse.json({ comment: commentWithNote });
  } catch (error) {
    console.error("Erreur création commentaire:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
