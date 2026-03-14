# Piano Tiles — Rhythm & Reflex

A fast-paced neon browser game built with Next.js, TypeScript, and Tailwind CSS. Tap the falling black tiles before they escape — touch a white tile or miss a black one and it's game over!

---

## Features

- **Neon dark aesthetic** — glowing tiles on a deep dark canvas
- **HTML5 Canvas rendering** — buttery-smooth 60 fps game loop
- **3 difficulty levels** — Easy, Medium, Hard (speed, tile size, acceleration all differ)
- **Speed progression** — tiles accelerate as your score climbs
- **Combo system** — chain taps for bonus audio cues at x10, x20…
- **High score persistence** — localStorage saves your best per difficulty
- **Web Audio synthesizer** — 4-column piano notes, combo fanfares, game-over chords — no audio files needed
- **Background music toggle** — simple arpeggiated BGM with Web Audio API
- **Pause / Resume** — Space or Escape key, or the pause button
- **Animated UI** — Framer Motion transitions on all screens
- **Fully responsive** — works on any screen size
- **Touch controls** — tap the canvas directly on mobile + on-screen A/S/D/F buttons
- **Keyboard controls** — A S D F columns, Space/Esc to pause, Enter to start/retry
- **Vercel-ready** — zero extra config needed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Rendering | HTML5 Canvas |
| Audio | Web Audio API (synthesized) |
| Persistence | localStorage |
| Deploy | Vercel |

---

## Controls

### Keyboard

| Key | Action |
|-----|--------|
| `A` | Column 1 (leftmost) |
| `S` | Column 2 |
| `D` | Column 3 |
| `F` | Column 4 (rightmost) |
| `Space` or `Esc` | Pause / Resume |
| `Enter` | Start / Retry |
| `←` `↓` `↑` `→` | Columns 1–4 (alt) |

### Mouse / Touch

- **Click or tap** anywhere on a column in the canvas
- **On-screen A/S/D/F buttons** below the canvas (great for mobile)

---

## How to Run Locally

```bash
# Clone the repository
git clone <repo-url>
cd piano_tiles

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel

1. Push your code to GitHub / GitLab / Bitbucket
2. Go to [vercel.com](https://vercel.com) and click **New Project**
3. Import your repository — Vercel auto-detects Next.js
4. Click **Deploy** — done!

No environment variables or extra configuration needed.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Base styles + Tailwind import
│   ├── icon.tsx           # Favicon (Next.js ImageResponse)
│   ├── layout.tsx         # Root layout + metadata
│   └── page.tsx           # Entry page
├── components/
│   ├── Game.tsx           # Top-level orchestrator
│   ├── GameCanvas.tsx     # Canvas renderer + input handler
│   ├── HUD.tsx            # In-game score / pause UI
│   ├── StartScreen.tsx    # Pre-game menu
│   ├── GameOverScreen.tsx # End screen with score card
│   ├── PauseScreen.tsx    # Pause overlay
│   └── TapButtons.tsx     # Mobile on-screen buttons
├── hooks/
│   ├── useGameEngine.ts   # Core game loop & state reducer
│   ├── useHighScore.ts    # localStorage high score
│   └── useSound.ts        # Web Audio synthesizer
└── utils/
    ├── gameConstants.ts   # Difficulty configs, column colors
    ├── gameTypes.ts       # TypeScript interfaces
    └── tileGenerator.ts   # Tile/row generation helpers
```

---

## Gameplay Rules

1. Black tiles fall from the top in 4 columns
2. Tap a black tile while it's in the **tap zone** (bottom strip)
3. Miss a black tile (it exits the bottom) → **Game Over**
4. Tap an empty column (no black tile in range) → **Game Over**
5. Speed increases every N taps depending on difficulty
6. Survive as long as possible and beat your high score!

---

## License

MIT
