import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {FlatCompat} from '@eslint/eslintrc'
import naverpay from '@naverpay/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

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
    ...pluginQuery.configs['flat/recommended'],
    {
        rules: {
            'unicorn/no-useless-undefined': 'off',
            'sonarjs/no-nested-conditional': 'off',
            'unicorn/no-nested-ternary': 'off',
        },
    },
]

export default eslintConfig
