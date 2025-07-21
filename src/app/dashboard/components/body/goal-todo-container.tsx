'use client'

import React, {useState} from 'react'

import {useQuery} from '@tanstack/react-query'

import GoalHeader from '@/components/goals/goal-header'
import {get} from '@/lib/api'

import GoalListBody from './goal-list-body'

import type {Goal} from '@/types/goals'

const GoalTodoContainer = () => {
    const [goalsEdit, setGoalsEdit] = useState(false)
    const [moreButton, setMoreButton] = useState<boolean>(false)
    const [, setPosts] = useState<Goal>()

    const getGoalsData = async () => {
        try {
            const response = await get<{goals: Goal[]}>({
                endpoint: `${1060}/goals?size=1`,
                options: {
                    headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                },
            })

            return {
                data: response.data.goals[0],
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error(String(error))
        }
    }
    const {data} = useQuery({
        queryKey: ['myGoals'],
        queryFn: getGoalsData,
    })
    const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target

        setPosts((previous) => ({
            ...previous,
            title: value,
            id: previous?.id ?? 0,
        }))
    }

    return (
        <div className="w-full h-auto flex flex-col">
            <GoalHeader
                posts={data?.data}
                goalEdit={goalsEdit}
                setGoalEdit={setGoalsEdit}
                moreButton={moreButton}
                setMoreButton={setMoreButton}
                goalDeleteModal={function (): void {
                    throw new Error('Function not implemented.')
                }}
                progress={20 / 100}
                handleInputUpdate={handleInputUpdate}
                handleGoalAction={function (): void {
                    throw new Error('Function not implemented.')
                }}
            />
            <GoalListBody />
        </div>
    )
}

export default GoalTodoContainer
