import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                nexus: { 50: '#f0edff', 100: '#ddd6fe', 200: '#c4b5fd', 300: '#a78bfa', 400: '#8b5cf6', 500: '#6c63ff', 600: '#5b52e0', 700: '#4c3db8', 800: '#3d3291', 900: '#2d246b', 950: '#1a1436' },
                dark: { 100: '#ccd6f6', 200: '#8892b0', 300: '#233554', 400: '#1d2d50', 500: '#162447', 600: '#121d3a', 700: '#0d1530', 800: '#0a1128', 900: '#060b1a' },
            },
            fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.6s ease-out',
            },
            keyframes: {
                glow: { '0%': { boxShadow: '0 0 5px #6c63ff, 0 0 10px #6c63ff' }, '100%': { boxShadow: '0 0 20px #6c63ff, 0 0 40px #6c63ff' } },
                float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
                slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
            },
        },
    },
    plugins: [],
};

export default config;
