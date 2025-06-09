const rtl = require("tailwindcss-rtl");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [rtl], // ✅ שים לב: בלי סוגריים!
};
