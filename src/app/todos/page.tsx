'use client'

import {useEffect, useState, useCallback} from 'react'

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
    const [data, setData] = useState<TodoListDetail>({
        totalCount: 0,
        nextCursor: 0,
        todos: [],
    })

    const [selectedFilter, setSelectedFilter] = useState<FilterValue>('ALL')
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    const {openModal} = useModal(<AddTodoModal />)

    const handleFilterChange = (value: string) => {
        setSelectedFilter(value as FilterValue)
    }

    // fetchTodos를 useCallback으로 선언 (자식에 내려주기 위함)
    const fetchTodos = useCallback(async () => {
        const parameter = new URLSearchParams()
        if (selectedFilter === 'TODO') parameter.append('done', 'false')
        else if (selectedFilter === 'DONE') parameter.append('done', 'true')

        // 로딩 상태 설정

        try {
            setLoading(true)
            const response = await get<TodoListDetail>({
                endpoint: `todos?${parameter.toString()}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            })
            setData(response.data)
        } catch {
            setError('할 일 목록을 가져오는 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }, [selectedFilter])

    // patch 후 refetch만 하는 콜백
    const handleToggleTodo = async (todoId: number, newDone: boolean) => {
        try {
            await patch({
                endpoint: `todos/${todoId}`,
                data: {done: newDone},
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            })
            fetchTodos() // patch 성공 후 항상 refetch
        } catch {
            setError('할 일 상태를 변경하는 중 오류가 발생했습니다.')
        }
    }

    const handleDeleteTodo = async (todoId: number) => {
        try {
            const confirmDelete = globalThis.confirm('정말로 이 할 일을 삭제하시겠습니까?')
            if (!confirmDelete) return

            await del({
                endpoint: `todos/${todoId}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            })
            fetchTodos() // patch 성공 후 항상 refetch
        } catch {
            setError('할 일을 삭제하는 중 오류가 발생했습니다.')
        }
    }

    useEffect(() => {
        fetchTodos()
    }, [fetchTodos])

    if (loading) return <div>로딩중...</div>

    if (error) return <div className="text-red-500">{error}</div>

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
                            onToggle={handleToggleTodo} // 콜백 전달
                            onDelete={handleDeleteTodo}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Page
