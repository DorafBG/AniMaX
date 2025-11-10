"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomutilisateur: "",
    mdp: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger vers la page d'accueil
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Erreur de connexion");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000 flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-8 w-full max-w-md border border-purple-600">
          <h1 className="text-3xl font-bold font-poppins text-center mb-2">
            <span className="text-white">Connexion à </span>
            <span className="text-cyan-400">AniMaX</span>
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Connectez-vous pour accéder à votre compte
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nomutilisateur" className="block text-white font-medium mb-2">
                Nom d&apos;utilisateur
              </label>
              <input
                type="text"
                id="nomutilisateur"
                value={formData.nomutilisateur}
                onChange={(e) => setFormData({ ...formData, nomutilisateur: e.target.value })}
                className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Votre nom d'utilisateur"
                required
              />
            </div>

            <div>
              <label htmlFor="mdp" className="block text-white font-medium mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="mdp"
                value={formData.mdp}
                onChange={(e) => setFormData({ ...formData, mdp: e.target.value })}
                className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Votre mot de passe"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
