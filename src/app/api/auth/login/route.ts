import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

const URL = process.env.NEXT_PUBLIC_BACKEND_API

export async function POST(request: Request) {
    const {email, password} = await request.json()
    const cookie = await cookies()

    if (!email || !password) {
        return NextResponse.json({message: '이메일, 비밀번호을 입력해주세요.'}, {status: 400})
    }

    // 외부 로그인 API 요청
    const response = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
    })

    if (!response.ok) {
        return NextResponse.json({error: 'Login failed'}, {status: 401})
    }

    const data = await response.json()
    const accessToken = data.accessToken
    const refreshToken = data.refreshToken

    cookie.set({
        name: 'accessToken',
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24,
    })
    cookie.set({
        name: 'refreshToken',
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24,
    })

    return NextResponse.json({success: true})
}
