import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.utilisateur.findUnique({
      where: { iduser: parseInt(userId) },
      include: { file: true }
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        iduser: user.iduser,
        nomutilisateur: user.nomutilisateur,
        adressemail: user.adressemail,
        isadministrateur: user.isadministrateur,
        photoUrl: user.file?.url || null
      }
    });
  } catch (error) {
    console.error("Erreur me:", error);
    return NextResponse.json({ user: null });
  }
}
