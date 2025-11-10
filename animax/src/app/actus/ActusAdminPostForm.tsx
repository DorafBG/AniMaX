"use client";
import { useEffect, useState } from "react";

export default function ActusAdminPostForm() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (!mounted) return;
        setIsAdmin(Boolean(data?.user?.isadministrateur));
      })
      .catch(() => {
        if (!mounted) return;
        setIsAdmin(false);
      });
    return () => { mounted = false; };
  }, []);

  if (isAdmin === null) return null; // loading initial state
  if (!isAdmin) return null; // not admin => nothing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!titre.trim() || !contenu.trim()) {
      setError("Titre et contenu requis");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titrepost: titre.trim(), contenu: contenu.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Erreur création post");
      } else {
        // reload to see new post
        window.location.reload();
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-purple-950/50 rounded-lg border border-purple-800">
      <h3 className="text-lg font-semibold mb-2 text-cyan-300">Nouvelle publication (admin)</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre"
          className="w-full p-2 rounded-md bg-purple-900 border border-purple-700 text-white"
        />
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Contenu de la publication"
          className="w-full p-2 rounded-md bg-purple-900 border border-purple-700 text-white"
          rows={4}
        />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-cyan-400 text-black disabled:opacity-60"
          >
            {loading ? "Création..." : "Publier"}
          </button>
        </div>
      </form>
    </div>
  );
}
