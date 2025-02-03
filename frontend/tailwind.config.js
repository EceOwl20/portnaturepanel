/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit", // Just-In-Time modunu aç, kullanılmayan CSS'leri otomatik temizler
  content: ["./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      screens: {
        'lgxl-custom': { 'min': '1200px' }, 
        'mdlg-custom': { 'min': '840px' }, 
      },

      colors: {
        customGray: '#233038',
        customGray80:'#233038cc'
      },
      textShadow: {
        'custom': '0px 6px 7px rgba(0, 0, 0, 0.25)',
      },
      inset: {
        'fullreverse': '-100%', // left: -100% için özel sınıf
      },
      minHeight: {
        'content': 'fit-content',
      },
      fontFamily: {
        monserrat: ['Montserrat', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, rgba(161, 161, 161, 0.00) 0%, rgba(217, 217, 217, 0.00) 6.25%, rgba(217, 217, 217, 0.00) 12.5%, rgba(217, 217, 217, 0.01) 18.75%, rgba(217, 217, 217, 0.03) 25%, rgba(216, 216, 216, 0.08) 31.25%, rgba(215, 215, 215, 0.16) 37.5%, rgba(214, 214, 214, 0.29) 43.75%, rgba(212, 212, 212, 0.50) 50%, rgba(210, 210, 210, 0.71) 56.25%, rgba(209, 209, 209, 0.84) 62.5%, rgba(208, 208, 208, 0.92) 68.75%, rgba(207, 207, 207, 0.97) 75%, rgba(207, 207, 207, 0.99) 81.25%, rgba(207, 207, 207, 1.00) 87.5%, rgba(207, 207, 207, 1.00) 93.75%, #CFCFCF 100%)',
        'custom-gradient-reverse': 'linear-gradient(-90deg, rgba(161, 161, 161, 0.00) 0%, rgba(217, 217, 217, 0.00) 6.25%, rgba(217, 217, 217, 0.00) 12.5%, rgba(217, 217, 217, 0.01) 18.75%, rgba(217, 217, 217, 0.03) 25%, rgba(216, 216, 216, 0.08) 31.25%, rgba(215, 215, 215, 0.16) 37.5%, rgba(214, 214, 214, 0.29) 43.75%, rgba(212, 212, 212, 0.50) 50%, rgba(210, 210, 210, 0.71) 56.25%, rgba(209, 209, 209, 0.84) 62.5%, rgba(208, 208, 208, 0.92) 68.75%, rgba(207, 207, 207, 0.97) 75%, rgba(207, 207, 207, 0.99) 81.25%, rgba(207, 207, 207, 1.00) 87.5%, rgba(207, 207, 207, 1.00) 93.75%, #CFCFCF 100%)',
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },

        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(30deg)' },
        },
        zoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }, // Yarım santim büyüme
        },
      
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(1.4)', opacity: 0 },
        },
      },
      animation: {
        frontImage: 'frontImage 3s ease-in-out',
        backImage: 'backImage 3s ease-in-out',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        zoom: 'zoom 1.5s ease-in-out infinite',
        pulseRing: 'pulseRing 1.5s ease-in-out infinite',
        marquee: "marquee 50s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".clip-slope-ltr": {
          clipPath: "polygon(0% 10px, 100% 35px, 100% 100%, 0% 100%)",
        },
      };
      addUtilities(newUtilities);
    },
    require('tailwindcss-textshadow'),
  ],
}


