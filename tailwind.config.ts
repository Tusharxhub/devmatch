import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Futuristic AI Squid Game Colors
        "squid-pink": "hsl(var(--squid-pink))", // Neon magenta #FF1744
        "squid-teal": "hsl(var(--squid-teal))", // Electric cyan #00BCD4
        "squid-dark": "hsl(var(--squid-dark))", // Deep space black
        "squid-white": "hsl(var(--squid-white))", // Pure white
        "squid-gray": "hsl(var(--squid-gray))", // Neural gray

        // AI Enhancement Colors
        "ai-purple": "hsl(var(--ai-purple))", // Neural purple #9D00FF
        "ai-blue": "hsl(var(--ai-blue))", // Digital blue #0080FF
        "ai-green": "hsl(var(--ai-green))", // Matrix green #00CC00
        "ai-orange": "hsl(var(--ai-orange))", // Energy orange #FF8000
        "ai-grid": "hsl(var(--ai-grid))", // Grid lines
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "neural-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0 0 hsl(var(--squid-pink) / 0.7)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
            boxShadow: "0 0 0 10px hsl(var(--squid-pink) / 0)",
          },
        },
        "hologram-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px hsl(var(--squid-pink) / 0.5), 0 0 10px hsl(var(--squid-pink) / 0.3), 0 0 15px hsl(var(--squid-pink) / 0.2), inset 0 0 5px hsl(var(--squid-pink) / 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 10px hsl(var(--squid-pink) / 0.8), 0 0 20px hsl(var(--squid-pink) / 0.6), 0 0 30px hsl(var(--squid-pink) / 0.4), inset 0 0 10px hsl(var(--squid-pink) / 0.2)",
          },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "digital-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
          "75%": { opacity: "0.9" },
        },
        "ai-breathe": {
          "0%, 100%": {
            transform: "scale(1) rotate(0deg)",
            filter: "hue-rotate(0deg)",
          },
          "50%": {
            transform: "scale(1.02) rotate(1deg)",
            filter: "hue-rotate(10deg)",
          },
        },
        "cyber-slide": {
          from: {
            opacity: "0",
            transform: "translateX(-20px) skewX(-5deg)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0) skewX(0deg)",
          },
        },
        "neon-border": {
          "0%, 100%": {
            borderColor: "hsl(var(--squid-pink) / 0.5)",
            boxShadow: "0 0 5px hsl(var(--squid-pink) / 0.3)",
          },
          "25%": {
            borderColor: "hsl(var(--squid-teal) / 0.5)",
            boxShadow: "0 0 5px hsl(var(--squid-teal) / 0.3)",
          },
          "50%": {
            borderColor: "hsl(var(--ai-purple) / 0.5)",
            boxShadow: "0 0 5px hsl(var(--ai-purple) / 0.3)",
          },
          "75%": {
            borderColor: "hsl(var(--ai-blue) / 0.5)",
            boxShadow: "0 0 5px hsl(var(--ai-blue) / 0.3)",
          },
        },
        "glitch-1": {
          "0%, 14%, 15%, 49%, 50%, 99%, 100%": {
            transform: "translate(0)",
          },
          "15%, 49%": {
            transform: "translate(-2px, 2px)",
          },
        },
        "glitch-2": {
          "0%, 20%, 21%, 62%, 63%, 99%, 100%": {
            transform: "translate(0)",
          },
          "21%, 62%": {
            transform: "translate(2px, -2px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neural-pulse": "neural-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "hologram-glow": "hologram-glow 3s ease-in-out infinite",
        "matrix-rain": "matrix-rain 3s linear infinite",
        "scan-line": "scan-line 2s linear infinite",
        "digital-flicker": "digital-flicker 0.1s infinite",
        "ai-breathe": "ai-breathe 4s ease-in-out infinite",
        "cyber-slide": "cyber-slide 0.5s ease-out",
        "neon-border": "neon-border 4s linear infinite",
        "glitch-1": "glitch-1 0.5s infinite",
        "glitch-2": "glitch-2 0.5s infinite",
      },
      fontFamily: {
        mono: ["SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Courier New", "monospace"],
        sans: [
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      boxShadow: {
        "ai-glow": "0 0 20px hsl(var(--squid-pink) / 0.3), 0 0 40px hsl(var(--squid-pink) / 0.1)",
        "ai-teal": "0 0 20px hsl(var(--squid-teal) / 0.3), 0 0 40px hsl(var(--squid-teal) / 0.1)",
        "ai-purple": "0 0 20px hsl(var(--ai-purple) / 0.3), 0 0 40px hsl(var(--ai-purple) / 0.1)",
        hologram: "0 8px 32px hsl(var(--squid-pink) / 0.1), inset 0 0 0 1px hsl(var(--squid-white) / 0.2)",
      },
      backdropFilter: {
        ai: "blur(10px) saturate(180%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
