import GamesSection from "./components/sections/GamesSection";
import HeroSection from "./components/sections/HeroSection";


const Index = () => {
  return (
    <div className="min-h-screen bg-black w-full">
      <main>
        <HeroSection />
        <GamesSection />
      </main>
    </div>
  );
};

export default Index;
