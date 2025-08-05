import {post} from '@/lib/api'

import type {NoteCommon} from '@/types/notes'

interface NoteDataProperty {
    todoId: number
    title: string
    content: string
    linkUrl?: string
}

// goal API 호출 함수
export const noteRegApi = async (payload: NoteDataProperty): Promise<NoteCommon> => {
    const response = await post<NoteCommon>({
        endpoint: `notes`,
        data: payload,
    })
    return response.data
}
