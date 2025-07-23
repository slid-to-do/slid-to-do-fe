import React from 'react'

import Sidebar from '@/components/navigation/sidebar-container'

export const metadata = {
    title: 'Notes',
}

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <main className="flex w-full h-full mobile:flex-col">
            <Sidebar />
            {children}
        </main>
    )
}

export default layout
