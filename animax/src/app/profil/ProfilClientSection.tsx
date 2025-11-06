"use client";
import Image from "next/image";
import ProfilePicUpload from "./ProfilePicUpload";
import { useState } from "react";

export default function ProfilClientSection({ user }: { user: any }) {
  const [photoUrl, setPhotoUrl] = useState(user.file?.url);

  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-400 group">
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
