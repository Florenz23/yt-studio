import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "3xl": "1700px",
      },
    },
    extend: {
      screens: {
        "3xl": "1984px",
      },
      fontFamily: {
        sans: ["var(--font-scry)", "var(--font-inter)", ...fontFamily.sans],
        mono: ["var(--font-inter)", ...fontFamily.mono],
        material: ["var(--font-material-symbols)"],
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          faint: "hsl(var(--border-faint))",
          linear: "var(--border-linear)",
          light: "var(--border-light)",
          hard: "hsl(var(--border-hard))",
        },
        "row-border": "var(--row-border)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          menu: "var(--background-menu)",
          secondary: "hsl(var(--background-secondary))",
        },
        surface: {
          "200": "var(--surface-200)",
          "300": "var(--surface-300)",
          DEFAULT: "var(--surface)",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        selection: {
          bg: "var(--selection-bg)",
          color: "var(--selection-color)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          accent: "hsl(var(--secondary-accent))",
        },
        gray: {
          tertiary: "var(--gray-tertiary)",
          accent: "var(--gray-accent)",
          "alpha-400": "var(--gray-alpha-400)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
          super: "hsl(var(--super-muted))",
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
        "blue-primary": {
          DEFAULT: "var(--blue-primary)",
          hover: "var(--blue-primary-hover)",
        },
        "green-secondary": {
          DEFAULT: "var(--green-secondary)",
          hover: "var(--green-secondary-hover)",
        },
        "green-synced": {
          DEFAULT: "var(--green-synced)",
          muted: "var(--green-synced-muted)",
        },
        lavender: {
          DEFAULT: "var(--lavender)",
          foreground: "var(--lavender-foreground)",
          dark: "var(--lavender-dark-foreground)",
        },
        highlight: "var(--highlight)",
        cyan: {
          DEFAULT: "var(--cyan)",
          dark: "var(--cyan-dark)",
        },
        apple: {
          mint: {
            DEFAULT: "var(--apple-mint)",
            accessible: "var(--apple-mint-accessible)",
          },
          cyan: {
            DEFAULT: "var(--apple-cyan)",
            accessible: "var(--apple-cyan-accessible)",
          },
          blue: {
            DEFAULT: "var(--apple-blue)",
            accent: "var(--apple-blue-accent)",
            muted: "var(--apple-blue-muted)",
            "muted-foreground": "var(--apple-blue-muted-foreground)",
            transparent: "var(--apple-blue-transparent)",
          },
          green: {
            DEFAULT: "var(--apple-green)",
            muted: "var(--apple-green-muted)",
          },
          pink: {
            DEFAULT: "var(--apple-pink)",
            transparent: "var(--apple-pink-transparent)",
          },
          red: "var(--apple-red)",
          orange: "var(--apple-orange)",
          yellow: "var(--apple-yellow)",
          purple: {
            DEFAULT: "var(--apple-purple)",
            transparent: "var(--apple-purple-transparent)",
            accessible: "var(--apple-purple-accessible)",
          },
          indigo: {
            DEFAULT: "var(--apple-indigo)",
            transparent: "var(--apple-indigo-transparent)",
          },
        },
        ds: {
          gray: {
            "50": "var(--ds-gray-50)",
            "900": "var(--ds-gray-900)",
          },
          amber: {
            "100": "var(--ds-amber-100)",
            "200": "var(--ds-amber-200)",
            "300": "var(--ds-amber-300)",
            "400": "var(--ds-amber-400)",
            "500": "var(--ds-amber-500)",
            "600": "var(--ds-amber-600)",
            "700": "var(--ds-amber-700)",
          },
          blue: {
            "400": "var(--ds-blue-400)",
            "500": "var(--ds-blue-500)",
            "600": "var(--ds-blue-600)",
            "700": "var(--ds-blue-700)",
            "900": "var(--ds-blue-900)",
          },
          "deep-blue": {
            "700": "var(--ds-deep-blue-700)",
          },
          green: {
            "100": "var(--ds-green-100)",
            "200": "var(--ds-green-200)",
            "300": "var(--ds-green-300)",
            "400": "var(--ds-green-400)",
            "500": "var(--ds-green-500)",
            "600": "var(--ds-green-600)",
            "700": "var(--ds-green-700)",
          },
          teal: {
            "100": "var(--ds-teal-100)",
            "200": "var(--ds-teal-200)",
            "300": "var(--ds-teal-300)",
            "400": "var(--ds-teal-400)",
            "500": "var(--ds-teal-500)",
            "600": "var(--ds-teal-600)",
            "700": "var(--ds-teal-700)",
          },
          pink: {
            "100": "var(--ds-pink-100)",
            "200": "var(--ds-pink-200)",
            "300": "var(--ds-pink-300)",
            "400": "var(--ds-pink-400)",
            "500": "var(--ds-pink-500)",
            "600": "var(--ds-pink-600)",
            "700": "var(--ds-pink-700)",
          },
          purple: {
            "100": "var(--ds-purple-100)",
            "200": "var(--ds-purple-200)",
            "300": "var(--ds-purple-300)",
            "400": "var(--ds-purple-400)",
            "500": "var(--ds-purple-500)",
            "600": "var(--ds-purple-600)",
            "700": "var(--ds-purple-700)",
            "900": "var(--ds-purple-900)",
          },
          red: {
            "600": "var(--ds-red-600)",
            "700": "var(--ds-red-700)",
            "800": "var(--ds-red-800)",
            "900": "var(--ds-red-900)",
          },
        },
        polar: {
          "700": "hsl(var(--polar-700))",
          "800": "hsl(var(--polar-800))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-slow": {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0.7",
          },
          "50%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(0.9)",
            opacity: "0.7",
          },
        },
        dotFade: {
          "0%, 100%": {
            opacity: "0.2",
          },
          "20%": {
            opacity: "1",
          },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },
        gradientSwipe: {
          "0%": {
            backgroundPosition: "200% 0",
          },
          "100%": {
            backgroundPosition: "0 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        dotFade: "dotFade 1.4s infinite ease-in-out both",
        gradientSwipe: "gradientSwipe 2s linear infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
