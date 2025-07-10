'use client'
import Image from 'next/image'
import {useParams, useRouter} from 'next/navigation'
import {useCallback, useEffect, useState} from 'react'

import LoadingSpinner from '@/components/common/loading-spinner'
import {useInfiniteScroll} from '@/hooks/use-infinite-scroll'
import {get} from '@/lib/api'

import ProgressBar from './prograss-motion'

import type {Goal, Todos} from '@/types/goals'

const TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN

// async function GetTodoList() {
//     const result = await get<{
//         goals: Goal[]
//         nextCursor: number | undefined
//     }>({
//         endpoint: `1060/todos?goald=${}&cursor=5150&size=10&done=false`,
//         // endpoint: `1060/todos?cursor=${cursor}&size=6&sortOrder=oldest`,
//         options: {
//             headers: {Authorization: `Bearer ${TOKEN}`},
//         },
//     })
//     return {
//         data: result.data.goals,
//         nextCursor: result.data.nextCursor,
//     }
// }

export default function GoalsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<Goal>()
    const [moreButton, setMoreButton] = useState<boolean>(false)
    const progress = 0.6

    const parameters = useParams()
    const goalId = parameters.goalId as string

    /** 목표 api 호출 */
    useEffect(() => {
        const getGoalsData = async () => {
            const url = `1060/goals/${goalId}`
            try {
                const response = await get<Goal>({
                    endpoint: `${url}`,
                    options: {
                        headers: {Authorization: `Bearer ${TOKEN}`},
                    },
                })
                const goal = response.data
                setPosts(goal)
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

    /** 할일 list api 호출 */
    const GetTodoList = async () => {
        const result = await get<{
            todos: Todos[]
            nextCursor: number | undefined
        }>({
            endpoint: `1060/todos?goald=${goalId}&done=false&cursor=5150&size=10`,
            // endpoint: `1060/todos?cursor=${cursor}&size=6&sortOrder=oldest`,
            options: {
                headers: {Authorization: `Bearer ${TOKEN}`},
            },
        })
        return {
            data: result.data.todos,
            nextCursor: result.data.nextCursor,
        }
    }

    /** 무한스크롤 Hook */
    const {
        data: todos,
        ref: goalReference,
        isLoading: todosLoading,
        hasMore: todosHasMore,
    } = useInfiniteScroll<Todos>({fetchFn: GetTodoList})

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

    return (
        <div className="p-4 min-h-screen bg-custom_slate-100">
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
                            <div className="w-24 py-2 absolute right-0 top-7 flex gap-2 flex-col rounded text-center shadow-md">
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

            <div className="mt-6 flex gap-6 justify-between">
                <div className={`py-4 px-6 h-[228px] flex-1/2 overflow-y-scroll bg-white rounded-xl`}>
                    {todosLoading && <LoadingSpinner />}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-subTitle">To do</div>
                        <div className="flex items-center">
                            <Image src="/goals/ic_plus.svg" alt="+" width={16} height={16} />
                            <div className="text-custom_blue-500 text-sm font-semibold">할일 추가</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        {todos.map((item) => (
                            <div key={`todoList_${item.id}`} className="flex gap-4 items-center">
                                <div>
                                    {item.id} {item.title}
                                </div>
                            </div>
                        ))}
                        {todosHasMore && !todosLoading ? (
                            <div ref={goalReference} />
                        ) : (
                            !todosLoading && !todosHasMore && <div>모든 데이터를 불러왔습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
