"use client";
import { useState, useEffect } from "react";
import { Heart, Trash2 } from "lucide-react";
import AddCommentForm from "./AddCommentForm";
import Link from "next/link";

type Comment = {
  idcommentaire: number;
  contenu: string | null;
  nblike: number | null;
  utilisateur: {
    nomutilisateur: string;
  };
  note?: number | null;
};

type CommentsSectionProps = {
  comments: Comment[];
  idanime: number;
};

export default function CommentsSection({ comments: initialComments, idanime }: CommentsSectionProps) {
  const [user, setUser] = useState<{ iduser: number; isadministrateur: boolean } | null>(null);
  const [comments, setComments] = useState(initialComments);
  const [userLikes, setUserLikes] = useState<Set<number>>(new Set());
  const [loadingLikes, setLoadingLikes] = useState<Set<number>>(new Set());
  const [deletingComments, setDeletingComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Récupérer l'utilisateur connecté (si co)
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          fetchUserLikes(data.user.iduser);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const fetchUserLikes = async (userId: number) => {
    try {
      const commentIds = comments.map(c => c.idcommentaire);
      const response = await fetch("/api/comments/user-likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentIds })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserLikes(new Set(data.likedComments));
      }
    } catch (error) {
      console.error("Erreur récupération likes:", error);
    }
  };

  const handleLike = async (idcommentaire: number) => {
    if (!user || loadingLikes.has(idcommentaire)) return;

    setLoadingLikes(prev => new Set(prev).add(idcommentaire));

    try {
      const response = await fetch("/api/comments/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idcommentaire })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mettre à jour l'état local
        setComments(prev => prev.map(comment => {
          if (comment.idcommentaire === idcommentaire) {
            const currentLikes = comment.nblike || 0;
            return {
              ...comment,
              nblike: data.liked ? currentLikes + 1 : currentLikes - 1
            };
          }
          return comment;
        }));

        // Mettre à jour les likes de l'utilisateur
        setUserLikes(prev => {
          const newLikes = new Set(prev);
          if (data.liked) {
            newLikes.add(idcommentaire);
          } else {
            newLikes.delete(idcommentaire);
          }
          return newLikes;
        });
      }
    } catch (error) {
      console.error("Erreur like:", error);
    } finally {
      setLoadingLikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(idcommentaire);
        return newSet;
      });
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleDelete = async (idcommentaire: number) => {
    if (!user?.isadministrateur || deletingComments.has(idcommentaire)) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;

    setDeletingComments(prev => new Set(prev).add(idcommentaire));

    try {
      const response = await fetch(`/api/comments/${idcommentaire}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setComments(prev => prev.filter(c => c.idcommentaire !== idcommentaire));
      } else {
        alert("Erreur lors de la suppression du commentaire");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur de connexion");
    } finally {
      setDeletingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(idcommentaire);
        return newSet;
      });
    }
  };

  return (
    <>
      {user && <AddCommentForm idanime={idanime} onCommentAdded={handleCommentAdded} />}
      
      {comments.length === 0 ? (
        <p className="text-gray-400">Aucun commentaire.</p>
      ) : (
        comments.map((c: any) => (
          <div key={c.idcommentaire} className="bg-purple-800/40 rounded-md p-3">
            <p className="text-sm">
              <Link
                href={`/profil/${c.utilisateur.iduser}`}
                className="font-semibold text-cyan-300 hover:underline"
              >
                {c.utilisateur.nomutilisateur}
              </Link>
              : {c.contenu}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
              <button
                onClick={() => handleLike(c.idcommentaire)}
                disabled={!user || loadingLikes.has(c.idcommentaire)}
                className={`flex items-center gap-1 transition-colors ${
                  user ? "hover:text-red-400 cursor-pointer" : "cursor-default"
                } ${userLikes.has(c.idcommentaire) ? "text-red-400" : ""}`}
              >
                <Heart
                  size={16}
                  className={userLikes.has(c.idcommentaire) ? "fill-red-400" : ""}
                />
                <span>{c.nblike || 0}</span>
              </button>
              
              {c.note !== null && c.note !== undefined && (
                <span className="text-base md:text-lg font-bold text-yellow-400">
                  ★ {c.note}/10
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
}
