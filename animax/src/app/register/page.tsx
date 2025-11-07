"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomutilisateur: "",
    mdp: "",
    confirmMdp: "",
    adressemail: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérifier que les mots de passe correspondent
    if (formData.mdp !== formData.confirmMdp) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomutilisateur: formData.nomutilisateur,
          mdp: formData.mdp,
          adressemail: formData.adressemail
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger vers la page d'accueil
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Erreur d'inscription");
      }
    } catch (err) {
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
            <span className="text-white">Rejoindre </span>
            <span className="text-cyan-400">AniMaX</span>
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Créez votre compte pour commencer
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
                placeholder="Choisissez un nom d'utilisateur"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label htmlFor="adressemail" className="block text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="adressemail"
                value={formData.adressemail}
                onChange={(e) => setFormData({ ...formData, adressemail: e.target.value })}
                className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="votre@email.com"
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
                placeholder="Choisissez un mot de passe"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmMdp" className="block text-white font-medium mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmMdp"
                value={formData.confirmMdp}
                onChange={(e) => setFormData({ ...formData, confirmMdp: e.target.value })}
                className="w-full px-4 py-2 bg-purple-900/50 border border-purple-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Confirmez votre mot de passe"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
