'use client'

import type {NextPage} from 'next'
import React, {useState, useEffect, useRef} from 'react'
import {fakeFetch} from '../fakeFetch'
import {get} from '@/lib/api'

export interface listResponse {
    uid: number
    title: string
}

export interface Goal {
    id: number
    teamId: string
    userId: number
    title: string
    createdAt: string
    updatedAt: string
}

export interface GetGoalsResponse {
    goals: Goal[]
    totalCount: number
    nextCursor: number | null
}

const GoalsId: NextPage = () => {
    const [list, setList] = useState<Goal[]>([])
    const [cursor, setCursor] = useState<number>(0)
    const [nextCursor, setNextCursor] = useState<number | null>(0)
    const [loading, setLoading] = useState(false)

    const observerRef = useRef<HTMLDivElement | null>(null)

    const fetchInfiniteApi = async () => {
        if (loading || nextCursor === null) return
        setLoading(true)
        try {
            // const data = await fakeFetch(cursor, 10)
            const response = await get<GetGoalsResponse>({
                endpoint: '1060/goals?cursor=1&size=20&sortOrder=oldest',
                options: {
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY5LCJ0ZWFtSWQiOiIxMDYwIiwiaWF0IjoxNzUxODc5MDEzLCJleHAiOjE3NTE4ODI2MTMsImlzcyI6InNwLXNsaWR0b2RvIn0.OighxHpfeZQ0KORlEhRjEQxRzEY9B_5zNfC_XurrH6A`,
                    },
                },
            })
            const data = response.data
            console.log('data', data)

            setList((prev) => [
                ...prev,
                ...data.goals.map((item) => ({
                    id: item.id,
                    teamId: item.teamId,
                    userId: item.userId,
                    title: item.title,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                })),
            ])
            setCursor(data.nextCursor ?? 0)
            setNextCursor(data.nextCursor)
        } catch (e) {
            console.error('fetch error', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!observerRef.current || nextCursor === null) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchInfiniteApi()
                }
            },
            {
                threshold: 1.0,
            },
        )
        const el = observerRef.current
        observer.observe(el)

        return () => {
            if (el) observer.unobserve(el)
        }
    }, [observerRef.current, nextCursor])

    return (
        <div>
            <div>
                {list.map((v) => (
                    <div key={v.id}>
                        <span className="text-2xl font-bold">{v.id} </span>
                        {v.title}
                    </div>
                ))}
                {nextCursor !== null ? (
                    <div ref={observerRef} className="text-center py-4 text-gray-500">
                        Loading...
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-400">모든 데이터를 불러왔습니다</div>
                )}
            </div>
        </div>
    )
}

export default GoalsId
