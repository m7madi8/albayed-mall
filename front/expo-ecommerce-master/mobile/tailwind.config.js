const { palette } = require("./theme/palette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: palette.primary,
          light: palette.primary,
          dark: palette.primaryDark,
        },
        ink: palette.ink,
        ivory: palette.onPrimary,
        lime: palette.lime,
        accent: {
          DEFAULT: palette.discount,
          red: palette.discount,
          yellow: palette.lime,
        },
        line: palette.line,
        background: {
          DEFAULT: palette.background,
          light: palette.line,
          lighter: palette.line,
        },
        surface: {
          DEFAULT: palette.surface,
          light: palette.background,
        },
        text: {
          primary: palette.ink,
          secondary: palette.slate,
          tertiary: palette.slate,
        },
      },
      fontFamily: {
        sans: ["Cairo"],
      },
    },
  },
  plugins: [],
};
