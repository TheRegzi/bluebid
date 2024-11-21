/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#D0F2FF',
        secondary: '#D8EBEB',
        accent: '#4C5A62',
        accent2: '#9CB8C8',
        customRed: '#A83131',
      },
      fontFamily: {
        headingLg: ['Raleway', 'Verdana', 'Arial', 'sans-serif'],
        headingMd: ['Inter', 'Verdana', 'Arial', 'sans-serif'],
        body: ['Source Sans 3', 'Verdana', 'Arial', 'sans-serif'],
        accentFont: ['Poppins', 'Verdana', 'Arial', 'sans-serif'],
      },
      fontSize: {
        xs: '0.7rem',
        sm: '1rem',
        md: '1.2rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      textShadow: {
        sm: '0 1px 2px rgba(107, 114, 128, 0.5)',
        DEFAULT: '0 2px 4px rgba(107, 114, 128, 0.5)',
        lg: '0 4px 8px rgba(107, 114, 128, 0.5)',
        xl: '0 6px 12px rgba(107, 114, 128, 0.6)',
      },
      screens: {
        sm: '640px',
        md: '754px',
        lg: '1100px',
        xl: '1280px',
      },
      width: {
        350: '350px',
        550: '550px',
        700: '700px',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }),
  ],
};
