"use client";
import Image from "next/image";
import ProfilePicUpload from "./ProfilePicUpload";
import { useState } from "react";
import { Pencil } from "lucide-react";

type User = {
  nomutilisateur: string | null;
  adressemail: string | null;
  file?: {
    url: string;
  } | null;
  note: unknown[];
};

export default function ProfilClientSection({ user }: { user: User }) {
  const [photoUrl] = useState(user.file?.url);
  const [hover, setHover] = useState(false);

  return (
    <div className="flex items-center gap-6 mb-8">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-400 group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {photoUrl ? (
          <Image
            src={photoUrl.startsWith("/") ? photoUrl : `/${photoUrl.replace(/^\/+/, "")}`}
            alt="Photo de profil"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl">?</div>
        )}
        {/* Icône crayon au survol */}
        {hover && (
          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 flex items-center justify-center">
            <Pencil size={20} className="text-cyan-300" />
            {/* Utilise un span pour le tooltip accessible */}
            <span className="sr-only">Changer la photo de profil</span>
          </div>
        )}
        <ProfilePicUpload onUploaded={() => window.location.reload()} />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{user.nomutilisateur}</h1>
        <p className="text-gray-300">{user.adressemail}</p>
        <p className="mt-2 text-cyan-300">{user.note.length} animes notés</p>
      </div>
    </div>
  );
}
