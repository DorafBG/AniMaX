import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { nomutilisateur, mdp, adressemail } = await request.json();

    if (!nomutilisateur || !mdp || !adressemail) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { nomutilisateur }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà pris" },
        { status: 409 }
      );
    }

    // Trouver le prochain ID disponible
    const lastUser = await prisma.utilisateur.findFirst({
      orderBy: { iduser: 'desc' }
    });
    const newId = (lastUser?.iduser || 0) + 1;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mdp, 10);

    // Créer l'utilisateur
    const user = await prisma.utilisateur.create({
      data: {
        iduser: newId,
        nomutilisateur,
        mdp: hashedPassword,
        adressemail,
        isadministrateur: false,
        datecreationcompte: new Date()
      }
    });

    // Créer une session
    const response = NextResponse.json({
      success: true,
      user: {
        iduser: user.iduser,
        nomutilisateur: user.nomutilisateur,
        adressemail: user.adressemail,
        isadministrateur: user.isadministrateur,
        photoUrl: null
      }
    });

    response.cookies.set("userId", user.iduser.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur register:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
