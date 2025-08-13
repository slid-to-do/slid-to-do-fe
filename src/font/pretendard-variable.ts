import localFont from 'next/font/local'

export const pretendard = localFont({
    src: [
        {
            path: './PretendardVariable.woff2',
            weight: '100 900',
            style: 'normal',
        },
    ],
    variable: '--font-pretendard',
    display: 'swap',
})
