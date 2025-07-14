'use client'

import {post} from '@/lib/api'
import {useState} from 'react'

interface SignupRequest {
    name: string
    email: string
    password: string
}

export function useSignup() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const signup = async (data: SignupRequest) => {
        setLoading(true)
        setError(null)
        try {
            const res = await post({
                endpoint: 'user',
                data,
            })
            return res.data
        } catch (err: any) {
            setError(err.message || '회원가입 중 오류가 발생했습니다.')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {signup, loading, error}
}
