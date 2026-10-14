/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "0" },
      screens: { xl: "1140px" },
    },
    extend: {
      // Colours sampled from the design image: forest green, honey yellow, warm cream.
      colors: {
        ink: "#141714",
        cream: "#FAF7F0",
        mint: "#E3EEDF",
        muted: "#5E645F",
        line: "#ECE5D6",
        forest: { DEFAULT: "#0A4D36", deep: "#063F2E", soft: "#CFE3D6" },
        honey: { DEFAULT: "#F7AA2A", deep: "#E39614", soft: "#FDEBC6", ink: "#B5781B" },
        // Menu card backgrounds
        tile: { green: "#2D784A", yellow: "#F4B027", sky: "#77CDDE", pink: "#F98A99" },
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "none" } },
        slideIn: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
        slideInLeft: { from: { transform: "translateX(-100%)" }, to: { transform: "none" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        fadeUp: "fadeUp .5s ease-out both",
        slideIn: "slideIn .35s cubic-bezier(.2,1,.3,1) both",
        slideInLeft: "slideInLeft .35s cubic-bezier(.2,1,.3,1) both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
