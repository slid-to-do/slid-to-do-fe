export const getTextFromHtml = (html: string): string => {
    if (!(typeof globalThis !== 'undefined' && 'window' in globalThis)) return html
    const element = globalThis.document.createElement('div')
    element.innerHTML = html
    return element.textContent || ''
}
