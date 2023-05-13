/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				dark: "#112D4E",
				light: "#F9F7F7",
				primary: "#4096FF",
				secondary: "#E0DEDE",
			},
			fontFamily: {
				source: "'Source Sans Pro', sans-serif",
			},
		},
	},
	safelist: [
		"alert-success",
		"alert-warn",
		"alert-danger",
		"btn-primary",
		"btn-secondary",
		"btn-success",
		"btn-warn",
		"btn-danger",
	],
	plugins: [],
};
