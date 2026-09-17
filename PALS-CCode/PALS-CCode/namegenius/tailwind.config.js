/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        raster: ['Raster', 'sans-serif'],
        display: ['Raster', 'sans-serif'],
        sans: ['Meltmino', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Meltmino', 'ui-monospace', 'monospace'],
      },
      colors: {
        titanium: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0b0f17',
        },
        brass: {
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
        },
        cathode: {
          amber: '#f59e0b',
          emerald: '#10b981',
          cyan: '#06b6d4',
          crimson: '#f43f5e',
        },
      },
      boxShadow: {
        'skeuo-flat': '0 1px 2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'skeuo-raised': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(0, 0, 0, 0.08)',
        'skeuo-button': '0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -2px 0 rgba(0, 0, 0, 0.2)',
        'skeuo-recessed': 'inset 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px 0 rgba(255, 255, 255, 0.8)',
        'skeuo-recessed-dark': 'inset 0 3px 6px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.07)',
        'glow-emerald': '0 0 12px rgba(16, 185, 129, 0.6), 0 0 24px rgba(16, 185, 129, 0.2)',
        'glow-amber': '0 0 12px rgba(245, 158, 11, 0.6), 0 0 24px rgba(245, 158, 11, 0.2)',
        'glow-cyan': '0 0 12px rgba(6, 182, 212, 0.6), 0 0 24px rgba(6, 182, 212, 0.2)',
      },
    },
  },
  plugins: [],
}
