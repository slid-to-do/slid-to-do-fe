'use client'

import dynamic from 'next/dynamic'
import React from 'react'

import {useCustomQuery} from '@/hooks/use-custom-query'
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
    const {data: todoData} = useCustomQuery<TodoPage>(['newTodo'], async () => getGoalsData(), {
        select: (data: TodoPage): TodoPage => ({
            data: data.data
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .filter((item) => !item.done)
                .slice(0, 5),
        }),
    })
    const {data: progress} = useCustomQuery<{data: number}>(['allProgress'], async () => getProgressData(), {})

    return (
        <header className="w-full h-auto min-w-[200px]  lg:flex-row flex-col mb-4  flex justify-center items-start gap-4">
            <NewAddTodo data={todoData?.data} />
            <NoSsrProgress percent={typeof progress?.data === 'number' ? progress.data : 0} />
        </header>
    )
}

export default Header
