// import {renderHook} from '@testing-library/react'
// import {useIsNoteChanged} from '@/hooks/use-is-note-changed'

// describe('useIsNotChanged', () => {
//     it('original과 current가 동일하면 false를 반환한다', () => {
//         const original = {
//             title: '테스트 제목',
//             content: '<p>내용</p>',
//             linkUrl: 'https://test.com',
//         }

//         const current = {
//             title: '테스트 제목',
//             content: '<p>내용</p>',
//             linkUrl: 'https://test.com',
//         }

//         const {result} = renderHook(() =>
//             useIsNoteChanged({
//                 original,
//                 current,
//             }),
//         )
//         expect(result.current).toBe(false)
//     })

//     it('original과 current가 다르면 true를 반환한다', () => {
//         const original = {
//             title: '테스트 제목',
//             content: '<p>내용</p>',
//             linkUrl: 'https://test.com',
//         }

//         const current = {
//             title: '테스트 제목다름',
//             content: '<p>내용 다름</p>',
//             linkUrl: 'https://testtest.com',
//         }

//         const {result} = renderHook(() =>
//             useIsNoteChanged({
//                 original,
//                 current,
//             }),
//         )
//         expect(result.current).toBe(true)
//     })

//     it('original과 current 둘 다 내용이 없을 경우 false ', () => {
//         const original = {
//             title: 'title',
//             content: '',
//             linkUrl: '',
//         }

//         const current = {
//             title: 'title',
//             content: '',
//             linkUrl: '',
//         }

//         const {result} = renderHook(() =>
//             useIsNoteChanged({
//                 original,
//                 current,
//             }),
//         )
//         expect(result.current).toBe(true)
//     })

//     test('original.content가 undefined이면 변경되지 않음으로 판단', () => {
//         const {result} = renderHook(() =>
//             useIsNoteChanged({
//                 original: {
//                     title: '제목',
//                     content: undefined,
//                     linkUrl: '',
//                 },
//                 current: {
//                     title: '제목',
//                     content: '<p>제목</p>',
//                     linkUrl: '',
//                 },
//             }),
//         )

//         expect(result.current).toBe(false)
//     })
// })
