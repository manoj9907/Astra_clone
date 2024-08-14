/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      primary: ["figTree"],
      mono: ["var(--font-mono)"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        gray: {
          930: "#919191",
          940: "#C2C2C2",
          950: "#1E1E1E",
          960: "#f2f2f2",
          970: "#131313",
          980: "#F2F2F2",
          990: "#dadada",
        },
        customDark: "#060707",
        customRed: "#ef0d0d",
        customBlack: "#1E1E1E",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "rounded-5": "5px",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        customBlack: "#1E1E1E",
      },
      width: {
        "custom-450": "450px",
        "custom-305": "305px",
        "custom-265": "265px",
        "custom-494": "494px",
        "custom-423": "423px",
        "custom-170": "170px",
        "custom-274": "274px",
        "custom-21": "21px",
        "custom-35": "35px",
        "custom-30%": "30%",
      },
      height: {
        "custom-354": "354px",
        "custom-60": "60px",
        "custom-21": "21px",
        "custom-35": "35px",
        "custom-59": "59px",
        "custom-350": "350px",
        "custom-500": "500px",
        "custom-403": "403px",
        "custom-70%": "70%",
      },
      padding: {
        5: "20px", // Custom padding for 20px
        17.5: "70px", // Custom padding for 70px
        "custom-37px": "37px",
      },
      margin: {
        "custom-15": "15px",
        "custom-18": "18px",
        "custom-6": "6%",
      },
      letterSpacing: {
        "tracking-43": "43px",
      },
    },
  },
  plugins: [],
};
