"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

type UserRatingSectionProps = {
  animeId: number;
  noteMoyenne: number | null;
  notes: any[];
  onRatingUpdate?: (newRating: number, newAverage: number) => void;
};

type User = {
  iduser: number;
  nomutilisateur: string;
};

export default function UserRatingSection({ animeId, noteMoyenne, notes, onRatingUpdate }: UserRatingSectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(noteMoyenne);

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

  const handleRating = async (rating: number) => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/animes/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idanime: animeId, note: rating })
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(data.note);
        setAverageRating(data.noteMoyenne);
        if (onRatingUpdate) {
          onRatingUpdate(data.note, data.noteMoyenne);
        }
      } else {
        alert("Erreur lors de l'enregistrement de la note");
      }
    } catch (error) {
      console.error("Erreur notation:", error);
      alert("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating !== null ? hoverRating : (userRating || 0);

    for (let i = 1; i <= 5; i++) {
      const fullValue = i * 2;
      const halfValue = i * 2 - 1;
      const isFull = displayRating >= fullValue;
      const isHalf = displayRating >= halfValue && displayRating < fullValue;

      stars.push(
        <div key={i} className="relative inline-block cursor-pointer" style={{ width: '24px', height: '24px' }}>
          {/* Demi-étoile gauche */}
          <div
            className="absolute left-0 top-0 w-1/2 h-full overflow-hidden"
            onMouseEnter={() => !isSubmitting && setHoverRating(halfValue)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => handleRating(halfValue)}
          >
            <Star
              size={24}
              className={`${isHalf || isFull ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} transition-colors`}
            />
          </div>
          {/* Demi-étoile droite */}
          <div
            className="absolute right-0 top-0 w-1/2 h-full overflow-hidden"
            onMouseEnter={() => !isSubmitting && setHoverRating(fullValue)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => handleRating(fullValue)}
          >
            <div className="relative" style={{ right: '12px' }}>
              <Star
                size={24}
                className={`${isFull ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} transition-colors`}
              />
            </div>
          </div>
        </div>
      );
    }

    return stars;
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {user && (
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2">Ta note :</p>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars()}</div>
            <span className="text-lg font-semibold ml-2">
              {userRating !== null ? `${userRating}/10` : "0/10"}
            </span>
          </div>
          {isSubmitting && <p className="text-xs text-gray-500 mt-1">Enregistrement...</p>}
        </div>
      )}

      <div className={`flex-1 ${user ? 'text-right' : 'text-left'}`}>
        <p className="text-sm text-gray-400">Note moyenne :</p>
        <p className="text-lg font-semibold">
          {averageRating ? `${parseFloat(averageRating.toString()).toFixed(1)}/10` : "N/A"}
        </p>
      </div>
    </div>
  );
}
