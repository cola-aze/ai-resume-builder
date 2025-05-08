module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                animePink: "#ff69b4",
                animeBlue: "#87cefa",
                animeYellow: "#ffff00",
                animeGreen: "#98fb98",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-in-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: 0 },
                    "100%": { transform: "translateY(0)", opacity: 1 },
                },
            },
            properties: {
                "break-inside": ["avoid-page", "avoid-column", "avoid"],
                "page-break-after": ["always", "avoid"],
                "page-break-before": ["always", "avoid"],
            },
        },
    },
    plugins: [],
};
