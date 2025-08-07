import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

export const POST = async () => {
    const cookie = await cookies()
    cookie.delete('accessToken')
    cookie.delete('refreshToken')

    return NextResponse.json({success: true})
}
