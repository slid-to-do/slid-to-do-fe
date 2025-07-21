'use client'

import {useSearchParams} from 'next/navigation'
import {useEffect} from 'react'

import NoteEditCompo from '@/components/notes/edit'
import NoteWriteCompo from '@/components/notes/write'

const NoteWritePage = () => {
    const searchParameters = useSearchParams()
    const goalId = searchParameters.get('goalId')
    const todoId = searchParameters.get('todoId')
    const noteId = searchParameters.get('noteId')

    const isEdit = typeof noteId === 'string'

    const goalTitle = 'notesData?.[0]?.goal.title'
    const todoTitle = 'note.todo.title'

    useEffect(() => {
        if (todoId === undefined || goalId === undefined) {
            alert('확인 할 데이터가 없습니다.') // 에러페이지로 이동
        }
    }, [todoId, goalId])

    /**여기서는 noteID 로 분기, goalId, todoId 확인해서 title넘겨주는거 어때요? */

    return (
        <div className="flex flex-col w-full min-h-screen p-6 desktop:px-20">
            <div className="mt-6">
                {isEdit ? (
                    <NoteEditCompo noteId={noteId!} goalTitle={goalTitle} todoTitle={todoTitle} />
                ) : (
                    /**작성하기 */
                    <NoteWriteCompo
                        goalId={String(goalId)}
                        todoId={String(todoId)}
                        goalTitle={goalTitle}
                        todoTitle={todoTitle}
                    />
                )}
            </div>
        </div>
    )
}

export default NoteWritePage
