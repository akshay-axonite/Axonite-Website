/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette pulled directly from the Axonite logo:
        // navy wordmark, violet→blue→cyan circuit gradient.
        ink: "#1B1F52",
        "ink-soft": "#262B6B",
        paper: "#F5F6FB",
        "paper-dim": "#EAEBF6",
        signal: "#3E5FE0",
        "signal-dim": "#2A46B8",
        violet: "#9B4FC9",
        cyan: "#29B6F6",
        ember: "#9B4FC9",
        graphite: "#565973",
        mist: "#AEB2D6",
        line: "#33397A",
        "line-soft": "#DEE1F2",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
    },
  },
  plugins: [],
};
