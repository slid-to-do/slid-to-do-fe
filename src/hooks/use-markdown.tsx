import {createElement, Fragment, useCallback, useEffect, useState} from 'react'

import {jsx, jsxs} from 'react/jsx-runtime'
import rehypeReact from 'rehype-react'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

import {markdownElements} from '@/components/markdown-editor/markdown-elements'

export default function useMarkdown(value: string) {
    const [markdown, setMarkdown] = useState<React.ReactElement>(<></>)

    const renderMarkdown = useCallback(async () => {
        if (!value.trim()) {
            setMarkdown(<></>)
            return
        }

        try {
            // 마크다운 → mdast → hast → React Element
            const reactElement = await unified()
                .use(remarkParse) // markdown → mdast
                .use(remarkGfm) // GFM 지원
                .use(remarkRehype) // mdast → hast
                .use(rehypeReact, {
                    // hast → React Element
                    Fragment,
                    createElement,
                    jsx,
                    jsxs,
                    components: markdownElements,
                })
                .process(value)

            setMarkdown(reactElement.result as React.ReactElement)
        } catch {
            setMarkdown(
                <div className="p-4 text-red-500 border border-red-300 rounded bg-red-50">
                    마크다운 처리 중 오류가 발생했습니다.
                </div>,
            )
        }
    }, [value])

    useEffect(() => {
        renderMarkdown()
    }, [renderMarkdown])

    return markdown
}
