'use client'
import LoadingSpinner from '@/components/common/loading-spinner'
import {useInfiniteScroll} from '@/hooks/use-infinite-scroll'
import {get} from '@/lib/api'
import type {Goal} from '@/types/goals'
import {useEffect} from 'react'

const TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN

async function fetchGoals(cursor: number) {
    const result = await get<{
        goals: Goal[]
        nextCursor: number | undefined
    }>({
        endpoint: `1060/goals?cursor=${cursor}&size=6&sortOrder=oldest`,
        options: {
            headers: {Authorization: `Bearer ${TOKEN}`},
        },
    })

    return {
        data: result.data.goals,
        nextCursor: result.data.nextCursor,
    }
}

async function fetchTodo(cursor: number) {
    const result = await get<{
        goals: Goal[]
        nextCursor: number | undefined
    }>({
        endpoint: `1060/goals?cursor=${cursor}&size=6&sortOrder=oldest`,
        options: {
            headers: {Authorization: `Bearer ${TOKEN}`},
        },
    })

    return {
        data: result.data.goals,
        nextCursor: result.data.nextCursor,
    }
}
export default function GoalsDetaieView({goal}: {goal: Goal}) {
    useEffect(() => {
        console.log('goal', goal)
    }, [])
    const {
        data: goals,
        ref: goalReference,
        isLoading: goalsLoading,
        hasMore: goalsHasMore,
    } = useInfiniteScroll<Goal>({fetchFn: fetchGoals})

    const {
        data: todos,
        ref: todoReference,
        isLoading: todosLoading,
        hasMore: todosHasMore,
    } = useInfiniteScroll<Goal>({fetchFn: fetchTodo})

    return (
        <div className="bg-custom_slate-100 p-4">
            <div className="text-subTitle">목표</div>
            <div className="mt-4 bg-white rounded py-4 px-6">
                <div className="flex items-center gap-2">
                    <img src="/goals/flag-goal.png" alt="목표깃발" />
                    <div className="text-custom_slate-800 font-semibold">목표 제목</div>
                </div>
                <div>progress</div>
                <div>animation</div>
            </div>
            <div>노트모아보기</div>
            {/* <div className="flex gap-4">
                <div className={`flex-1/2 border border-violet-500 h-[500px] overflow-y-scroll rounded`}>
                    {goalsLoading && <LoadingSpinner />}

                    <div className="text-2xl mb-4">목표 List</div>
                    {goals.map((item) => (
                        <div key={`goal_${item.id}`} className="mb-20 flex gap-4 items-center">
                            <div>
                                {item.id} {item.title}
                            </div>
                            <button
                                className="bg-blue-500 text-white rounded px-4 py-1"
                                disabled={goalsLoading}
                                onClick={() => alert('추가')}
                            >
                                Btn
                            </button>
                        </div>
                    ))}
                    {goalsHasMore && !goalsLoading ? (
                        <div ref={goalReference} />
                    ) : (
                        !goalsLoading && !goalsHasMore && <div>모든 데이터를 불러왔습니다.</div>
                    )}
                </div>
                <div className="flex-1/2 border border-blue-500 h-[500px] overflow-y-scroll rounded">
                    {todosLoading && <LoadingSpinner />}

                    <div className="text-2xl mb-4">할일 List</div>
                    {todos.map((item) => (
                        <div key={`todo_${item.id}`} className="mb-20 flex gap-4 items-center">
                            <div>
                                {item.id} {item.title}
                            </div>
                            <button
                                className="bg-blue-500 text-white rounded px-4 py-1"
                                disabled={todosLoading}
                                onClick={() => alert('추가')}
                            >
                                Btn
                            </button>
                        </div>
                    ))}
                    {todosHasMore && !todosLoading ? (
                        <div ref={todoReference} />
                    ) : (
                        !todosLoading && !todosHasMore && <div>모든 데이터를 불러왔습니다.</div>
                    )}
                </div>
            </div> */}
        </div>
    )
}
