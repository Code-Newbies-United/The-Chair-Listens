
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: {
                    DEFAULT: "#2D5046",
                    dark: "#203F36",
                    deep: "#19362F",
                },
                mint: {
                    DEFAULT: "#8DCF94",
                    bright: "#A5DFA9",
                },
                cream: {
                    DEFAULT: "#F5F2E8",
                    white: "#FBFAF5",
                },
                powder: {
                    blue: "#D4E9ED",
                },
                sage: {
                    DEFAULT: "#526B61",
                    muted: "#52645E",
                },
                ochre: {
                    DEFAULT: "#BC9553",
                    light: "#D9C489",
                },
            },

            fontFamily: {
                sans: [
                    "var(--font-sans)",
                    "'IBM Plex Sans'",
                    "system-ui",
                    "sans-serif",
                ],
                script: ["'Pinyon Script'", "cursive"],
                serif: ["'IBM Plex Serif'", "Georgia", "serif"],
            },

            borderRadius: {
                card: "27px",
                pill: "999px",
            },

            boxShadow: {
                card: "0 20px 50px rgba(17, 45, 37, 0.18)",
                soft: "0 12px 30px rgba(17, 45, 37, 0.06)",
                mint: "0 10px 22px rgba(45, 80, 70, 0.12)",
            },

            backgroundImage: {
                "forest-glow":
                    "radial-gradient(circle at 100% 0%, rgba(141,207,148,.2), transparent 28%), radial-gradient(circle at 0% 90%, rgba(212,233,237,.1), transparent 25%)",
            },
        },
    },
    plugins: [],
};
