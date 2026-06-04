/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    safelist: [
        // Per-category theme classes used dynamically via getTheme()
        { pattern: /^(bg|text|border|ring|hover:bg)-(red|blue|teal|pink|cyan|orange|amber|yellow|emerald|violet|sky|stone|rose|fuchsia|slate|zinc|green|indigo|purple)-(50|100|200|300|400|500|600|700|800|900|950)$/ },
        { pattern: /^(from|via|to)-(red|blue|teal|pink|cyan|orange|amber|yellow|emerald|violet|sky|stone|rose|fuchsia|slate|zinc|green|indigo|purple)-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['Archivo', 'system-ui', 'sans-serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                // CTA accent (fresh grass green - vibrant, light)
                brand: {
                    50: '#f4faea', 100: '#e6f5d0', 200: '#cdebab', 300: '#abdb78',
                    400: '#8cca4d', 500: '#74b832', 600: '#5a9624', 700: '#46741e',
                    800: '#3a5d1d', 900: '#314e1b',
                },
                // Ink / charcoal for dark sections and headlines
                ink: {
                    50:  '#f4f4f5', 100: '#e4e4e7', 200: '#d4d4d8', 300: '#a1a1aa',
                    400: '#71717a', 500: '#52525b', 600: '#3f3f46', 700: '#27272a',
                    800: '#18181b', 900: '#09090b',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
                popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
                primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
                secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
                muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
                accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
                destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
                'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
                'marquee': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
                'pulse-ring': { '0%,100%': { boxShadow: '0 0 0 0 rgba(116,184,50,0.45)' }, '50%': { boxShadow: '0 0 0 14px rgba(116,184,50,0)' } },
                'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'marquee': 'marquee 40s linear infinite',
                'pulse-ring': 'pulse-ring 2s infinite',
                'shimmer': 'shimmer 3s linear infinite',
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
