'use client'
import Image from 'next/image'

import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const MarkdownEditor = ({
    value,
    onUpdate,
    className,
}: {
    value: string
    onUpdate: (content: string) => void
    className?: string
}) => {
    const editorInstance = useEditor({
        extensions: [
            StarterKit,
            Underline,
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
        <div className={`relative min-h-64 min-w-64 ${className}`}>
            <div className="text-xs font-medium">
                글자 수 : {editorInstance.storage.characterCount.characters()} | 단어 수 :{' '}
                {editorInstance.storage.characterCount.words()}
            </div>
            <EditorContent editor={editorInstance} />
            <Toolbar editorInstance={editorInstance} />
        </div>
    )
}

function Toolbar({editorInstance}: {editorInstance: ReturnType<typeof useEditor>}) {
    return (
        <div className="absolute flex w-full gap-4 p-2 bg-white rounded-full shadow-sm bottom-4 border-slate-200">
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
        </div>
    )
}

export default MarkdownEditor
