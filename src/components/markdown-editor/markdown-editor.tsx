'use client'
import Image from 'next/image'
import {useEffect, useState} from 'react'

import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const MarkdownEditor = ({
    value,
    onUpdate,
    className,
    linkButton,
    onSetLinkButton,
}: {
    value: string
    onUpdate: (content: string) => void
    className?: string
    linkButton?: string | undefined
    onSetLinkButton?: (link: string | undefined) => void
}) => {
    const [internalLink, setInternalLink] = useState(linkButton ?? '')

    useEffect(() => {
        setInternalLink(linkButton ?? '')
    }, [linkButton])

    const editorInstance = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: false,
                linkOnPaste: false,
            }),
            TextAlign.configure({types: ['heading', 'paragraph']}),
            Placeholder.configure({
                placeholder: '이 곳을 클릭해 노트 작성을 시작해주세요',
            }),
            CharacterCount.configure({
                textCounter: (text) => [...new Intl.Segmenter().segment(text)].length,
                wordCounter: (text) => text.split(/\s+/).filter((word) => word !== '').length,
            }),
        ],
        content: value || '',
        immediatelyRender: false,

        onUpdate: ({editor}) => {
            onUpdate(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose focus:outline-none',
            },
        },
    })

    if (!editorInstance) {
        return <div>Loading editor...</div>
    }

    return (
        <div className={`relative max-w-screen min-w-64 min-h-64 ${className}`}>
            <div className="text-xs font-medium">
                글자 수 : {editorInstance.storage.characterCount.characters()} | 단어 수 :{' '}
                {editorInstance.storage.characterCount.words()}
            </div>

            {internalLink && (
                <div className="mt-2 bg-custom_slate-200 p-1 rounded-full flex justify-between items-center">
                    <div className="flex items-end gap-2 flex-1 min-w-0  p-1 max-w-fit ">
                        <Image src="/markdown-editor/ic-save-link.svg" alt="링크아이콘" width={24} height={24} />
                        <a
                            href={internalLink}
                            target="_blank"
                            className="truncate whitespace-nowrap break-all text-ellipsis block text-body text-custom_slate-800"
                            rel="noreferrer"
                        >
                            {internalLink}
                        </a>
                    </div>
                    <button
                        onClick={() => {
                            setInternalLink('')
                            onSetLinkButton?.(undefined)
                        }}
                        className="shrink-0 ml-2"
                    >
                        <Image src="/todos/ic-delete.svg" alt="삭제" width={24} height={24} />
                    </button>
                </div>
            )}

            <div className="w-full mt-2 text-body text-custom_slate-700">
                <EditorContent editor={editorInstance} className="max-w-full" />
            </div>

            <Toolbar editorInstance={editorInstance} linkButton={linkButton} onSetLinkButton={onSetLinkButton} />
        </div>
    )
}

function Toolbar({
    editorInstance,
    linkButton,
    onSetLinkButton,
}: {
    editorInstance: ReturnType<typeof useEditor>
    linkButton?: string | undefined
    onSetLinkButton?: (link: string | undefined) => void
}) {
    return (
        <div className="absolute flex w-full gap-4 p-2 bg-white rounded-full shadow-sm -bottom-20 border-slate-200">
            <div className="flex gap-1">
                <button
                    onClick={() => editorInstance?.chain().focus().toggleBold().run()}
                    className={`rounded-full hover:bg-blue-500 size-6 transition ${editorInstance?.isActive('bold') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-bold.svg" alt="Bold" width={24} height={24} />
                </button>
                <button
                    onClick={() => editorInstance?.chain().focus().toggleItalic().run()}
                    className={`rounded-full hover:bg-blue-500 size-6 font-bold transition ${editorInstance?.isActive('italic') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-italic.svg" alt="Italic" width={24} height={24} />
                </button>
                <button
                    onClick={() => editorInstance?.chain().focus().toggleUnderline().run()}
                    className={`rounded-full hover:bg-blue-500 size-6 font-bold transition ${editorInstance?.isActive('underline') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-underline.svg" alt="Underline" width={24} height={24} />
                </button>
            </div>

            <div className="flex gap-1">
                <button
                    onClick={() => editorInstance?.chain().focus().toggleTextAlign('left').run()}
                    className={`rounded-full hover:bg-blue-500 size-6 font-bold transition ${editorInstance?.isActive('left') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-align-left.svg" alt="Left Align" width={24} height={24} />
                </button>
                <button
                    onClick={() => editorInstance?.chain().focus().toggleTextAlign('center').run()}
                    className={`rounded-full hover:bg-blue-500 size-6 font-bold transition ${editorInstance?.isActive('center') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-align-center.svg" alt="Center Align" width={24} height={24} />
                </button>
                <button
                    onClick={() => editorInstance?.chain().focus().toggleTextAlign('right').run()}
                    className={`rounded-full hover:bg-blue-500 size-6 font-bold transition ${editorInstance?.isActive('right') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-align-right.svg" alt="Right Align" width={24} height={24} />
                </button>
            </div>

            <div className="flex gap-1">
                <button
                    onClick={() => editorInstance?.chain().focus().toggleBulletList().run()}
                    className={`rounded-full hover:bg-blue-500 size-6 font-bold transition ${editorInstance?.isActive('bulletList') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-bullet-list.svg" alt="Bullet List" width={24} height={24} />
                </button>
                <button
                    onClick={() => editorInstance?.chain().focus().toggleOrderedList().run()}
                    className={`rounded-full hover:bg-blue-500 size-6 font-bold transition ${editorInstance?.isActive('orderedList') ? 'bg-blue-500' : 'bg-white'}`}
                >
                    <Image src="/markdown-editor/ic-ordered-list.svg" alt="Ordered List" width={24} height={24} />
                </button>
            </div>

            {!linkButton && (
                <button
                    onClick={() => {
                        let url = prompt('링크 주소 입력')
                        if (!url) return

                        if (!/^https?:\/\//i.test(url)) {
                            url = 'https://' + url
                        }
                        onSetLinkButton?.(url)
                    }}
                    className="rounded-full hover:bg-blue-500 size-6 font-bold transition bg-white"
                >
                    <Image src="/markdown-editor/ic-link.svg" alt="Link Button" width={24} height={24} />
                </button>
            )}
        </div>
    )
}

export default MarkdownEditor
