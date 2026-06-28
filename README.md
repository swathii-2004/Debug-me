# debug me | Tech Charades 🎮

**debug me** is a fast-paced, high-voltage technical charades game built for developers, designers, and tech enthusiasts. Gather your team, act out complex or hilarious tech terms (without speaking!), and beat the 60-second countdown.

The application features a premium dark-themed aesthetic with glowing team colors, responsive glassmorphism designs, 3D flip card animations, dynamic audio synthesis, and celebratory confetti effects.

---

## ✨ Features

*   **Custom Multiplayer Lobby:** Support for **2 to 10 teams** with customizable names and unique color themes.
*   **3D Card Flipping:** Beautifully interactive card flip interactions to reveal tech words under acting conditions.
*   **Built-in Web Audio Engine:** Synthesizes sound effects (success chiming, buzzers, and warnings) directly via the Web Audio API—no external assets needed!
*   **Confetti Canvas:** Celebrates game completions with high-performance HTML5 canvas particle rendering.
*   **Built-in Tech Vocabulary:** Features a curated collection of 51 tech terms ranging from common devices and digital concepts to advanced architecture keywords (e.g., Kubernetes, Encryption, Glitch, etc.).
*   **Responsive layout:** Optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

*   **Frontend:** HTML5 (Semantic Structure), Vanilla CSS3 (Custom Variables, Keyframe Animations, Glassmorphism), and JavaScript (ES Modules).
*   **Tooling:** Powered by [Vite](https://vitejs.dev/) for quick development and optimized production bundling.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd "Debug me"
   ```

2. Install the dev dependencies:
   ```bash
   npm install
   ```

### Running Locally

To spin up the local development server:
```bash
npm run dev
```

This will run the Vite development server. Open the URL shown in your terminal (typically `http://localhost:5173`) in your browser.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

This bundles the assets into the `dist/` directory, ready to be deployed to static hosting providers (such as Vercel, Netlify, or GitHub Pages).

To preview the production build locally:
```bash
npm run preview
```

---

## 📖 How to Play

1.  **Lobby Setup:** Enter the number of teams participating and give each team a name.
2.  **Game Sequence:** Each team takes turns back-to-back. During a team's turn, they get exactly **5 random tech words** to guess.
3.  **Action Timer:** Tapping **"Get Word"** starts a **60-second action timer**.
    *   *Actor eyes only:* Tap the card to flip and reveal the word.
    *   The actor must act out the word without speaking or writing.
4.  **Points & Progression:**
    *   Tapping **"Correct"** adds **1 point** to the team's score.
    *   Tapping **"Pass"** skips the word (no points awarded).
    *   The turn finishes when all 5 words of the deck are completed or the timer runs out.
5.  **Victory:** The team with the highest score at the end of the round wins, triggering the confetti celebration!

---

## 📂 Project Structure

```
├── .github/          # GitHub workflow / CI configuration
├── dist/             # Production build output
├── node_modules/     # Project dependencies
├── app.js            # Core game logic, Audio Engine, Confetti, and State Management
├── index.html        # Main HTML layout
├── package.json      # NPM dependencies and scripts config
├── style.css         # Styling system, theme colors, and layout transitions
├── vite.config.js    # Vite dev environment and build config
└── README.md         # This documentation file
```
