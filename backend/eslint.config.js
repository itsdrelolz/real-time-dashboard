import globals from "globals";
import tseslint from "typescript-eslint";
import pluginPrettier from "eslint-config-prettier";

export default [
  {
    // Ignore build output, node_modules, and all .d.ts files
    ignores: ["dist/", "node_modules/", "**/*.d.ts"], 
  },
  ...tseslint.configs.recommended, // Use recommended rules from typescript-eslint
  pluginPrettier, // Disable ESLint rules that conflict with Prettier
  {
    languageOptions: {
      globals: {
        ...globals.node, // Enable Node.js global variables
      },
    },
  },
];

