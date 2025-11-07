import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { nomutilisateur, mdp } = await request.json();

    if (!nomutilisateur || !mdp) {
      return NextResponse.json(
        { error: "Nom d'utilisateur et mot de passe requis" },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur
    const user = await prisma.utilisateur.findUnique({
      where: { nomutilisateur },
      include: { file: true }
    });

    if (!user || !user.mdp) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe hashé
    const isPasswordValid = await bcrypt.compare(mdp, user.mdp);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Créer une session simple (en production, utiliser JWT ou autre)
    const response = NextResponse.json({
      success: true,
      user: {
        iduser: user.iduser,
        nomutilisateur: user.nomutilisateur,
        adressemail: user.adressemail,
        isadministrateur: user.isadministrateur,
        photoUrl: user.file?.url || null
      }
    });

    // Stocker l'ID utilisateur dans un cookie
    response.cookies.set("userId", user.iduser.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
