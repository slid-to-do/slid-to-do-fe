'use client'

import Image from 'next/image'
import React from 'react'

import LoadingSpinner from '@/components/common/loading-spinner'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {get} from '@/lib/api'

import GoalListBody from './goal-list-body'
import GoalTitleHeader from './goal-title-header'

import type {GoalResponse} from '@/types/goals'

const GoalTodoContainer = () => {
    const getGoalsData = () => {
        return async (cursor: number | undefined) => {
            try {
                const urlParameter = cursor === undefined ? '' : `&cursor=${cursor}`
                const response = await get<{goals: GoalResponse[]; nextCursor: number | undefined}>({
                    endpoint: `goals?size=3&sortOrder=newest${urlParameter}`,
                })

                return {
                    data: response.data.goals,
                    nextCursor: response.data.nextCursor,
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw error
                }
                throw new Error(String(error))
            }
        }
    }

    const {
        data: fetchGoals,
        ref: goalReference,
        isLoading: loadingGoals,
        hasMore: hasMoreGoals,
    } = useInfiniteScrollQuery<GoalResponse>({
        queryKey: ['myGoals'],
        fetchFn: getGoalsData(),
    })

    return (
        <section className="w-full h-auto min-h-[300px] bg-white rounded-lg p-2 relative">
            <header className="w-full h-auto mb-4 flex justify-start items-center pl-4 pt-4 gap-2">
                <Image src={'/dashboard/goals-todo.svg'} alt="goal-todo" width={40} height={40} />

                <h1 className=" text-title-base font-semibold">목표 별 할 일</h1>
            </header>
            {loadingGoals ? (
                <div className="  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {fetchGoals.length === 0 ? (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm  ">
                            등록된 목표가 없습니다.
                        </div>
                    ) : (
                        <>
                            {fetchGoals.map((myGoal: GoalResponse) => (
                                <div
                                    key={myGoal.id}
                                    className="w-full h-auto flex flex-col rounded-lg p-2 bg-custom_blue-50 mb-3"
                                >
                                    <GoalTitleHeader title={myGoal.title} goalId={myGoal.id} />
                                    <GoalListBody goalId={myGoal.id} />
                                </div>
                            ))}

                            {hasMoreGoals && <div ref={goalReference} />}

                            {!hasMoreGoals && (
                                <div className="mt-4 text-gray-400 text-sm">모든 할일을 다 불러왔어요</div>
                            )}
                        </>
                    )}
                </>
            )}
        </section>
    )
}

export default GoalTodoContainer
