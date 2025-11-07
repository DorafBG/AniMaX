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
    const { idanime, note } = body;

    if (!idanime || note === undefined || note < 0 || note > 10) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const iduser = parseInt(userId);
    const animeId = parseInt(idanime);

    // Vérifier si l'utilisateur a déjà noté cet anime
    const existingNote = await prisma.note.findUnique({
      where: {
        iduser_idanime: {
          iduser,
          idanime: animeId
        }
      }
    });

    let savedNote;

    if (existingNote) {
      // Mettre à jour la note existante
      savedNote = await prisma.note.update({
        where: {
          iduser_idanime: {
            iduser,
            idanime: animeId
          }
        },
        data: {
          note: note,
          datenote: new Date()
        }
      });
    } else {
      // Créer une nouvelle note
      savedNote = await prisma.note.create({
        data: {
          iduser,
          idanime: animeId,
          note: note,
          datenote: new Date()
        }
      });
    }

    // Recalculer la note moyenne de l'anime
    const allNotes = await prisma.note.findMany({
      where: { idanime: animeId },
      select: { note: true }
    });

    const moyenne = allNotes.length > 0
      ? allNotes.reduce((sum, n) => sum + parseFloat(n.note?.toString() || "0"), 0) / allNotes.length
      : 0;

    // Mettre à jour la note moyenne de l'anime
    await prisma.anime.update({
      where: { idanime: animeId },
      data: { notemoyenne: moyenne }
    });

    return NextResponse.json({ 
      note: parseFloat(savedNote.note?.toString() || "0"),
      noteMoyenne: moyenne
    });
  } catch (error) {
    console.error("Erreur notation anime:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
