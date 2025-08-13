import {Extension} from '@tiptap/core'

export interface MaxLinesOptions {
    /** 최상위 블록(문단) 최대 개수 */
    limit: number
    /** Shift+Enter(soft break) 허용 여부 */
    allowSoftBreak?: boolean
}

export const MaxLines = Extension.create<MaxLinesOptions>({
    name: 'maxLines',
    addOptions() {
        return {
            limit: 10,
            allowSoftBreak: true,
        }
    },
    addKeyboardShortcuts() {
        return {
            Enter: ({editor}) => {
                const blocks = editor.state.doc.childCount
                return blocks >= this.options.limit
            },
            /** 소프트 브레이크(줄내림) 허용/차단*/
            'Shift-Enter': () => !this.options.allowSoftBreak,
            /** 필요시 Cmd/Ctrl+Enter도 차단*/
            'Mod-Enter': () => true,
        }
    },
})
