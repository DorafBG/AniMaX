import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const titrepost = (body.titrepost || "").toString().trim();
    const contenu = (body.contenu || "").toString().trim();

    if (!titrepost || !contenu) {
      return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
    }

    // Vérifier que l'utilisateur est administrateur
    const user = await prisma.utilisateur.findUnique({
      where: { iduser: parseInt(userId) },
      select: { isadministrateur: true }
    });

    if (!user || !user.isadministrateur) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Générer un nouvel idpost si nécessaire
    const last = await prisma.post.findFirst({
      orderBy: { idpost: "desc" },
      select: { idpost: true }
    });
    const newId = last ? last.idpost + 1 : 1;

    const created = await prisma.post.create({
      data: {
        idpost: newId,
        titrepost,
        contenu,
        datepost: new Date(),
        iduser: parseInt(userId)
      }
    });

    return NextResponse.json({ success: true, post: created }, { status: 201 });
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
