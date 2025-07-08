'use client'

import useMarkdown from '@/hooks/use-markdown'

export default function MarkdownEditor(properties: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const markdown = useMarkdown((properties.value as string) || '')

    return (
        <div className="grid w-full h-full grid-cols-2 gap-4 p-4 border min-h-96">
            <textarea {...properties} className="flex-1 p-4 border" />
            <div className="flex-1 p-4 overflow-auto border">
                {properties.value === '' ? (
                    <div className="text-gray-500">
                        마크다운을 입력하세요.
                        <br />
                        예시: **굵게**, *기울임*, `코드`, [링크](https://example.com)
                    </div>
                ) : (
                    markdown
                )}
            </div>
        </div>
    )
}
