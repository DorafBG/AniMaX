"use client";
import { useState, useEffect } from "react";

type UserRatingSectionProps = {
  animeId: number;
  noteMoyenne: number | null;
  notes: any[];
};

type User = {
  iduser: number;
  nomutilisateur: string;
};

export default function UserRatingSection({ animeId, noteMoyenne, notes }: UserRatingSectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          // Trouver la note de l'utilisateur pour cet anime
          const userNote = notes.find((n: any) => n.iduser === data.user.iduser);
          setUserRating(userNote ? parseFloat(userNote.note) : null);
        }
      })
      .catch(() => setUser(null));
  }, [animeId, notes]);

  return (
    <div className="flex justify-between items-center mb-6">
      {user && (
        <div className="flex-1">
          <p className="text-sm text-gray-400">Ta note :</p>
          <p className="text-lg font-semibold">
            {userRating !== null ? `${userRating}/10` : "-"}
          </p>
        </div>
      )}

      <div className={`flex-1 ${user ? 'text-right' : 'text-left'}`}>
        <p className="text-sm text-gray-400">Note moyenne :</p>
        <p className="text-lg font-semibold">
          {noteMoyenne ? `${parseFloat(noteMoyenne.toString()).toFixed(1)}/10` : "N/A"}
        </p>
      </div>
    </div>
  );
}
