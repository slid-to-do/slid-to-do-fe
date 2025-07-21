import React from 'react'

import {useMutation, useQueryClient} from '@tanstack/react-query'

import AddTodoModal from '@/components/common/modal/add-todo-modal'
import InfiniteTodoList from '@/components/goals/todo-list'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import useModal from '@/hooks/use-modal'
import {del, get, patch} from '@/lib/api'

import type {TodoResponse} from '@/types/todos'

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID

const GoalListBody = () => {
    const queryClient = useQueryClient()
    const {openModal: todoAddModal} = useModal(<AddTodoModal />)

    const GetTodoList = (done: boolean) => {
        return async (cursor: number | undefined) => {
            let endpoint = `${TEAM_ID}/todos?goalId=${2386}&done=${done}&size=5`
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
                endpoint: `${TEAM_ID}/todos/${todoId}`,
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
            queryClient.invalidateQueries({queryKey: ['progress']})
        },
    })
    /**할일 삭제 */
    const deleteTodo = useMutation({
        mutationFn: async (todoId: number) => {
            if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return

            const response = await del({
                endpoint: `${TEAM_ID}/todos/${todoId}`,
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
            queryClient.invalidateQueries({queryKey: ['progress']})
        },
    })

    const {
        data: todosDone,
        ref: doneReference,
        isLoading: loadingDone,
        hasMore: haseMoreDone,
    } = useInfiniteScrollQuery<TodoResponse>({
        queryKey: ['todos', true],
        fetchFn: GetTodoList(true),
    })
    const {
        data: todosNotDone,
        ref: notDoneReference,
        isLoading: loadingNotDone,
        hasMore: hasMoreNotDone,
    } = useInfiniteScrollQuery<TodoResponse>({
        queryKey: ['todos', false],
        fetchFn: GetTodoList(false),
    })

    return (
        <section className="flex w-full h-auto flex-col lg:flex-row">
            <InfiniteTodoList
                title="To do"
                todos={todosNotDone}
                isLoading={loadingNotDone}
                hasMore={hasMoreNotDone}
                refCallback={notDoneReference}
                onToggle={(todoId: number, newDone: boolean) => updateTodo.mutate({todoId, newDone})}
                onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
                onAddClick={todoAddModal}
            />
            <InfiniteTodoList
                title="Done"
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
