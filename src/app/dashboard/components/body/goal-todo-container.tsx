'use client'

import React, {useEffect, useState} from 'react'

import {useQuery} from '@tanstack/react-query'

import GoalHeader from '@/components/goals/goal-header'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {get} from '@/lib/api'

import GoalListBody from './goal-list-body'

import type {Goal, GoalResponse} from '@/types/goals'
import LoadingSpinner from '@/components/common/loading-spinner'
import Link from 'next/link'
import Image from 'next/image'
import GoalTitleHeader from './goal-title-header'

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID

const GoalTodoContainer = () => {
    const [goalsEdit, setGoalsEdit] = useState(false)
    const [moreButton, setMoreButton] = useState<boolean>(false)
    const [, setPosts] = useState<Goal>()

    const getGoalsData = () => {
        return async (cursor: number | undefined) => {
            try {
                const urlParameter = cursor === undefined ? '' : `&cursor=${cursor}`
                const response = await get<{goals: GoalResponse[]; nextCursor: number | undefined}>({
                    endpoint: `${TEAM_ID}/goals?size=3&sortOrder=newest${urlParameter}`,
                    options: {
                        headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                    },
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

    // const {data: fetchGoals} = useQuery<{data: Goal[]}>({
    //     queryKey: ['myGoals'],
    //     queryFn: getGoalsData,
    // })
    const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target

        setPosts((previous) => ({
            ...previous,
            title: value,
            id: previous?.id ?? 0,
        }))
    }

    return (
        <section className="w-full h-auto bg-white rounded-lg p-2">
            <header className="w-full h-auto mb-4 flex justify-start items-center pl-4 pt-4 gap-2">
                <Image src={'./dashboard/goals-todo.svg'} alt="goal-todo" width={40} height={40} />
                <h1 className=" text-title-base font-semibold">목표 별 할일</h1>
            </header>
            {loadingGoals ? (
                <LoadingSpinner />
            ) : (
                <>
                    {fetchGoals?.map((myGoal: GoalResponse) => (
                        <div
                            key={myGoal.id}
                            className="w-full h-auto flex flex-col rounded-lg p-2 bg-custom_blue-300 mb-3"
                        >
                            <GoalTitleHeader title={myGoal.title} goalId={myGoal.id} />
                            <GoalListBody goalId={myGoal.id} />
                        </div>
                    ))}

                    {hasMoreGoals && !loadingGoals && fetchGoals.length > 0 && <div ref={goalReference} />}

                    {!hasMoreGoals && fetchGoals.length > 0 && (
                        <div className="mt-4 text-gray-400 text-sm">모든 할일을 다 불러왔어요</div>
                    )}
                </>
            )}
        </section>
    )
}

export default GoalTodoContainer
