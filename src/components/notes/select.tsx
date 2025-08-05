'use client'

import {useRouter} from 'next/navigation'
import React, {useEffect, useRef, useState} from 'react'

import {useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'

import {useCustomMutation} from '@/hooks/use-custom-mutation'
import useModal from '@/hooks/use-modal'
import useToast from '@/hooks/use-toast'
import {del} from '@/lib/api'

import TwoButtonModal from '../common/modal/two-buttom-modal'

const NotesSelect: React.FC<{noteId: number}> = ({noteId}) => {
    const {showToast} = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const containerReferance = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const queryClient = useQueryClient()

    const {mutate: deletNote} = useCustomMutation<void, Error, number>(
        async (id) => {
            await del({
                endpoint: `notes/${id}`,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })
        },
        {
            errorDisplayType: 'toast',
            mapErrorMessage: (error) => {
                const apiError = error as {message?: string; response?: {data?: {message?: string}}}
                if (axios.isAxiosError(apiError)) {
                    return apiError.response?.data.message('서버 오류가 발생했습니다.')
                }

                return apiError.message || '알 수 없는 오류가 발생했습니다.'
            },

            onSuccess: () => {
                /**삭제 성공 후 'notes' 쿼리 무효화 → 자동 리페치*/
                queryClient.invalidateQueries({queryKey: ['notes']})
                showToast('삭제가 완료되었습니다')
            },
        },
    )

    /**노트 삭제 확인 모달 */
    const {openModal, closeModal} = useModal(
        <TwoButtonModal
            handleLeftBtn={() => {
                closeModal()
            }}
            handleRightBtn={() => {
                deletNote(noteId)
                closeModal()
            }}
            topText="노트를 삭제하시겠어요?"
            bottomText="삭제된 노트는 복구할 수 없어요"
            buttonText="삭제"
        />,
    )

    /** 바깥 클릭 시 닫기 */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerReferance.current && !containerReferance.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className="relative inline-block text-left" ref={containerReferance}>
            <button
                type="button"
                aria-haspopup="true"
                onClick={() => setIsOpen((previous) => !previous)}
                className="w-6 h-6 rounded-full bg-custom_slate-50  focus:outline-none relative z-1"
            >
                <div className="flex flex-col items-center justify-center space-y-0.5">
                    <span className="block w-0.5 h-0.5 bg-gray-400 rounded-full" />
                    <span className="block w-0.5 h-0.5 bg-gray-400 rounded-full" />
                    <span className="block w-0.5 h-0.5 bg-gray-400 rounded-full" />
                </div>
            </button>

            <div
                role="menu"
                aria-orientation="vertical"
                className={clsx('absolute right-0 mt-2 w-[81px] bg-white rounded-xl shadow-md z-2', {
                    'opacity-100': isOpen,
                    'opacity-0': !isOpen,
                })}
                style={{willChange: 'opacity, transform'}}
            >
                <button
                    role="menuitem"
                    className="block w-full text-sm font-normal py-2 hover:bg-gray-100 text-custom_slate-700 focus:outline-none"
                    onClick={() => {
                        setIsOpen(false)
                        router.push(`/notes/write?noteId=${noteId}`)
                    }}
                >
                    수정하기
                </button>

                <button
                    role="menuitem"
                    className="block w-full text-sm font-normal py-2 hover:bg-gray-100 text-custom_slate-700 focus:outline-none"
                    onClick={() => {
                        openModal()
                        setIsOpen(false)
                    }}
                >
                    삭제하기
                </button>
            </div>
        </div>
    )
}

export default NotesSelect
