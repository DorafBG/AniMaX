"use client";
import { useState } from "react";
import { Send } from "lucide-react";

type AddCommentFormProps = {
  idanime: number;
  onCommentAdded: (comment: any) => void;
};

export default function AddCommentForm({ idanime, onCommentAdded }: AddCommentFormProps) {
  const [contenu, setContenu] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contenu.trim() === "") {
      setError("Le commentaire ne peut pas être vide");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idanime, contenu })
      });

      if (response.ok) {
        const data = await response.json();
        setContenu("");
        onCommentAdded(data.comment);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de l'ajout du commentaire");
      }
    } catch (error) {
      setError("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Écrire un commentaire..."
          className="flex-1 bg-purple-800/40 text-white rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
          rows={2}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || contenu.trim() === ""}
          className="bg-cyan-400 hover:bg-cyan-300 text-purple-900 font-semibold px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </form>
  );
}
