import {post} from '@/lib/api'

import type {NoteCommon, NoteDataProperty} from '@/types/notes'

// note API 호출 함수
export const noteRegApi = async (payload: NoteDataProperty): Promise<NoteCommon> => {
    const response = await post<NoteCommon>({
        endpoint: `notes`,
        data: payload,
    })
    return response.data
}
