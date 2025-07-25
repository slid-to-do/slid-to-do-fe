'use client'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'

import {useModal} from '@/hooks/use-modal'

import SideModal from './modal/side-modal'

import type {TodoResponse} from '@/types/todos'

export default function TodoItem({
    todoDetail,
    onToggle,
    onEdit,
    onDelete,
}: {
    todoDetail: TodoResponse
    onToggle: (todoId: number, newDone: boolean, goalId?: number) => void
    onEdit?: (todoId: number) => void
    onDelete?: (todoId: number) => void
}) {
    const [isGoalTitleOpen, setIsGoalTitleOpen] = useState<boolean>(false)
    const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false)

    const contextMenuReference = useRef<HTMLDivElement>(null)

    // 바깥 클릭 감지 로직
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuReference.current && !contextMenuReference.current.contains(event.target as Node)) {
                setIsContextMenuOpen(false)
            }
        }

        if (isContextMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isContextMenuOpen])

    const router = useRouter()

    // 모달 열기 함수
    const {openModal} = useModal((noteId: number) => <SideModal noteId={noteId} />, {
        modalAnimation: 'slideFromRight',
    })

    const handleMenuClick = (action: () => void) => {
        action()
        setIsContextMenuOpen(false) // 메뉴 항목 클릭 시 메뉴 닫기
    }

    return (
        <div>
            <div className="flex justify-between">
                {/* 체크박스, 제목 영역 */}
                <div className="flex items-center gap-2">
                    <div
                        className="flex items-center justify-center rounded-full size-6"
                        onClick={() => onToggle(todoDetail.id, !todoDetail.done)}
                    >
                        <Image
                            src={`${todoDetail?.done ? '/todos/ic-checkbox-active.svg' : '/todos/ic-checkbox-inactive.svg'}`}
                            alt="Checkbox Icon"
                            width={18}
                            height={18}
                        />
                    </div>
                    <div
                        className={`text-sm cursor-pointer hover:underline ${todoDetail?.done ? 'line-through' : ''}`}
                        onClick={() => setIsGoalTitleOpen(!isGoalTitleOpen)}
                    >
                        {todoDetail?.title}
                    </div>
                </div>

                {/* 우측 아이콘 영역 */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* 첨부파일 */}
                    {todoDetail?.fileUrl && (
                        <Image
                            src="/todos/ic-file.svg"
                            alt="File Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            onClick={() => window.open(todoDetail?.fileUrl)}
                        />
                    )}

                    {/* 링크 */}
                    {todoDetail?.linkUrl && (
                        <Image
                            src="/todos/ic-link.svg"
                            alt="Link Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            onClick={() => window.open(todoDetail?.linkUrl, '_blank')}
                        />
                    )}

                    {/* 연결된 노트 */}
                    {todoDetail?.noteId && (
                        <Image
                            src="/todos/ic-note.svg"
                            alt="Note Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            onClick={() => openModal(todoDetail?.noteId)}
                        />
                    )}

                    {/* 메뉴 */}
                    <div className="relative" ref={contextMenuReference}>
                        <Image
                            src="/todos/ic-menu.svg"
                            alt="Menu Icon"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
                        />

                        {/* 컨텍스트 메뉴 */}
                        {isContextMenuOpen && (
                            <div className="absolute right-0 flex flex-col overflow-hidden text-sm bg-white shadow-lg top-8 rounded-xl min-w-max z-10">
                                {todoDetail?.noteId === null && (
                                    <Link
                                        className="px-4 py-2 transition cursor-pointer hover:bg-gray-100"
                                        href={`/notes/write?goalId=${todoDetail.goal.id}&todoId=${todoDetail.id}`}
                                    >
                                        노트작성
                                    </Link>
                                )}

                                <div
                                    className="px-4 py-2 transition cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleMenuClick(() => onEdit?.(todoDetail.id))}
                                >
                                    수정하기
                                </div>
                                <div
                                    className="px-4 py-2 transition cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleMenuClick(() => onDelete?.(todoDetail.id))}
                                >
                                    삭제하기
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 목표 제목 영역 (할일 제목 클릭 시 표시) */}
            {isGoalTitleOpen && (
                <div className="flex items-center gap-1.5 ml-8 text-sm text-custom_slate-700">
                    <Image src="/todos/ic-goal.svg" alt="Goal Icon" width={24} height={24} />
                    <div
                        className="cursor-pointer hover:underline"
                        onClick={() => router.push(`/goals/${todoDetail?.goal.id}`)}
                    >
                        {todoDetail.goal.title}
                    </div>
                </div>
            )}
        </div>
    )
}
