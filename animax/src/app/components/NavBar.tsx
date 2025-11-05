"use client"

export default function NavBar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-1000 to-purple-1000 text-white">

      <h1 className="text-2xl font-bold font-poppins">
        <span className="text-white">Ani</span>
        <span className="text-cyan-400">MaX</span>
      </h1>

      <nav className="flex gap-6 text-lg font-semibold font-inter">
        <a href="/" className="hover:text-cyan-300">Animes</a>
        <a href="#" className="hover:text-cyan-300">Actus</a>
      </nav>

      <div className="flex gap-4 font-medium">
        <button className="hover:text-cyan-300">S&apos;inscrire</button>
        <button className="hover:text-cyan-300">Se connecter</button>
      </div>
    </header>
  )
}
