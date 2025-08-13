import {getTextFromHtml} from '@/utils/text-from-html'

describe('getTextFromHtml', () => {
    it('HTML 태그를 제거하고 텍스트만 반환', () => {
        const html = '<p>test<strong>text</strong></p>'
        const text = getTextFromHtml(html)
        expect(text).toBe('testtext')
    })

    it('빈 문자열을 넣으면 빈 문자열을 반환', () => {
        expect(getTextFromHtml('')).toBe('')
    })

    it('텍스트만 있는 경우 그대로 반환', () => {
        expect(getTextFromHtml('그냥 텍스트')).toBe('그냥 텍스트')
    })

})
