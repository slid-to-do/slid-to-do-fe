'use client'

import Image from 'next/image'
import React from 'react'

import {useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query'

import useToast from '@/hooks/use-toast'
import {del, get, patch} from '@/lib/common-api'

import TodoList from './todo-list'

import type {TodoResponse} from '@/types/todos'

const GoalListBody = ({goalId = 2386}: {goalId: number | undefined}) => {
    const queryClient = useQueryClient()
    const {showToast} = useToast()

    const GetTodoList = async ({pageParam, done}: {pageParam: number | string; done: boolean}) => {
        try {
            let endpoint = `todos?goalId=${goalId}&done=${done}&size=5`

            if (pageParam && pageParam !== 0) {
                endpoint += `&cursor=${pageParam}`
            }

            const result = await get<{
                todos: TodoResponse[]
                nextCursor: number | undefined
            }>({
                endpoint,
                options: {
                    headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                },
            })

            return {
                data: result.data.todos,
                nextCursor: result.data.nextCursor,
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error(String(error))
        }
    }

    // To do 리스트 쿼리 (done: false)
    const {
        data: notDoneData,
        fetchNextPage: fetchNextNotDone,
        hasNextPage: hasNextNotDone,
        isFetching: isFetchingNotDone,
        isFetchingNextPage: isFetchingNextPageNotDone,
    } = useInfiniteQuery({
        queryKey: ['todo', 'notDone', goalId],
        queryFn: ({pageParam}) => GetTodoList({pageParam, done: false}),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    })

    // Done 리스트 쿼리 (done: true)
    const {
        data: doneData,
        fetchNextPage: fetchNextDone,
        hasNextPage: hasNextDone,
        isFetching: isFetchingDone,
        isFetchingNextPage: isFetchingNextPageDone,
    } = useInfiniteQuery({
        queryKey: ['todo', 'done', goalId],
        queryFn: ({pageParam}) => GetTodoList({pageParam, done: true}),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    })

    // 데이터 평탄화
    const todosNotDone = notDoneData?.pages.flatMap((page) => page.data) ?? []
    const todosDone = doneData?.pages.flatMap((page) => page.data) ?? []

    /**할일 checkbox update */
    const updateTodo = useMutation({
        mutationFn: async ({todoId, newDone}: {todoId: number; newDone: boolean}) => {
            const response = await patch<TodoResponse>({
                endpoint: `todos/${todoId}`,
                data: {done: newDone},
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })
            return response.data
        },
        onSuccess: (_, value) => {
            queryClient.invalidateQueries({queryKey: ['todo']})
            queryClient.invalidateQueries({queryKey: ['allProgress']})
            queryClient.invalidateQueries({queryKey: ['newTodo']})
            queryClient.invalidateQueries({queryKey: ['todo', 'notDone', goalId]})
            queryClient.invalidateQueries({queryKey: ['todo', 'done', goalId]})
            queryClient.invalidateQueries({queryKey: ['todos', goalId, 'dashProgress']})
            if (value.newDone) showToast('할 일이 완료되었습니다.', {type: 'info'})
            else showToast('할 일이 다시 추가되었습니다.', {type: 'info'})
        },
    })

    /**할일 삭제 */
    const deleteTodo = useMutation({
        mutationFn: async (todoId: number) => {
            if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return

            const response = await del({
                endpoint: `todos/${todoId}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todo']})
            queryClient.invalidateQueries({queryKey: ['allProgress']})
            queryClient.invalidateQueries({queryKey: ['newTodo']})
            queryClient.invalidateQueries({queryKey: ['todo', 'notDone', goalId]})
            queryClient.invalidateQueries({queryKey: ['todo', 'done', goalId]})
            queryClient.invalidateQueries({queryKey: ['todos', 'progress']})
        },
    })

    // 더보기 함수 - 두 리스트 모두 추가 로드
    const handleLoadMore = () => {
        fetchNextNotDone()
        fetchNextDone()
    }

    // 둘 중 하나라도 더 불러올 데이터가 있으면 더보기 버튼 표시
    const hasMoreData = hasNextNotDone || hasNextDone
    // 둘 중 하나라도 로딩 중이면 로딩 상태 표시
    const isLoadingMore = isFetchingNextPageNotDone || isFetchingNextPageDone

    return (
        <>
            <section className="flex w-full h-auto flex-col lg:flex-row">
                <TodoList
                    title="To do"
                    todos={todosNotDone}
                    isLoading={isFetchingNotDone && !isFetchingNextPageNotDone}
                    onToggle={(todoId: number, newDone: boolean) => updateTodo.mutate({todoId, newDone})}
                    onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
                />
                <TodoList
                    title="Done"
                    todos={todosDone}
                    isLoading={isFetchingDone && !isFetchingNextPageDone}
                    onToggle={(todoId: number, newDone: boolean) => updateTodo.mutate({todoId, newDone})}
                    onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
                />
            </section>

            {/* 통합 더보기 버튼 */}

            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore || !hasMoreData}
                    className="px-4 py-1 text-sm bg-white rounded-full border after:border-transparent border-transparent hover:text-custom_blue-800 hover:border-custom_blue-800 disabled:text-custom_slate-400 disabled:hover:border-transparent disabled:cursor-not-allowed transition-colors"
                >
                    {isLoadingMore ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                                -
                            </div>
                            로딩중...
                        </div>
                    ) : (
                        <div className="w-full h-full flex min-w-[65px]  gap-3">
                            {hasMoreData && (
                                <Image
                                    src={'/dashboard/down-arrow.svg'}
                                    alt={'downArrow'}
                                    width={9}
                                    height={9}
                                    className=" w-2.5 h-auto"
                                />
                            )}
                            {hasMoreData && '더 보기'}
                        </div>
                    )}
                </button>
            </div>
        </>
    )
}

export default GoalListBody
