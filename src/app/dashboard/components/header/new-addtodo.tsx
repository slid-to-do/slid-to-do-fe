'use client'

import Image from 'next/image'
import React from 'react'

import {useMutation, useQueryClient} from '@tanstack/react-query'

import TodoItem from '@/components/common/todo-item'
import {patch} from '@/lib/api'

import type {TodoResponse} from '@/types/todos'

const NewAddTodo = ({data}: {data: TodoResponse[] | undefined}) => {
    const queryClient = useQueryClient()
    const updateTodo = useMutation({
        mutationFn: async ({todoId, newDone}: {todoId: number; newDone: boolean}) => {
            const response = await patch<TodoResponse>({
                endpoint: `1060/todos/${todoId}`,
                data: {done: newDone},
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })

            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']})
        },
    })

    return (
        <article className=" w-full h-auto p-3 min-w-65">
            <header className="flex justify-between items-center mb-4">
                <div className="flex justify-center items-center gap-2">
                    <Image src={'./dashboard/todo-recently.svg'} alt="최근 등록한 할일" width={40} height={40} />
                    <span className="text-title-base font-semibold">최근 등록한 할 일</span>
                </div>
                <button className="text-subBody-sm font-medium flex items-center">
                    모두보기
                    <Image src="/goals/ic_arrow_right.svg" alt="노트보기 페이지 이동" width={24} height={24} />
                </button>
            </header>
            <ul className=" list-none">
                {data?.map((item) => (
                    <TodoItem
                        key={item.id}
                        todoDetail={item}
                        onToggle={(todoId: number, newDone: boolean) => updateTodo.mutate({todoId, newDone})}
                    />
                ))}
            </ul>
        </article>
    )
}

export default NewAddTodo
