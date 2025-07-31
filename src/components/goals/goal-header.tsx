'use client'

import Image from 'next/image'
import {useParams} from 'next/navigation'
import {useEffect, useState} from 'react'

import {useQuery} from '@tanstack/react-query'

import ButtonStyle from '@/components/style/button-style'
import InputStyle from '@/components/style/input-style'
import {get} from '@/lib/api'

import ProgressBar from './prograss-motion'

import type {Goal, GoalProgress} from '@/types/goals'

export default function GoalHeader({
    goal,
    goalTitle,
    goalEdit,
    setGoalEdit,
    moreButton,
    setMoreButton,
    goalDeleteModal,
    handleInputUpdate,
    handleGoalAction,
}: {
    goal?: Goal
    goalTitle?: string
    goalEdit: boolean
    setGoalEdit: (edit: boolean) => void
    moreButton: boolean
    setMoreButton: (open: boolean) => void
    goalDeleteModal: () => void
    handleInputUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleGoalAction: (mode: string) => void
}) {
    const [progress, setProgress] = useState<number>(0)
    const {goalId} = useParams()
    /** 목표 달성 API */
    const {data: progressData} = useQuery<GoalProgress>({
        queryKey: ['todos', goalId, 'progress'],
        queryFn: async () => {
            const response = await get<GoalProgress>({
                endpoint: `todos/progress?goalId=${goalId}`,
                options: {
                    headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                },
            })

            return response.data
        },
    })

    useEffect(() => {
        if (goal && progressData) {
            setProgress(progressData.progress)
        }
    }, [progressData, goal])

    return (
        <div className="mt-4 py-4 px-6 bg-white rounded">
            <div className="flex justify-between items-center">
                <div className="flex flex-grow gap-2 items-center">
                    <Image src="/goals/flag-goal.svg" alt="목표깃발" width={40} height={40} />
                    {goal ? (
                        goalEdit ? (
                            <div className="w-full flex gap-3 items-center">
                                <InputStyle
                                    type="text"
                                    placeholder="할 일의 제목을 적어주세요"
                                    value={goalTitle}
                                    name="title"
                                    onChange={handleInputUpdate}
                                />
                                <ButtonStyle
                                    size="medium"
                                    onClick={() => handleGoalAction('edit')}
                                    disabled={goal.title === goalTitle}
                                >
                                    수정
                                </ButtonStyle>
                            </div>
                        ) : (
                            <div className="text-custom_slate-800 font-semibold">{goal.title}</div>
                        )
                    ) : (
                        <div className="text-custom_slate-800 font-semibold">loading...</div>
                    )}
                </div>
                {!goalEdit && (
                    <div
                        className="flex-shrink-0 cursor-pointer relative"
                        onClick={() => setMoreButton(!moreButton)}
                        role="moreButton"
                    >
                        <Image src="/goals/ic-more.svg" alt="더보기버튼" width={24} height={24} />
                        {moreButton && (
                            <div className="w-24 py-2 absolute right-0 top-7 flex gap-2 flex-col rounded text-center shadow-md z-10 bg-white">
                                <button type="button" onClick={() => setGoalEdit(true)}>
                                    수정하기
                                </button>
                                <button type="button" onClick={goalDeleteModal}>
                                    삭제하기
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-6 text-subBody font-semibold">Progress</div>
            <div className="mt-3.5">
                <ProgressBar progress={progress || 0} />
            </div>
        </div>
    )
}
