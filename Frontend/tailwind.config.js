// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Renamed to 'exact' prefix to match your React component usage
        'exact-background': 'hsl(var(--background))',
        'exact-foreground': 'hsl(var(--foreground))',
        'exact-card': 'hsl(var(--card))',
        'exact-card-foreground': 'hsl(var(--card-foreground))',
        'exact-popover': 'hsl(var(--popover))',
        'exact-popover-foreground': 'hsl(var(--popover-foreground))',
        'exact-primary': 'hsl(var(--primary))',
        'exact-primary-foreground': 'hsl(var(--primary-foreground))',
        'exact-secondary': 'hsl(var(--secondary))',
        'exact-secondary-foreground': 'hsl(var(--secondary-foreground))',
        'exact-muted': 'hsl(var(--muted))',
        'exact-muted-foreground': 'hsl(var(--muted-foreground))',
        'exact-accent': 'hsl(var(--accent))',
        'exact-accent-foreground': 'hsl(var(--accent-foreground))',
        'exact-destructive': 'hsl(var(--destructive))',
        'exact-destructive-foreground': 'hsl(var(--destructive-foreground))',
        'exact-border': 'hsl(var(--border))',
        'exact-input': 'hsl(var(--input))',
        'exact-ring': 'hsl(var(--ring))',
        'exact-custom-gray-40': 'hsl(var(--muted-foreground))', // Mapped placeholder color
        // Add sidebar colors if they are used as background/text directly
        'exact-sidebar-background': 'hsl(var(--sidebar-background))',
        'exact-sidebar-foreground': 'hsl(var(--sidebar-foreground))',
        'exact-sidebar-primary': 'hsl(var(--sidebar-primary))',
        'exact-sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        'exact-sidebar-accent': 'hsl(var(--sidebar-accent))',
        'exact-sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        'exact-sidebar-border': 'hsl(var(--sidebar-border))',
        'exact-sidebar-ring': 'hsl(var(--sidebar-ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Assuming you have Inter font loaded
      },
    },
  },
  plugins: [],
}