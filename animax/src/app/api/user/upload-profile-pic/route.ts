import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
  }

  // Enregistre l'image dans /public/uploads/
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `user_${userId}_${Date.now()}_${file.name}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  // Récupère le plus grand idfile existant et incrémente
  const lastFile = await prisma.file.findFirst({
    orderBy: { idfile: "desc" },
    select: { idfile: true }
  });
  const newIdFile = lastFile ? lastFile.idfile + 1 : 1;

  // Crée une nouvelle entrée file et associe à l'utilisateur
  const fileDb = await prisma.file.create({
    data: {
      idfile: newIdFile,
      url: `/uploads/${filename}`,
      utilisateur: {
        connect: { iduser: parseInt(userId) }
      }
    }
  });

  // Met à jour l'utilisateur avec le nouvel idfile
  await prisma.utilisateur.update({
    where: { iduser: parseInt(userId) },
    data: { idfile: fileDb.idfile }
  });

  return NextResponse.json({ success: true, url: fileDb.url });
}
