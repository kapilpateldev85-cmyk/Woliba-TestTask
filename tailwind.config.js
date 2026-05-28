/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        woliba: {
          navy: "#16465c",
          coral: "#df6874",
          soft: "#f8eef0",
        },
      },
      boxShadow: {
        form: "0 18px 45px rgba(22, 70, 92, 0.12)",
      },
    },
  },
  plugins: [],
}
