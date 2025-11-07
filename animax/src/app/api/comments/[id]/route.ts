import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur est administrateur
    const user = await prisma.utilisateur.findUnique({
      where: { iduser: parseInt(userId) },
      select: { isadministrateur: true }
    });

    if (!user?.isadministrateur) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const idcommentaire = parseInt(id);

    // Supprimer d'abord tous les likes associés
    await prisma.like_.deleteMany({
      where: { idcommentaire }
    });

    // Supprimer le commentaire
    await prisma.commentaire.delete({
      where: { idcommentaire }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression commentaire:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
