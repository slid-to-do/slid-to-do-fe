'use client'

import {useState} from 'react'

import {useQueryClient} from '@tanstack/react-query'
import axios from 'axios'

import AddTodoModal from '@/components/common/modal/add-todo-modal'
import EditTodoModal from '@/components/common/modal/edit-todo-modal'
import {useCustomMutation} from '@/hooks/use-custom-mutation'
import {useCustomQuery} from '@/hooks/use-custom-query'
import {useModal} from '@/hooks/use-modal'
import {del, get, patch} from '@/lib/common-api'

import Filter from './components/filter'
import TodoItem from '../../components/common/todo-item'

import type {TodoListDetailResponse, TodoResponse} from '@/types/todos'

type FilterValue = 'ALL' | 'TODO' | 'DONE'

const Page = () => {
    const queryClient = useQueryClient()

    const [selectedFilter, setSelectedFilter] = useState<FilterValue>('ALL')

    const {data, isLoading} = useCustomQuery<TodoListDetailResponse>(
        ['todos', selectedFilter],
        async () => {
            const parameter = new URLSearchParams()

            if (selectedFilter === 'TODO') parameter.append('done', 'false')
            else if (selectedFilter === 'DONE') parameter.append('done', 'true')

            const response = await get<TodoListDetailResponse>({
                endpoint: `todos?${parameter.toString()}`,
            })

            return response.data
        },
        {
            errorDisplayType: 'toast',
            mapErrorMessage: (error) => {
                const typedError = error as {message?: string; response?: {data?: {message?: string}}}
                if (axios.isAxiosError(error)) {
                    return error.response?.data.message || '서버 오류가 발생했습니다.'
                }
                return typedError.message || '할 일을 불러오는 중 오류가 발생했습니다.'
            },
        },
    )

    const {mutate: updateTodo} = useCustomMutation(
        async ({todoId, newDone}: {todoId: number; newDone: boolean}) => {
            const response = await patch<TodoListDetailResponse>({
                endpoint: `todos/${todoId}`,
                data: {done: newDone},
            })

            return response.data
        },
        {
            errorDisplayType: 'toast',
            mapErrorMessage: (error) => {
                const typedError = error as {message?: string; response?: {data?: {message?: string}}}

                if (axios.isAxiosError(error)) {
                    return error.response?.data.message || '서버 오류가 발생했습니다.'
                }

                return typedError.message || '할일 수정 중 오류가 발생했습니다.'
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['todos']})
            },
        },
    )

    const {mutate: deleteTodo} = useCustomMutation(
        async (todoId: number) => {
            if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return

            await del({
                endpoint: `todos/${todoId}`,
            })
        },
        {
            errorDisplayType: 'toast',
            mapErrorMessage: (error) => {
                const typedError = error as {message?: string; response?: {data?: {message?: string}}}

                if (axios.isAxiosError(error)) {
                    return error.response?.data.message || '서버 오류가 발생했습니다.'
                }

                return typedError.message || '할일 수정 중 오류가 발생했습니다.'
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['todos']})
            },
        },
    )

    const {openModal: openAddTodoModal} = useModal(<AddTodoModal />)
    const {openModal: openEditTodoModal} = useModal((todoDetail: TodoResponse) => (
        <EditTodoModal todoDetail={todoDetail} />
    ))

    const handleFilterChange = (value: string) => {
        setSelectedFilter(value as FilterValue)
    }

    return (
        <div className="flex flex-col w-full bg-slate-100 ">
            <div className="desktop-layout flex flex-col min-h-screen">
                <div className="flex items-center justify-between ">
                    <h1 className="text-lg font-semibold">모든 할 일 ({data?.totalCount})</h1>
                    <button className="text-sm font-semibold text-custom_blue-500" onClick={openAddTodoModal}>
                        + 할 일 추가
                    </button>
                </div>

                <div className="flex flex-col flex-1 p-6 mt-4 bg-white rounded-xl min-h-0">
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
                        <div className="flex items-center justify-center flex-1 text-sm text-custom_slate-400">
                            로딩 중...
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1 min-h-0">
                                {data?.todos?.length === 0 && selectedFilter === 'ALL' && (
                                    <div className="flex items-center justify-center flex-1 text-sm text-custom_slate-400">
                                        등록한 일이 없어요
                                    </div>
                                )}

                                {data?.todos?.length === 0 && selectedFilter === 'TODO' && (
                                    <div className="flex items-center justify-center flex-1 text-sm text-custom_slate-400">
                                        해야할 일이 아직 없어요
                                    </div>
                                )}

                                {data?.todos?.length === 0 && selectedFilter === 'DONE' && (
                                    <div className="flex items-center justify-center flex-1 text-sm text-custom_slate-400">
                                        다 한 일이 아직 없어요
                                    </div>
                                )}

                                {data?.todos?.map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todoDetail={todo}
                                        onToggle={(todoId: number, newDone: boolean) => updateTodo({todoId, newDone})}
                                        onDelete={(todoId: number) => deleteTodo(todoId)}
                                        onEdit={() => openEditTodoModal(todo)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page
