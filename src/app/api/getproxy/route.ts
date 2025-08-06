import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

export async function GET(request: Request) {
    const cookieStore = await cookies()

    const accessToken = cookieStore.get('accessToken')?.value
    const {searchParams} = new URL(request.url)
    const endpoint = searchParams.get('endpoint') as string

    if (!accessToken) {
        return NextResponse.json({message: '로그인이 만료 되었습니다.'}, {status: 401})
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/${decodeURIComponent(endpoint)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        })
        const data = await response.json()

        return NextResponse.json(data, {status: response.status})
    } catch (error) {
        if (error instanceof Error) {
            const status = (error as Error & {status?: number}).status || 500

            return NextResponse.json({message: 'Proxy Error', error: String(error)}, {status})
        }
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const {searchParams} = new URL(request.url)
    const endpoint = searchParams.get('endpoint') as string
    const body = await request.json()

    if (!accessToken) {
        return NextResponse.json({message: '로그인이 만료 되었습니다.'}, {status: 401})
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/${decodeURIComponent(endpoint)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        })
        const data = await response.json()

        return NextResponse.json(data, {status: response.status})
    } catch (error) {
        if (error instanceof Error) {
            const status = (error as Error & {status?: number}).status || 500

            return NextResponse.json({message: 'Proxy Error', error: String(error)}, {status})
        }
    }
}

export async function PATCH(request: Request) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const {searchParams} = new URL(request.url)
    const endpoint = searchParams.get('endpoint') as string
    const body = await request.json()

    if (!accessToken) {
        return NextResponse.json({message: '로그인이 만료 되었습니다.'}, {status: 401})
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/${decodeURIComponent(endpoint)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        })
        const data = await response.json()

        return NextResponse.json(data, {status: response.status})
    } catch (error) {
        if (error instanceof Error) {
            const status = (error as Error & {status?: number}).status || 500

            return NextResponse.json({message: 'Proxy Error', error: String(error)}, {status})
        }
    }
}

export async function DELETE(request: Request) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const {searchParams} = new URL(request.url)
    const endpoint = searchParams.get('endpoint') as string

    if (!accessToken) {
        return NextResponse.json({message: '로그인이 만료 되었습니다.'}, {status: 401})
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/${decodeURIComponent(endpoint)}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return NextResponse.json({status: response.status})
    } catch (error) {
        if (error instanceof Error) {
            const status = (error as Error & {status?: number}).status || 500

            return NextResponse.json({message: 'Proxy Error', error: String(error)}, {status})
        }
    }
}
