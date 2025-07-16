import React from 'react'

export const metadata = {
    title: 'Sign Up',
}

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return <main>{children}</main>
}

export default layout
