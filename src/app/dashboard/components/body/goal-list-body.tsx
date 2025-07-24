import React from 'react'

import {useMutation, useQueryClient} from '@tanstack/react-query'

import InfiniteTodoList from '@/components/goals/todo-list'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {del, get, patch} from '@/lib/api'

import type {TodoResponse} from '@/types/todos'

const GoalListBody = ({goalId = 2386}: {goalId: number | undefined}) => {
    const queryClient = useQueryClient()

    const GetTodoList = (done: boolean) => {
        return async (cursor: number | undefined) => {
            let endpoint = `/todos?goalId=${goalId}&done=${done}&size=5`
            if (cursor !== undefined) {
                endpoint += `&cursor=${cursor}`
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
        }
    }
    /**할일 checkbox update */
    const updateTodo = useMutation({
        mutationFn: async ({todoId, newDone}: {todoId: number; newDone: boolean}) => {
            const response = await patch<TodoResponse>({
                endpoint: `/todos/${todoId}`,
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

            queryClient.invalidateQueries({queryKey: ['allProgress']})
            queryClient.invalidateQueries({queryKey: ['newTodo']})
        },
    })
    /**할일 삭제 */
    const deleteTodo = useMutation({
        mutationFn: async (todoId: number) => {
            if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return

            const response = await del({
                endpoint: `/todos/${todoId}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })
            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']})
            queryClient.invalidateQueries({queryKey: ['allProgress']})
            queryClient.invalidateQueries({queryKey: ['newTodo']})
        },
    })

    const {
        data: todosNotDone,
        ref: notDoneReference,
        isLoading: loadingNotDone,
        hasMore: hasMoreNotDone,
    } = useInfiniteScrollQuery<TodoResponse>({
        queryKey: ['todos', goalId, false],
        fetchFn: GetTodoList(false),
    })
    const {
        data: todosDone,
        ref: doneReference,
        isLoading: loadingDone,
        hasMore: haseMoreDone,
    } = useInfiniteScrollQuery<TodoResponse>({
        queryKey: ['todos', goalId, true],
        fetchFn: GetTodoList(true),
    })

    return (
        <section className="flex w-full h-auto flex-col lg:flex-row">
            <InfiniteTodoList
                title="To do"
                isBlue={true}
                todos={todosNotDone}
                isLoading={loadingNotDone}
                hasMore={hasMoreNotDone}
                refCallback={notDoneReference}
                onToggle={(todoId: number, newDone: boolean) => updateTodo.mutate({todoId, newDone})}
                onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
            />
            <InfiniteTodoList
                title="Done"
                isBlue={true}
                todos={todosDone}
                isLoading={loadingDone}
                hasMore={haseMoreDone}
                refCallback={doneReference}
                onToggle={(todoId: number, newDone: boolean) => updateTodo.mutate({todoId, newDone})}
                onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
            />
        </section>
    )
}

export default GoalListBody
