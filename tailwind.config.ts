import plugin from 'tailwindcss/plugin'

import type {Config} from 'tailwindcss'

const config: Config = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                sidebarOpen: {
                    '0%': {width: '50px', height: '100vh'},
                    '100%': {width: '256px', height: '100vh'},
                },
                sidebarClose: {
                    '0%': {width: '256px', height: '100vh'},
                    '100%': {width: '50px', height: '100vh'},
                },
                opacityOpen: {
                    '0%': {opacity: '0'},
                    '100%': {opacity: '1'},
                },
                opacityClose: {
                    '0%': {opacity: '1'},
                    '50%': {opacity: '0.5'},
                    '100%': {opacity: '0'},
                },
                mobileOpen: {
                    '0%': {height: '40px'},
                    '100%': {height: '100vh'},
                },
                mobileClose: {
                    '0%': {height: '100vh'},
                    '100%': {height: '40px'},
                },
            },
            animation: {
                opacityOpen: 'opacityOpen 0.3s ease-in-out forwards',
                opacityClose: 'opacityClose 0.3s ease-in-out forwards',
                sidebarOpen: 'sidebarOpen 0.3s ease-in-out forwards',
                sidebarClose: 'sidebarClose 0.3s ease-in-out forwards',
                mobileOpen: 'mobileOpen 0.3s ease-in-out forwards',
                mobileClose: 'mobileClose 0.3s ease-in-out forwards',
            },

            screens: {
                mobile: {max: '374px'},
                tablet: {min: '374px', max: '774px'},
                desktop: {min: '774px'},
            },

            colors: {
                custom_blue: {
                    DEFAULT: '#3B82F6',
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                    950: '#172554',
                },
                custom_slate: {
                    DEFAULT: '#64748B',
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#020617',
                },
            },
        },
    },
    plugins: [
        plugin(({matchUtilities, theme}) => {
            // 클래스별 기본 사이즈 지정
            const defaults = {
                'text-subBody': {size: '12px', weight: 'light'},
                'text-body': {size: '16px', weight: 'normal'},
                'text-subTitle': {size: '18px', weight: 'semibold'},
                'text-title': {size: '24px', weight: 'extrabold'},
            }
            // 공통 사이즈 맵
            const sizes = {
                xs: '12px',
                sm: '14px',
                base: '16px',
                lg: '18px',
                xl: '20px',
                xxl: '24px',
                xxxl: '30px',
            }

            for (const [className, {size, weight}] of Object.entries(defaults)) {
                matchUtilities(
                    {
                        [className]: (value) => ({
                            fontSize: value,
                            fontWeight: theme(`fontWeight.${weight}`),
                        }),
                    },
                    {
                        values: {
                            DEFAULT: size,
                            ...sizes,
                        },
                        type: 'length',
                    },
                )
            }
        }),
        plugin(({addComponents, theme}) => {
            addComponents({
                '.desktop-layout': {
                    padding: theme('spacing.6'),
                    [`@media (min-width: 774px)`]: {
                        maxWidth: '1200px',
                        paddingLeft: `${theme('spacing.20')}!important`,
                        paddingRight: `${theme('spacing.20')}!important`,
                    },
                },
            })
        }),
    ],
}

export default config
