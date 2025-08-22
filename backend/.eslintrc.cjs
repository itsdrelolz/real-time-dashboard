module.exports = {
  parser: "@typescript-eslint/parser",

  plugins: ["@typescript-eslint"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],

  root: true,

  env: {
    node: true,
  },

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" },
    ],
  },
};

