module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:nuxt/recommended",
    "prettier",
  ],
  plugins: ["vue", "nuxt"],
  rules: {
    "vue/multi-word-component-names": "off",
    "no-console": "warn",
    "no-debugger": "warn",
  },
};
