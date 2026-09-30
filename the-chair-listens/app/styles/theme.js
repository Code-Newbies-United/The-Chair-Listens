// Styles/themes.js
// Shared colour tokens for The Chair Listens.
// Change a value here once, and every page that references it updates.


export const theme = {
    background: {
        //used as a radial-gradient in each page's 'styles.page' background.
        //e.g 'radial-gradient(120% 60% at 50% 0%, ${theme.background.gradientStart} 0%, ...)'
        gradientStart: "#2D5046",
        gradientMid1: "#22403A",
        gradientMid2: "#172E2A",
        gradientEnd: "#0F1F1C",
    },

    accent: {
        gold: "#B99B5B", //main CTAs/buttons
        goldLight: "#D9C489", //links, kicker, badges
        lime: "#8DCF94", //tags, highlights, location dots
        goldBorder: "rgba(185, 155, 91, 0.3)", // soft gold bolrder for highlight moments (thank-you card, icon ring)
    },

    status: {
        //A colour used to show something is "live" or currently active -
        //e.g. the pulsing dot next to the admin dashboard's active location.
        //
        //This is a different *purpose* than accent.lime (our brand colour),
        //even though both happen to be green. Keeping them as seperate
        //tokens means we can change one without accidentally changing the other.
        //
        //Value matches accent.lime for now, but thats a coincidence, not a rule- 
        //status coulours can change doesnt have to always be green.
        live: "#8DCF94"
    },

    text: {
        primary: "#F5F6FA", //headings
        secondary: "#AEB8D6", //body copy
    },

    surface: {
        card: "rgba(255, 255, 255, 0.07)", //card/panel backgrounds
    },

    border: {
        subtle: "rgba(141, 207, 148, 0.25)", //card & input borders
    },
}