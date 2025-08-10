import globals from "globals";
import tseslint from "typescript-eslint";
import pluginPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/"], // Ignore the build output directory
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

