module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  plugins: ["react", "react-refresh", "simple-import-sort", "prettier", "import", "vitest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "plugin:vitest/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  rules: {
    /**
     * React no longer needs to be in scope
     */
    "react/react-in-jsx-scope": "off",
    "simple-import-sort/imports": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        fixStyle: "inline-type-imports",
      },
    ],
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: ["variable", "parameter"],
        modifiers: ["destructured"],
        format: null,
      },
      {
        selector: "variable",
        modifiers: ["const"],
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
      },
      {
        selector: "enum",
        format: ["PascalCase"],
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: ["enumMember"],
        format: ["UPPER_CASE"],
        leadingUnderscore: "allow",
      },
      {
        selector: ["typeProperty"],
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
      },
      {
        selector: ["class", "interface", "typeAlias", "typeParameter"],
        format: ["PascalCase"],
      },
      {
        selector: "objectLiteralProperty",
        format: null,
      },
      {
        selector: ["variable", "parameter"],
        modifiers: ["unused"],
        leadingUnderscore: "allow",
        format: null,
      },
    ],
    eqeqeq: ["error", "always"],
  },
};
