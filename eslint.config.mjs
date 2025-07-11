import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {FlatCompat} from '@eslint/eslintrc'
import naverpay from '@naverpay/eslint-config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    ...naverpay.configs.node,
    ...naverpay.configs.typescript,
    ...naverpay.configs.strict,
]

export default eslintConfig
