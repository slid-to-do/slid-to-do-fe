'use client'

import {useSearchParams} from 'next/navigation'
import {useEffect} from 'react'
import {toast} from 'react-toastify'

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const toastMessage = searchParams.get('toast')

    useEffect(() => {
        if (toastMessage) {
            toast.error(decodeURIComponent(toastMessage))
        }
    }, [toastMessage])

    return <h1>🚨 에러가 발생했습니다</h1>
}
