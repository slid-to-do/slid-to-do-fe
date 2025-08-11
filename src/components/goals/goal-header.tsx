'use client'

import Image from 'next/image'
import {useParams} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'

import axios from 'axios'

import LoadingSpinner from '@/components/common/loading-spinner'
import ButtonStyle from '@/components/style/button-style'
import InputStyle from '@/components/style/input-style'
import {useCustomQuery} from '@/hooks/use-custom-query'
import {goalPrograssApi} from '@/lib/goals/api'

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
    const {data: progressData, isLoading} = useCustomQuery<GoalProgress>(
        ['goals', goalId, 'progress'],
        async () => goalPrograssApi(Number(goalId)),
        {
            errorDisplayType: 'toast',
            mapErrorMessage: (error) => {
                const typedError = error as {message?: string; response?: {data?: {message?: string}}}

                if (axios.isAxiosError(error)) {
                    return error.response?.data.message || '서버 오류가 발생했습니다.'
                }

                return typedError.message || '알 수 없는 오류가 발생했습니다.'
            },
        },
    )

    useEffect(() => {
        if (goal && progressData) {
            setProgress(progressData.progress)
        }
    }, [progressData, goal])

    const inputReference = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (goalEdit) {
            inputReference.current?.focus()
        }
    }, [goalEdit])

    if (isLoading) return <LoadingSpinner />
    return (
        <div className="mt-4 py-4 px-6 bg-white rounded">
            <div className="flex justify-between items-center">
                <div className="flex flex-grow gap-2 items-center flex-1 min-w-0">
                    <Image src="/goals/flag-goal.svg" alt="goal-flag" width={40} height={40} />
                    {goal ? (
                        goalEdit ? (
                            <form onSubmit={() => handleGoalAction('edit')} className="w-full flex gap-3 items-center">
                                <InputStyle
                                    type="text"
                                    placeholder="목표를 입력해주세요"
                                    value={goalTitle}
                                    name="title"
                                    className="max-w-full"
                                    onChange={handleInputUpdate}
                                    maxLength={100}
                                    ref={inputReference}
                                />
                                <ButtonStyle
                                    size="medium"
                                    onClick={() => handleGoalAction('edit')}
                                    disabled={goal.title === goalTitle}
                                >
                                    수정
                                </ButtonStyle>
                                <ButtonStyle size="medium" onClick={() => setGoalEdit(false)} color="outline">
                                    취소
                                </ButtonStyle>
                            </form>
                        ) : (
                            <div className="flex-1 min-w-0">
                                <p className="text-custom_slate-800 font-semibold truncate block max-w-full">
                                    {goal.title}
                                </p>
                            </div>
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
