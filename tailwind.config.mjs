/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
        },
        neutral: {
          dark: "var(--neutral-dark)",
          medium: "var(--neutral-medium)",
          light: "var(--neutral-light)",
        },
        error: "var(--error)",
        success: "var(--success)",
      },
      fontFamily: {
        inder: ["Inder", "sans-serif"],
        gugi: ["Gugi", "sans-serif"],
        julee: ["Julee", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'card': '-2px 2px 8px 0px rgba(116,116,116,0.25)',
        'card-hover': '-2px 2px 12px 0px rgba(116,116,116,0.4)',
      },
      borderRadius: {
        'card': '0.75rem',
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-in-out',
        bounce: 'bounce 2s infinite',
        dashoffset: 'dashoffset 1s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        slideUp: 'slideUp 0.5s ease-out',
        slideIn: 'slideIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        dashoffset: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};

export default config;
