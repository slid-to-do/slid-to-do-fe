import {post, get, del, patch} from '@/lib/common-api'

import type {NoteCommon, NoteDataProperty, NoteItemResponse, NoteListResponse} from '@/types/notes'

// 노트 생성 API 호출 함수
export const noteRegApi = async (payload: {
    todoId: number
    title: string
    content: string
    linkUrl?: string
}): Promise<NoteCommon> => {
    const response = await post<NoteCommon>({
        endpoint: `notes`,
        data: payload,
    })
    return response.data
}

// 노트 리스트 조회 API 호출 함수
export const noteListApi = async (goalId?: string, cursor?: number) => {
    const urlParameter = new URLSearchParams()
    urlParameter.set('size', '10')
    if (goalId) urlParameter.set('goalId', goalId)
    if (cursor !== undefined) urlParameter.set('cursor', String(cursor))

    const endpoint = `notes?${urlParameter.toString()}`
    const result = await get<NoteListResponse>({
        endpoint,
    })
    return {
        data: result.data.notes,
        nextCursor: result.data.nextCursor,
    }
}

// 노트 삭제 API 호출 함수
export const noteDeleteApi = async (id: number) => {
    await del({endpoint: `notes/${id}`})
}

// 단일 노트 조회 API 호출 함수
export const noteDetailApi = async (noteId: number): Promise<NoteItemResponse> => {
    const result = await get<NoteItemResponse>({
        endpoint: `notes/${noteId}`,
    })
    return result.data
}

// 노트 수정 API 호출 함수
export const noteEditApi = async (noteId: number, payload: Omit<NoteDataProperty, 'id'>): Promise<NoteItemResponse> => {
    const response = await patch<NoteItemResponse>({
        endpoint: `notes/${noteId}`,
        data: payload,
    })

    return response.data
}
