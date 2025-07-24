'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import {useQuery} from '@tanstack/react-query'

import {get} from '@/lib/api'

import NewAddTodo from './new-addtodo'

import type {TodoResponse} from '@/types/todos'

const NoSsrProgress = dynamic(() => import('./progress'), {ssr: false})

interface TodoPage {
    data: TodoResponse[]
    nextCursor?: number
}

const getProgressData = async () => {
    try {
        const response = await get<{progress: number}>({
            endpoint: `todos/progress`,

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
            endpoint: `todos`,
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
        queryKey: ['newTodo'],
        queryFn: getGoalsData,
        select: (data: TodoPage): TodoPage => ({
            data: data.data
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .filter((item) => !item.done)
                .slice(0, 5),
        }),
    })
    const {data: progress} = useQuery({
        queryKey: ['allProgress'],
        queryFn: getProgressData,
    })

    return (

        <header className="w-full h-auto min-w-[200px]  lg:flex-row flex-col mb-4  flex justify-center items-start gap-4">

            <NewAddTodo data={todoData?.data} />
            <NoSsrProgress percent={typeof progress?.data === 'number' ? progress.data : 0} />
        </header>
    )
}

export default Header
