import GamesSection from "./components/sections/GamesSection";
import HeroSection from "./components/sections/HeroSection";

export default async function KidsZone() {
  return (
    <main className="min-h-screen bg-red-700 w-full">
      <HeroSection />
      <GamesSection />
    </main>
  );
}
