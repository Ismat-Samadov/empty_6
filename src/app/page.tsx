// ============================================================
// Root page — renders the Piano Tiles game full-screen
// ============================================================

import Game from "@/components/Game";

export default function Home() {
  return (
    <main className="fixed inset-0 flex items-stretch justify-center bg-[#0a0a0f]">
      {/* Constrain to a max width so it looks like a mobile game on wide screens */}
      <div className="relative w-full max-w-sm h-full">
        <Game />
      </div>
    </main>
  );
}
