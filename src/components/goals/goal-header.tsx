'use client'

import Image from 'next/image'

import ButtonStyle from '@/components/style/button-style'
import InputStyle from '@/components/style/input-style'

import ProgressBar from './prograss-motion'

import type {Goal} from '@/types/goals'

export default function GoalHeader({
    posts,
    goalEdit,
    setGoalEdit,
    moreButton,
    setMoreButton,
    goalDeleteModal,
    progress,
    handleInputUpdate,
    handleGoalAction,
}: {
    posts?: Goal
    goalEdit: boolean
    setGoalEdit: (edit: boolean) => void
    moreButton: boolean
    setMoreButton: (open: boolean) => void
    goalDeleteModal: () => void
    progress: number
    handleInputUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleGoalAction: (mode: string) => void
}) {
    return (
        <div className="mt-4 py-4 px-6 bg-white rounded">
            <div className="flex justify-between items-center">
                <div className="flex flex-grow gap-2 items-center">
                    <Image src="/goals/flag-goal.svg" alt="목표깃발" width={40} height={40} />
                    {posts ? (
                        goalEdit ? (
                            <div className="w-full flex gap-3 items-center">
                                <InputStyle
                                    type="text"
                                    placeholder="할 일의 제목을 적어주세요"
                                    value={posts.title}
                                    name="title"
                                    onChange={handleInputUpdate}
                                />
                                <ButtonStyle size="medium" onClick={() => handleGoalAction('edit')}>
                                    수정
                                </ButtonStyle>
                            </div>
                        ) : (
                            <div className="text-custom_slate-800 font-semibold">{posts.title}</div>
                        )
                    ) : (
                        <div className="text-custom_slate-800 font-semibold">loading...</div>
                    )}
                </div>
                {!goalEdit && (
                    <div className="flex-shrink-0 cursor-pointer relative" onClick={() => setMoreButton(!moreButton)}>
                        <Image src="/goals/Meatballs_menu.svg" alt="더보기버튼" width={24} height={24} />
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
                <ProgressBar progress={progress} />
            </div>
        </div>
    )
}
