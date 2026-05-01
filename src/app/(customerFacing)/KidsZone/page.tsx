import GamesSection from "./components/sections/GamesSection";
import HeroSection from "./components/sections/HeroSection";

export default function KidsZone() {
  const isUnlocked = false; // flip to true once he pays

  return (
    <div className="relative">
      {/* Blurred locked content */}
      <div className={isUnlocked ? "" : "blur-sm pointer-events-none select-none"}>
        <main className="relative min-h-screen bg-black w-screen">
          <HeroSection />
          <GamesSection />
        </main>
      </div>

      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              This feature is locked
            </h2>

            <p className="text-sm text-gray-500 leading-relaxed">
              The Kids Zone page is ready and waiting — complete your payment
              to unlock it instantly.
            </p>

            <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-2">
              <a
                href="https://www.paypal.com/invoice/p/#F2SRSDM5V766XHBW"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.645h7.966c2.766 0 4.7.602 5.747 1.79.487.557.8 1.14.954 1.78.162.674.13 1.48-.094 2.463l-.007.035v.39l.262.149c.22.124.418.273.594.445.313.303.514.688.598 1.142.088.47.059 1.031-.086 1.672-.169.738-.442 1.38-.812 1.907a5.16 5.16 0 0 1-1.285 1.31c-.487.332-1.07.584-1.733.748-.642.16-1.376.241-2.183.241h-.52a1.557 1.557 0 0 0-1.538 1.315l-.123.666-.59 3.738-.027.138a.641.641 0 0 1-.633.534H7.076z"/>
                </svg>
                Pay Invoice — $300
              </a>

              <p className="text-xs text-gray-400">
                Invoice sent via PayPal ·{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}