'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import {useQuery} from '@tanstack/react-query'

import {get} from '@/lib/api'

import NewAddTodo from './new-addtodo'

import type {TodoResponse} from '@/types/todos'

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID
const NoSsrProgress = dynamic(() => import('./progress'), {ssr: false})

interface TodoPage {
    data: TodoResponse[]
    nextCursor?: number
}

const getProgressData = async () => {
    try {
        const response = await get<{progress: number}>({
            endpoint: `${TEAM_ID}/todos/progress`,
            options: {
                headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
            },
        })

        return {
            data: response.data.progress,
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error
        }
        throw new Error(String(error))
    }
}

const getGoalsData = async () => {
    try {
        const response = await get<{todos: TodoResponse[]}>({
            endpoint: `${TEAM_ID}/todos`,
            options: {
                headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
            },
        })

        return {
            data: response.data.todos,
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error
        }
        throw new Error(String(error))
    }
}

const Header = () => {
    const {data: todoData} = useQuery<TodoPage>({
        queryKey: ['todo'],
        queryFn: getGoalsData,
        select: (data: TodoPage): TodoPage => ({
            data: data.data
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5),
        }),
    })
    const {data: progress} = useQuery({
        queryKey: ['progress'],
        queryFn: getProgressData,
    })

    return (
        <header className="w-full desktop:flex-row flex-col h-auto flex justify-center items-center gap-4">
            <NewAddTodo data={todoData?.data} />
            <NoSsrProgress percent={typeof progress?.data === 'number' ? progress.data : 0} />
        </header>
    )
}

export default Header
