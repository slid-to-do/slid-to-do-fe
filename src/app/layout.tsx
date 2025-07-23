import {Geist, Geist_Mono} from 'next/font/google'

import ModalProvider from './providers/modal-provider'
import QueryProvider from './providers/query-provider'

import 'react-toastify/dist/ReactToastify.css'

import type {Metadata} from 'next'

import './globals.css'
import ToastProvider from './providers/toast-provider'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: {
        template: '%s | Slid-to-do',
        default: 'Slid-to-do',
    },
    description: 'Slid-to-do',
    icons: {
        icon: '/ic_favicon.svg',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <QueryProvider>
                    {children}
                    <ModalProvider />
                    <ToastProvider />
                </QueryProvider>
            </body>
        </html>
    )
}
