/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                dark: "#151D3B",
                light: "#ECECEC",
                primary: "#533E85",
                secondary: "#B1A8B3",
            },
            fontFamily: {
                oswald: "'Oswald', sans-serif",
            },
        },
    },
    safelist: ["alert-success", "alert-warn", "alert-danger"],
    plugins: [],
};
