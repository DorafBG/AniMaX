"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";

type User = {
  iduser: number;
  nomutilisateur: string;
  adressemail: string;
  isadministrateur: boolean;
  photoUrl: string | null;
};

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setImageError(false); // Réinitialiser l'erreur d'image
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setImageError(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-1000 to-purple-1000 text-white">
      <Link href="/">
        <h1 className="text-2xl font-bold font-poppins cursor-pointer">
          <span className="text-white">Ani</span>
          <span className="text-cyan-400">MaX</span>
        </h1>
      </Link>

      <nav className="flex gap-6 text-lg font-semibold font-inter">
        <Link href="/" className="hover:text-cyan-300">Animes</Link>
        <Link href="/actus" className="hover:text-cyan-300">Actus</Link>
      </nav>

      <div className="flex gap-4 font-medium items-center">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {user.photoUrl && !imageError ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.photoUrl}`}
                    alt={user.nomutilisateur}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg border-2 border-cyan-400">
                  {user.nomutilisateur.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-purple-800 border border-purple-600 rounded-lg shadow-xl z-20">
                  <div className="p-3 border-b border-purple-600">
                    {user.isadministrateur && (
                      <p className="text-yellow-400 text-sm mb-2">Administrateur</p>
                    )}
                    <p className="text-white font-semibold">{user.nomutilisateur}</p>
                    <p className="text-gray-400 text-sm">{user.adressemail}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      router.push("/profil");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    <User size={18} />
                    Mon profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-purple-700 text-red-400 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link href="/register" className="hover:text-cyan-300">
              S&apos;inscrire
            </Link>
            <Link href="/login" className="hover:text-cyan-300">
              Se connecter
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

