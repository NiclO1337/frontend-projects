import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      eqeqeq: "error", // always === and !==, never == and !=
      "no-console": "warn", // no leftover console.log in shipped code
      "prefer-const": "error", // use const when a variable is never reassigned
      "no-var": "error", // let and const only
    },
  },
  {
    // Tell ESLint that describe/it/expect/vi are globals in test files.
    files: ["**/*.test.{js,jsx}", "src/test/**/*.{js,jsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.vitest } },
  },
  // Must come last: turns off ESLint rules that clash with Prettier's formatting.
  eslintConfigPrettier,
]);
