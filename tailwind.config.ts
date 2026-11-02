import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          dark: "#070913",
          card: "#0e1329",
          cardBorder: "rgba(0, 240, 255, 0.16)",
          cyan: "#00f0ff",
          magenta: "#ff007f",
          amber: "#ffb800",
          green: "#00ff88",
          text: "#f0f4fc",
          muted: "#8a96b4",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        cyanGlow: "0 0 20px rgba(0, 240, 255, 0.35)",
        magentaGlow: "0 0 20px rgba(255, 0, 127, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
