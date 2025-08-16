import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Base colors (light mode defaults)
        background: "var(--background, #dee7f1)",
        foreground: "var(--foreground, #232427)",

        // Card & popover
        card: "var(--card, #ffffff)",
        "card-foreground": "var(--card-foreground, #232427)",
        popover: "var(--popover, #dee7f1)",
        "popover-foreground": "var(--popover-foreground, #232427)",

        // States
        success: "var(--success, #29b093)",
        danger: "var(--danger, #ee3160)",
        destructive: "var(--destructive, #ee3160)",

        // Primary colors
        primary: "var(--primary, #376fb1)",
        "primary-foreground": "var(--primary-foreground, #f5f5f5)",
        secondary: "var(--secondary, #e0e0e0)",
        "secondary-foreground": "var(--secondary-foreground, #376fb1)",
        accent: "var(--accent, #d9d9d9)",
        "accent-foreground": "var(--accent-foreground, #376fb1)",
        muted: "var(--muted, #e0e0e0)",
        "muted-foreground": "var(--muted-foreground, #6b7280)",

        // Forms
        border: "var(--border, #95a3a5)",
        input: "var(--input, #95a3a5)",
        ring: "var(--ring, #b0b0b0)",

        // Charts
        "chart-1": "var(--chart-1, #d4b45f)",
        "chart-2": "var(--chart-2, #6699cc)",
        "chart-3": "var(--chart-3, #aa77bb)",
        "chart-4": "var(--chart-4, #88cc44)",
        "chart-5": "var(--chart-5, #cc6677)",

        // Sidebar specific
        sidebar: "var(--sidebar, var(--card, #ffffff))",
        "sidebar-foreground":
          "var(--sidebar-foreground, var(--card-foreground, #232427))",
        "sidebar-primary": "var(--sidebar-primary, var(--primary, #376fb1))",
        "sidebar-primary-foreground":
          "var(--sidebar-primary-foreground, var(--primary-foreground, #f5f5f5))",
        "sidebar-accent": "var(--sidebar-accent, var(--accent, #d9d9d9))",
        "sidebar-accent-foreground":
          "var(--sidebar-accent-foreground, var(--accent-foreground, #376fb1))",
        "sidebar-border": "var(--sidebar-border, var(--border, #95a3a5))",
      },
      borderRadius: {
        sm: "var(--radius-sm, calc(var(--radius, 0.625rem) - 4px))",
        md: "var(--radius-md, calc(var(--radius, 0.625rem) - 2px))",
        lg: "var(--radius-lg, var(--radius, 0.625rem))",
        xl: "var(--radius-xl, calc(var(--radius, 0.625rem) + 4px))",
      },
    },
  },
  plugins: [],
} satisfies Config;
