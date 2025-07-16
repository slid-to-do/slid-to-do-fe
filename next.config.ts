import type {NextConfig} from 'next'
import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
}

export default nextConfig
