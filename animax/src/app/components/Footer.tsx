"use client";
import { Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-1000 to-purple-900 text-white mt-34 border-t border-purple-700">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-poppins mb-2">
              <span className="text-white">Ani</span>
              <span className="text-cyan-400">MaX</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Votre plateforme de référence pour découvrir, noter et discuter de vos animes préférés.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-base font-semibold mb-2 text-cyan-400">Navigation</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-cyan-300 transition-colors inline-block">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-cyan-300 transition-colors inline-block">
                  Animes
                </a>
              </li>
              <li>
                <a href="/actus" className="text-gray-300 hover:text-cyan-300 transition-colors inline-block">
                  Actus
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors inline-block">
                  Mon profil
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-2 text-cyan-400">Contact</h3>
            <div className="space-y-2 text-sm">
              <a 
                href="mailto:contact@animax.com" 
                className="flex items-center gap-2 text-gray-300 hover:text-cyan-300 transition-colors group"
              >
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                <span>contact@animax.com</span>
              </a>
              <a 
                href="https://github.com/DorafBG/AniMaX" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-cyan-300 transition-colors group"
              >
                <Github size={18} className="group-hover:scale-110 transition-transform" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-purple-700 my-4"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-2">
          <p>
            © {currentYear} AniMaX. Tous droits réservés.
          </p>
          <p className="flex items-center gap-2">
            Fait par Quentin, Germain et Khanh-Lam
          </p>
        </div>
      </div>
    </footer>
  );
}
