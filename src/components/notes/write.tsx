'use client'

import MarkdownEditor from '../markdown-editor/markdown-editor'
import InputStyle from '../style/input-style'

const NoteWriteCompo = ({
    content,
    setContent,
    subject,
    setSubject,
}: {
    content: string
    setContent: (contents: string) => void
    subject: string
    setSubject: (contents: string) => void
}) => {
    const handleNoteChange = (html: string) => {
        setContent(html)
    }

    const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target
        setSubject(value)
    }
    return (
        <>
            <div className="border-t border-b">
                <InputStyle
                    type="text"
                    placeholder="노트의 제목을 적어주세요"
                    value={subject}
                    name="title"
                    onChange={handleInputUpdate}
                />
            </div>
            <div className="mt-3">
                <MarkdownEditor value={content} onUpdate={handleNoteChange} />
            </div>
        </>
    )
}

export default NoteWriteCompo
