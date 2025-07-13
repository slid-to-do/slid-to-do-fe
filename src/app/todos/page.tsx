'use client'

import {useState} from 'react'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import AddTodoModal from '@/components/common/modal/add-todo-modal'
import {useModal} from '@/hooks/use-modal'
import {del, get, patch} from '@/lib/api'

import Filter from './filter'
import TodoItem from '../../components/common/todo-item'

type FilterValue = 'ALL' | 'TODO' | 'DONE'

interface TodoListDetail {
    totalCount: number
    nextCursor: number | null
    todos: {
        noteId: number
        done: boolean
        linkUrl: string
        fileUrl: string
        title: string
        id: number
        goal: {
            id: number
            title: string
        }
        userId: number
        teamId: string
        updatedAt: string
        createdAt: string
    }[]
}

const Page = () => {
    const queryClient = useQueryClient()

    const [selectedFilter, setSelectedFilter] = useState<FilterValue>('ALL')

    const {data, isLoading, isError, error} = useQuery<TodoListDetail>({
        queryKey: ['todos', selectedFilter],
        queryFn: async () => {
            const parameter = new URLSearchParams()

            if (selectedFilter === 'TODO') parameter.append('done', 'false')
            else if (selectedFilter === 'DONE') parameter.append('done', 'true')

            const response = await get<TodoListDetail>({
                endpoint: `todos?${parameter.toString()}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            })

            return response.data
        },
    })

    const updateTodo = useMutation({
        mutationFn: async ({todoId, newDone}: {todoId: number; newDone: boolean}) => {
            const response = await patch<TodoListDetail>({
                endpoint: `todos/${todoId}`,
                data: {done: newDone},
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            })

            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']})
        },
    })

    const deleteTodo = useMutation({
        mutationFn: async (todoId: number) => {
            const response = await del({
                endpoint: `todos/${todoId}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            })

            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']})
        },
    })

    const {openModal} = useModal(<AddTodoModal />)

    const handleFilterChange = (value: string) => {
        setSelectedFilter(value as FilterValue)
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center w-full h-full text-sm text-red-500">
                {error instanceof Error ? error.message : '할 일을 불러오는 중 오류가 발생했습니다.'}
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">모든 할 일 ({data?.totalCount})</h1>
                <button className="text-sm font-semibold text-custom_blue-500" onClick={openModal}>
                    + 할 일 추가
                </button>
            </div>

            <div className="h-full p-6 mt-4 bg-white rounded-xl">
                {/* 할 일 목록 필터링 */}
                <div className="flex gap-2">
                    <Filter
                        checked={selectedFilter === 'ALL'}
                        onChange={handleFilterChange}
                        value="ALL"
                        name="todoFilter"
                    >
                        All
                    </Filter>
                    <Filter
                        checked={selectedFilter === 'TODO'}
                        onChange={handleFilterChange}
                        value="TODO"
                        name="todoFilter"
                    >
                        To do
                    </Filter>
                    <Filter
                        checked={selectedFilter === 'DONE'}
                        onChange={handleFilterChange}
                        value="DONE"
                        name="todoFilter"
                    >
                        Done
                    </Filter>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-full text-sm text-custom_slate-400">
                        로딩 중...
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-2 mt-4">
                            {data?.todos?.length === 0 && selectedFilter === 'ALL' && (
                                <div className="flex items-center justify-center w-full h-full text-sm text-custom_slate-400">
                                    등록한 일이 없어요
                                </div>
                            )}

                            {data?.todos?.length === 0 && selectedFilter === 'TODO' && (
                                <div className="flex items-center justify-center w-full h-full text-sm text-custom_slate-400">
                                    해야할 일이 아직 없어요
                                </div>
                            )}

                            {data?.todos?.length === 0 && selectedFilter === 'DONE' && (
                                <div className="flex items-center justify-center w-full h-full text-sm text-custom_slate-400">
                                    다 한 일이 아직 없어요
                                </div>
                            )}

                            {data?.todos?.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    todoDetail={todo}
                                    onToggle={(todoId: number, newDone: boolean) =>
                                        updateTodo.mutate({todoId, newDone})
                                    }
                                    onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Page
