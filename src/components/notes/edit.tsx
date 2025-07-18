'use client'

import React, {useEffect, useState} from 'react'

import {get} from '@/lib/api'

import type {NoteItemResponse} from '@/types/notes'


const NoteEditCompo = ({noteId}: {noteId: string}) => {
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
        <div className="">
            <div>{note?.todo.title}</div>
            <div>{note?.title}</div>
            <div>{note?.content}</div>
        </div>
    )
}

export default NoteEditCompo
