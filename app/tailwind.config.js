/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#135bec",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
            },
            keyframes: {
                "fade-in": {
                    from: { opacity: "0", transform: "translateX(-50%) translateY(8px)" },
                    to: { opacity: "1", transform: "translateX(-50%) translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.2s ease-out",
            },
        },
    },
    plugins: [],
}
