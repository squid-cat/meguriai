/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f0fdf4",
					100: "#dcfce7",
					200: "#bbf7d0",
					300: "#86efac",
					400: "#4ade80",
					500: "#22c55e",
					600: "#16a34a",
					700: "#15803d",
					800: "#166534",
					900: "#14532d",
				},
			},
			animation: {
				watering: "watering 2s ease-in-out",
				"timer-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
			keyframes: {
				watering: {
					"0%": { transform: "scale(1) rotate(0deg)" },
					"50%": { transform: "scale(1.1) rotate(-5deg)" },
					"100%": { transform: "scale(1) rotate(0deg)" },
				},
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
