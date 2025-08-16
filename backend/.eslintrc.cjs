module.exports = {
  // Specifies the ESLint parser for TypeScript
  parser: "@typescript-eslint/parser",

  // Specifies the plugins that provide the rules
  plugins: ["@typescript-eslint"],

  // Specifies the configuration files to extend from
  // The order is important!
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier", // Uses eslint-config-prettier to disable ESLint rules that would conflict with Prettier
  ],

  // Tells ESLint to stop looking in parent folders for more configs
  root: true,

  // Defines global variables that are predefined
  env: {
    node: true, // Enables Node.js global variables and Node.js scoping.
  },

  // Specifies the ECMAScript features you want to use
  parserOptions: {
    ecmaVersion: "latest", // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },

  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
};
