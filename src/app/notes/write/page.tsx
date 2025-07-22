'use client'

import {useSearchParams} from 'next/navigation'
import {useEffect} from 'react'

import {useQuery} from '@tanstack/react-query'

import NoteEditCompo from '@/components/notes/edit'
import NoteWriteCompo from '@/components/notes/write'
import {get} from '@/lib/api'

import type {Goal} from '@/types/goals'
import type {Todo} from '@/types/todos'

const NoteWritePage = () => {
    const searchParameters = useSearchParams()
    const goalId = searchParameters.get('goalId')
    const todoId = searchParameters.get('todoId')
    const noteId = searchParameters.get('noteId')

    const isEdit = typeof noteId === 'string'

    useEffect(() => {
        if (todoId === undefined || goalId === undefined) {
            alert('확인 할 데이터가 없습니다.') // 에러페이지로 이동
        }
    }, [todoId, goalId])

    const {data: goalsData} = useQuery<Goal>({
        queryKey: ['goals', goalId],
        queryFn: async () => {
            const response = await get<Goal>({
                endpoint: `goals/${goalId}`,
                options: {
                    headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                },
            })

            return response.data
        },
    })

    const {data: todosData} = useQuery<Todo>({
        queryKey: ['todos', todoId],
        queryFn: async () => {
            const response = await get<Todo>({
                endpoint: `todos/${todoId}`,
                options: {
                    headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                },
            })

            return response.data
        },
    })

    return (
        <div className="flex flex-col w-full min-h-screen p-6 desktop:px-20">
            <div className="mt-6">
                {isEdit ? (
                    <NoteEditCompo noteId={noteId!} goalTitle={goalsData?.title} todoTitle={todosData?.title} />
                ) : (
                    /**작성하기 */
                    <NoteWriteCompo
                        goalId={String(goalId)}
                        todoId={String(todoId)}
                        goalTitle={goalsData?.title}
                        todoTitle={todosData?.title}
                    />
                )}
            </div>
        </div>
    )
}

export default NoteWritePage
