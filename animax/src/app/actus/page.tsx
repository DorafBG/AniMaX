import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ActusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-1000 flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-4xl font-bold font-poppins mb-4">
            <span className="text-white">Actus </span>
            <span className="text-cyan-400">Anime</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Bientôt disponible !
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
