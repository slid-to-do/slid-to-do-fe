'use client'
import Image from 'next/image'
import {useParams, useRouter} from 'next/navigation'
import {useCallback, useEffect, useState} from 'react'

import LoadingSpinner from '@/components/common/loading-spinner'
import TodoItem from '@/components/common/todo-item'
import {useInfiniteScroll} from '@/hooks/use-infinite-scroll'
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
    /** const [nextCursor, setNextCursor] = useState<number | undefined>() */
    const [nextCursorDone, setNextCursorDone] = useState<number | undefined>()
    const [nextCursorNotDone, setNextCursorNotDone] = useState<number | undefined>()

    const [progress, setProgress] = useState<number>(0)

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
    const GetTodoList = useCallback(
        (done: boolean, setCursor: (cursor: number | undefined) => void) => {
            return async (cursor: number | undefined) => {
                let apiResponse = `${TEAM_ID}/todos?goald=${goalId}&done=${done}&size=10`
                if (cursor !== undefined) {
                    apiResponse += `&cursor=${cursor}`
                }

                const result = await get<{
                    todos: TodoResponse[]
                    nextCursor: number | undefined
                }>({
                    endpoint: apiResponse,
                    options: {
                        headers: {Authorization: `Bearer ${TOKEN}`},
                    },
                })

                setCursor(result.data.nextCursor)

                return {
                    data: result.data.todos,
                    nextCursor: result.data.nextCursor,
                }
            }
        },
        [goalId],
    )

    // 해야 할 일
    const {
        data: todosDone,
        ref: doneReference,
        isLoading: loadingDone,
        hasMore: haseMoreDone,
        reset: resetTodosDone,
    } = useInfiniteScroll<TodoResponse>({
        fetchFn: GetTodoList(true, setNextCursorDone),
    })

    // 한 일
    const {
        data: todosNotDone,
        ref: notDoneReference,
        isLoading: loadingNotDone,
        hasMore: hasMoreNotDone,
        reset: resetTodosNotDone,
    } = useInfiniteScroll<TodoResponse>({
        fetchFn: GetTodoList(false, setNextCursorNotDone),
    })

    /** 목표 수정&삭제 */
    const handleGoalAction = useCallback((mode: string) => {
        if (mode === 'edit') {
            alert('수정되었습니다.')
            // router.push(`/goals/${goalId}/edit`)
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

    // 할일 주영님꺼
    const [error, setError] = useState<string>('')
    const handleToggleTodo = async (todoId: number, newDone: boolean) => {
        try {
            await patch({
                endpoint: `${TEAM_ID}/todos/${todoId}`,
                data: {done: newDone},
                options: {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                },
            })
            if (newDone) {
                resetTodosDone()
            } else {
                resetTodosNotDone()
            }
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
        } catch {
            setError('할 일을 삭제하는 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className="min-h-screen bg-custom_slate-100 ">
            <div className="p-4 mx-auto">
                <div className="text-subTitle">목표</div>
                <div className="mt-4 py-4 px-6 bg-white rounded">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Image src="/goals/flag-goal.png" alt="목표깃발" width={40} height={40} />
                            {posts ? (
                                <div className="text-custom_slate-800 font-semibold">{posts.title}</div>
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
                <div className="mt-6 py-4 px-6 bg-custom_blue-100 flex items-center justify-between rounded-xl">
                    <div className="flex gap-2 items-center">
                        <Image src="/goals/note.png" alt="노트" width={24} height={24} />
                        <div className="text-subTitle">노트 모아보기</div>
                    </div>
                    <div onClick={() => goNoteList()}>
                        <Image src="/goals/ic_arrow_right.png" alt="노트보기 페이지 이동" width={24} height={24} />
                    </div>
                </div>
                <div className="mt-6 flex flex-col lg:flex-row gap-6 justify-between">
                    <div
                        className={`py-4 px-6 h-[228px] flex-grow bg-white rounded-xl ${todosNotDone.length > 5 ? 'overflow-y-scroll scrollbar-custom' : ''}`}
                    >
                        {loadingNotDone && <LoadingSpinner />}
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
                                    {todosNotDone.map((todo) => (
                                        <div key={`todoList_${todo.id}`} className="">
                                            <TodoItem
                                                key={todo.id}
                                                todoDetail={todo}
                                                onToggle={handleToggleTodo} // 콜백 전달
                                                onDelete={handleDeleteTodo}
                                            />
                                        </div>
                                    ))}

                                    {hasMoreNotDone && !loadingNotDone && todosNotDone.length > 0 && (
                                        <div ref={notDoneReference} />
                                    )}

                                    {nextCursorNotDone === null && todosNotDone.length > 0 && (
                                        <div className="mt-4 text-gray-400 text-sm">모든 할일을 다 불러왔어요</div>
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
                        className={`py-4 px-6 h-[228px] flex-grow bg-custom_slate-200 rounded-xl ${todosDone.length > 5 ? 'overflow-y-scroll scrollbar-custom' : ''}`}
                    >
                        {loadingDone && <LoadingSpinner />}
                        <div className="text-subTitle">Done</div>

                        <div className="mt-4">
                            {todosDone.length > 0 ? (
                                <>
                                    {todosDone.map((todo) => (
                                        <div key={`todoList_${todo.id}`} className="">
                                            <TodoItem
                                                key={todo.id}
                                                todoDetail={todo}
                                                onToggle={handleToggleTodo} // 콜백 전달
                                                onDelete={handleDeleteTodo}
                                            />
                                        </div>
                                    ))}

                                    {haseMoreDone && !loadingDone && todosDone.length > 0 && (
                                        <div ref={doneReference} />
                                    )}

                                    {nextCursorDone === null && todosDone.length > 0 && (
                                        <div className="mt-4 text-gray-400 text-sm">모든 할일을 다 불러왔어요</div>
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
                {error && <div className="text-red-500">{error}</div>}
            </div>
        </div>
    )
}
