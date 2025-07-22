'use client'

import Image from 'next/image'
import React, {useEffect, useState} from 'react'

import {get} from '@/lib/api'

import ButtonStyle from '../style/button-style'

import type {NoteItemResponse} from '@/types/notes'

const NoteEditCompo = ({noteId, goalTitle, todoTitle}: {noteId: string; goalTitle: string; todoTitle: string}) => {
    const [note, setNote] = useState<NoteItemResponse | undefined>(undefined)
    const fetchNoteDetailData = async () => {
        const url = `notes/${noteId}`
        const response = await get<NoteItemResponse>({
            endpoint: url,
            options: {headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`}},
        })
        const noteDetailData = response.data
        setNote(noteDetailData)
    }

    useEffect(() => {
        fetchNoteDetailData()
    }, [])

    return (
        <>
            <div className="w-full flex justify-between items-center">
                <h1 className="text-subTitle text-custom_slate-900">노트 수정</h1>
                <div className="flex gap-2">
                    <ButtonStyle className="w-24 bg-custom_slate-400 !font-normal rounded-xl">작성완료</ButtonStyle>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <Image src="/goals/flag-goal.svg" alt="목표깃발" width={24} height={24} />
                <h2 className="text-subTitle-sm">원래는 {goalTitle}을 받아 나타나야 함</h2>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <div className="p-1 bg-custom_slate-100 text-custom_slate-700 text-subBody font-medium rounded-sm">
                    <p>To do</p>
                </div>
                <p className=" text-custom_slate-700 text-subBody font-normal">원래는 {todoTitle}을 받아 나타나야함</p>
            </div>
            <div className="">
                <div>{note?.todo.title}</div>
                <div>{note?.title}</div>
                <div>{note?.content}</div>
            </div>
        </>
    )
}

export default NoteEditCompo
