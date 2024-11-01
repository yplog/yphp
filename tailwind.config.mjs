const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'dark-bg': '#181a1b',
				'h1-text': '#d4d4d6',
				'h2-text': '#aaaaaa',
				'content-text': '',
			},
			fontFamily: {
				'sans': ['"Roboto"', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
}
