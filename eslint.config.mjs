import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import naverpay from "@naverpay/eslint-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...naverpay.configs.node,
  ...naverpay.configs.typescript,
  ...naverpay.configs.strict,
  ...naverpay.configs.packageJson,
];

export default eslintConfig;
