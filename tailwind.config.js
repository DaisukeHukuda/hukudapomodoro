/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb', // Blue 600
                    hover: '#1d4ed8',   // Blue 700
                    light: '#eff6ff',   // Blue 50
                },
                navy: {
                    DEFAULT: '#0f172a', // Slate 900
                    light: '#1e293b',   // Slate 800
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
