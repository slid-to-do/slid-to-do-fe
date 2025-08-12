'use client'

import Image from 'next/image'
import React from 'react'

import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query'

import {useCustomMutation} from '@/hooks/use-custom-mutation'
import useToast from '@/hooks/use-toast'
import {del, get, patch} from '@/lib/common-api'

import TodoList from './todo-list'

import type {TodoResponse} from '@/types/todos'

const GoalListBody = ({goalId}: {goalId: number | undefined}) => {
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
    const updateTodo = useCustomMutation(
        async ({todoId, newDone}: {todoId: number; newDone: boolean}) => {
            const response = await patch<TodoResponse>({
                endpoint: `todos/${todoId}`,
                data: {done: newDone},
            })
            return response.data
        },
        {
            onSuccess: (_, value) => {
                queryClient.invalidateQueries({queryKey: ['allProgress']})
                queryClient.invalidateQueries({queryKey: ['newTodo']})
                queryClient.invalidateQueries({queryKey: ['todo', 'notDone', goalId]})
                queryClient.invalidateQueries({queryKey: ['todo', 'done', goalId]})
                queryClient.invalidateQueries({queryKey: ['todos', goalId, 'dashProgress']})
                if (value.newDone) showToast('할 일이 완료되었습니다.', {type: 'info'})
                else showToast('할 일이 다시 추가되었습니다.', {type: 'info'})
            },
        },
    )

    /**할일 삭제 */
    const deleteTodo = useCustomMutation(
        async (todoId: number) => {
            if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return

            const response = await del({
                endpoint: `todos/${todoId}`,
            })
            return response
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['todo']})
                queryClient.invalidateQueries({queryKey: ['allProgress']})
                queryClient.invalidateQueries({queryKey: ['newTodo']})
                queryClient.invalidateQueries({queryKey: ['todo', 'notDone', goalId]})
                queryClient.invalidateQueries({queryKey: ['todo', 'done', goalId]})
                queryClient.invalidateQueries({queryKey: ['todos', 'progress']})
            },
        },
    )

    const handleLoadMore = () => {
        fetchNextNotDone()
        fetchNextDone()
    }

    const hasMoreData = hasNextNotDone || hasNextDone

    const isLoadingMore = isFetchingNextPageNotDone || isFetchingNextPageDone

    return (
        <>
            <section className="flex w-full h-auto flex-col lg:flex-row flex-1 min-w-0">
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
            {hasMoreData && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-4 py-1 text-sm bg-white rounded-full border border-transparent hover:text-custom_blue-800 hover:border-custom_blue-800 disabled:text-custom_slate-400 disabled:hover:border-transparent disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoadingMore ? (
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                    aria-label="로딩중"
                                />
                                로딩중...
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 min-w-[65px]">
                                <Image
                                    src="/dashboard/down-arrow.svg"
                                    alt="더 보기 화살표"
                                    width={9}
                                    height={9}
                                    className="w-2.5 h-auto"
                                />
                                더 보기
                            </div>
                        )}
                    </button>
                </div>
            )}
        </>
    )
}

export default GoalListBody
