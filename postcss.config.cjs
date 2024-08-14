module.exports = {
  plugins: {
    "postcss-import": {},
    cssnano: {
      preset: "default",
    },
    tailwindcss: {
      config: "./tailwind.config.js",
    },
    autoprefixer: {},
  },
};
