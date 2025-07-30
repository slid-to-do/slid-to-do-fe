import {useEffect, useMemo, useState} from 'react'

import {getTextFromHtml} from '@/utils/text-from-html'

import type {NoteItemResponse} from '@/types/notes'

export const useIsNoteChanged = ({
    original,
    current,
}: {
    original: Pick<NoteItemResponse, 'title' | 'content' | 'linkUrl'>
    current: Pick<NoteItemResponse, 'title' | 'content' | 'linkUrl'>
}) => {
    const [isChanged, setIsChanged] = useState(false)

    const comparison = useMemo(() => {
        const textChanged =
            original.content && current.content
                ? getTextFromHtml(original.content) !== getTextFromHtml(current.content)
                : false

        const titleChanged = original.title !== current.title
        const urlChanged = (original.linkUrl ?? '') !== (current.linkUrl ?? '')

        return {
            textChanged,
            titleChanged,
            urlChanged,
            result: textChanged || titleChanged || urlChanged,
        }
    }, [original.title, original.content, original.linkUrl, current.title, current.content, current.linkUrl])

    useEffect(() => {
        setIsChanged(comparison.result)
    }, [comparison])

    return isChanged
}
