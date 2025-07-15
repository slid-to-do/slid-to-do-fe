'use client'
import Image from 'next/image'
import {useParams, useRouter} from 'next/navigation'
import {useCallback, useEffect, useState} from 'react'

import {useMutation, useQueryClient} from '@tanstack/react-query'

import LoadingSpinner from '@/components/common/loading-spinner'
import TodoItem from '@/components/common/todo-item'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {del, get, patch} from '@/lib/api'

import ProgressBar from './prograss-motion'

import type {GoalResponse, GoalProgress} from '@/types/goals'
import type {TodoResponse} from '@/types/todos'

const TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID

export default function GoalsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<GoalResponse>()
    const [moreButton, setMoreButton] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)

    const queryClient = useQueryClient()

    const parameters = useParams()
    const goalId = parameters.goalId as string

    /** 목표 API 호출 */
    useEffect(() => {
        const getGoalsData = async () => {
            const url = `${TEAM_ID}/goals/${goalId}`
            try {
                const response = await get<GoalResponse>({
                    endpoint: `${url}`,
                    options: {
                        headers: {Authorization: `Bearer ${TOKEN}`},
                    },
                })
                const goal = response.data
                setPosts(goal)

                const getProgress = await get<GoalProgress>({
                    endpoint: `${TEAM_ID}/todos/progress`,
                    options: {
                        headers: {Authorization: `Bearer ${TOKEN}`},
                    },
                })
                setProgress(getProgress.data.progress / 100)
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return <div>{error.message}</div>
                }
                return <div>{String(error)}</div>
            }
        }

        if (goalId) {
            getGoalsData()
        }
    }, [goalId])

    /** 할일 API 호출 */
    const GetTodoList = (done: boolean) => {
        return async (cursor: number | undefined) => {
            let endpoint = `${TEAM_ID}/todos?goalId=${goalId}&done=${done}&size=10`
            if (cursor !== undefined) {
                endpoint += `&cursor=${cursor}`
            }

            const result = await get<{
                todos: TodoResponse[]
                nextCursor: number | undefined
            }>({
                endpoint,
                options: {
                    headers: {Authorization: `Bearer ${TOKEN}`},
                },
            })
            return {
                data: result.data.todos,
                nextCursor: result.data.nextCursor,
            }
        }
    }

    // 해야 할 일
    const {
        data: todosDone,
        ref: doneReference,
        isLoading: loadingDone,
        hasMore: haseMoreDone,
        isError: doneIsError,
        error: doneError,
    } = useInfiniteScrollQuery<TodoResponse>({
        queryKey: ['todos', true],
        fetchFn: GetTodoList(true),
    })

    // 한 일
    const {
        data: todosNotDone,
        ref: notDoneReference,
        isLoading: loadingNotDone,
        hasMore: hasMoreNotDone,
        isError: notDoneIsError,
        error: notDoneError,
    } = useInfiniteScrollQuery<TodoResponse>({
        queryKey: ['todos', false],
        fetchFn: GetTodoList(false),
    })

    const [goalEdit, setGoalEdit] = useState<boolean>(false)
    /** 목표 수정&삭제 */
    const handleGoalAction = useCallback((mode: string) => {
        if (mode === 'edit') {
            setGoalEdit(true)
            // router.push(`/goals/${goalId}/edit`)
            alert('수정되었습니다.')
        } else if (mode === 'delete' && confirm('정말 삭제하시겠습니까?')) {
            alert('삭제되었습니다.')
            /**  fetch(`/api/goals/${goalId}`, {
                 method: 'DELETE',
             }).then(() => {
                 alert('삭제되었습니다.')
             }) */
        }
    }, [])

    /** 노트 모아보기 페이지 이동 */
    const goNoteList = () => {
        router.push('/')
    }

    const updateTodo = useMutation({
        mutationFn: async ({todoId, newDone}: {todoId: number; newDone: boolean}) => {
            const response = await patch<TodoResponse>({
                endpoint: `${TEAM_ID}/todos/${todoId}`,
                data: {done: newDone},
                options: {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
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
            if (!confirm('정말로 이 할 일을 삭제하시겠습니까?')) return

            const response = await del({
                endpoint: `${TEAM_ID}/todos/${todoId}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                },
            })

            return response
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']})
        },
    })

    let error
    if (doneIsError) {
        error = doneError
    } else if (notDoneIsError) {
        error = notDoneError
    }

    if (error) {
        return (
            <div className="flex items-center justify-center w-full h-full text-sm text-red-500">
                {error instanceof Error ? error.message : '할 일을 불러오는 중 오류가 발생했습니다.'}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-custom_slate-100 ">
            <div className="p-4 mx-auto">
                <div className="text-subTitle">목표</div>
                <div className="mt-4 py-4 px-6 bg-white rounded">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Image src="/goals/flag-goal.svg" alt="목표깃발" width={40} height={40} />
                            {posts ? (
                                <>
                                    {goalEdit ? (
                                        <div className="text-custom_slate-800 font-semibold">수정하세욧</div>
                                    ) : (
                                        <div className="text-custom_slate-800 font-semibold">{posts.title}</div>
                                    )}
                                </>
                            ) : (
                                <div className="text-custom_slate-800 font-semibold">loading...</div>
                            )}
                        </div>
                        <div className="cursor-pointer relative" onClick={() => setMoreButton(!moreButton)}>
                            <Image src={'/goals/Meatballs_menu.svg'} alt="더보기버튼" width={24} height={24} />
                            {moreButton && (
                                <div className="w-24 py-2 absolute right-0 top-7 flex gap-2 flex-col rounded text-center shadow-md z-10 bg-white">
                                    <button type="button" onClick={() => handleGoalAction('edit')}>
                                        수정하기
                                    </button>
                                    <button type="button" onClick={() => handleGoalAction('delete')}>
                                        삭제하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 text-subBody font-semibold">Progress</div>
                    <div className="mt-3.5">
                        <ProgressBar progress={progress} />
                    </div>
                </div>
                <div
                    className="mt-6 py-4 px-6 bg-custom_blue-100 flex items-center justify-between rounded-xl cursor-pointer"
                    onClick={() => goNoteList()}
                >
                    <div className="flex gap-2 items-center">
                        <Image src="/goals/note.svg" alt="노트" width={24} height={24} />
                        <div className="text-subTitle">노트 모아보기</div>
                    </div>
                    <Image src="/goals/ic_arrow_right.svg" alt="노트보기 페이지 이동" width={24} height={24} />
                </div>
                <div className="mt-6 flex flex-col lg:flex-row gap-6 justify-between">
                    <div className={`py-4 px-6 h-[228px] flex-1 bg-white rounded-xl overflow-y-auto scrollbar-custom`}>
                        <div className="flex items-center justify-between">
                            <div className="text-subTitle">To do</div>
                            <div className="flex items-center">
                                <Image src="/goals/ic_plus.svg" alt="+" width={16} height={16} />
                                <div className="text-custom_blue-500 text-sm font-semibold">할일 추가</div>
                            </div>
                        </div>
                        <div className="mt-4">
                            {todosNotDone.length > 0 ? (
                                <>
                                    {loadingNotDone ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            {todosNotDone.map((todo: TodoResponse) => (
                                                <div key={`todoList_${todo.id}`} className="mb-2">
                                                    <TodoItem
                                                        key={todo.id}
                                                        todoDetail={todo}
                                                        onToggle={(todoId: number, newDone: boolean) =>
                                                            updateTodo.mutate({todoId, newDone})
                                                        }
                                                        onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
                                                    />
                                                </div>
                                            ))}

                                            {hasMoreNotDone && !loadingNotDone && todosNotDone.length > 0 && (
                                                <div ref={notDoneReference} />
                                            )}

                                            {!hasMoreNotDone && todosNotDone.length > 0 && (
                                                <div className="mt-4 text-gray-400 text-sm">
                                                    모든 할일을 다 불러왔어요
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center text-sm text-custom_slate-500 text-center h-[120px]">
                                    해야할 일이 아직 없어요
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={`py-4 px-6 h-[228px] flex-1 bg-custom_slate-200 rounded-xl overflow-y-auto scrollbar-custom`}
                    >
                        <div className="text-subTitle">Done</div>

                        <div className="mt-4">
                            {todosDone.length > 0 ? (
                                <>
                                    {loadingDone ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>
                                            {todosDone.map((todo: TodoResponse) => (
                                                <div key={`todoList_${todo.id}`} className="mb-2">
                                                    <TodoItem
                                                        key={todo.id}
                                                        todoDetail={todo}
                                                        onToggle={(todoId: number, newDone: boolean) =>
                                                            updateTodo.mutate({todoId, newDone})
                                                        }
                                                        onDelete={(todoId: number) => deleteTodo.mutate(todoId)}
                                                    />
                                                </div>
                                            ))}

                                            {haseMoreDone && !loadingDone && todosDone.length > 0 && (
                                                <div ref={doneReference} />
                                            )}

                                            {!haseMoreDone && todosDone.length > 0 && (
                                                <div className="mt-4 text-gray-400 text-sm">
                                                    모든 할일을 다 불러왔어요
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center text-sm text-custom_slate-500 text-center h-[120px]">
                                    다 한 일이 아직 없어요
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
