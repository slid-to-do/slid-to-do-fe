
import {renderHook} from '@testing-library/react'

import {useIsNoteChanged} from '@/hooks/use-is-note-changed'


describe('useIsNoteChanged', () => {
    it('original과 current가 동일하면 false 반환', () => {
        const original = {
            title: '테스트 제목',
            content: '<p>내용</p>',
            linkUrl: 'https://test.com',
        }
        const current = {
            title: '테스트 제목',
            content: '<p>내용</p>',
            linkUrl: 'https://test.com',
        }
        const {result} = renderHook(() => useIsNoteChanged({original, current}))

        expect(result.current).toBe(false)
    })

    it('original과 current가 다르면 true 반환', () => {
        const original = {
            title: '제목',
            content: '<p>내용</p>',
            linkUrl: 'https://test.com',
        }
        const current = {
            title: '수정된 제목',
            content: '<p>수정된 내용</p>',
            linkUrl: 'https://current.com',
        }
        const {result} = renderHook(() => useIsNoteChanged({original, current}))

        expect(result.current).toBe(true)
    })

    it('original과 current의 내용이 없어도 변화가 없다면 false 반환', () => {
        const original = {
            title: 'title',
            content: '',
            linkUrl: '',
        }
        const current = {
            title: 'title',
            content: '',
            linkUrl: '',
        }
        const {result} = renderHook(() => useIsNoteChanged({original, current}))

        expect(result.current).toBe(false)
    })
})
