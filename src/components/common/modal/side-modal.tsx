'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'

import {get} from '@/lib/api'
import {useModalStore} from '@/store/use-modal-store'

import type {NoteItemResponse} from '@/types/notes'

export default function SideModal({noteId}: {noteId?: number}) {
    const [note, setNote] = useState<NoteItemResponse>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    const {clearModal} = useModalStore()

    useEffect(() => {
        if (!noteId) return

        const getNoteDetail = async (id: number) => {
            try {
                setLoading(true)
                const response = await get<NoteItemResponse>({
                    endpoint: `notes/${id}`,
                    options: {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                        },
                    },
                })
                setNote(response.data)
            } catch {
                setError('할 일 상세 정보를 불러오는 데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        getNoteDetail(noteId)
    }, [noteId])

    if (loading) return <div className="p-6">로딩 중...</div>

    if (error) return <div className="p-6 text-red-500">{error}</div>

    return (
        <div className="absolute inset-y-0 right-0 z-50 bg-white lg:w-[800px] sm:w-lg w-full p-6">
            <Image
                src="/todos/ic-close.svg"
                alt="Close Icon"
                width={24}
                height={24}
                onClick={clearModal}
                className="mb-4 cursor-pointer"
            />

            <div className="flex items-center gap-1.5 mb-3 text-base font-medium text-custom_slate-800">
                <Image src="/todos/ic-flag.svg" alt="Flag Icon" width={24} height={24} />
                <div>{note?.goal.title}</div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-custom_slate-700 bg-custom_slate-100 py-[1px] px-[3px] rounded-sm">
                        To do
                    </div>
                    <div className="text-sm text-custom_slate-700">{note?.todo.title}</div>
                </div>
                <div className="text-xs text-custom_slate-500">2024. 04. 29</div>
            </div>

            <h2 className="py-3 mb-3 text-lg font-medium border-t border-b border-custom_slate-200 text-custom_slate-800">
                {note?.title}
            </h2>

            {note?.todo.linkUrl && (
                <div className="flex items-center justify-between px-4 py-1 mb-4 rounded-full bg-custom_slate-200 text-custom_slate-800">
                    <div className="overflow-hidden text-custom_slate-800 whitespace-nowrap text-ellipsis">
                        {note?.todo.linkUrl}
                    </div>
                </div>
            )}

            <p className="text-custom_slate-700">{note?.content}</p>
        </div>
    )
}
