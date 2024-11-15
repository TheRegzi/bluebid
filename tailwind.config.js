/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#BCDEF2',
        secondary: '#D8EBEB',
        accent: '#4C5A62',
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
      screens: {
        sm: '640px',
        md: '754px',
        lg: '1024px',
        xl: '1280px',
      },
      width: {
        350: '350px',
        550: '550px',
        700: '700px',
      },
    },
  },
  plugins: [],
};
