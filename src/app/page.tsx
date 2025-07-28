'use client'

import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
            router.push('/dashboard')
        } else {
            router.push('/login')
        }
    }, [])
    return <></>
}
