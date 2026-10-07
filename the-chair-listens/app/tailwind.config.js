module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    950: "#081128",
                    900: "#0A1735",
                    800: "#0F1E4A",
                    700: "#14265C",
                },
                gold: {
                    DEFAULT: "#B99B5B",
                    light: "#D9C489",
                },
                slate: {
                    custom: "#AEB8D6",
                    muted: "#7E88AC",
                    light: "#F5F6FA",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};