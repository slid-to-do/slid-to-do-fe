import {getTextFromHtml} from "@/utils/text-from-html"


describe('getTextFromHtml', () => {
  it("HTML 태그를 제거하고 텍스트만 반환한다", () => {
    const html = '<p>노트 내용</p>'
    const text = getTextFromHtml(html)
    expect(text).toBe("노트 내용")
  })

  it("빈 문자열을 넣으면 빈 문자열을 반환", () => {
    expect(getTextFromHtml("")).toBe('')
  })

  it("텍스트만 있는 경우 그대로 반환", () => {
    expect(getTextFromHtml("텍스트")).toBe("텍스트")
  })
})