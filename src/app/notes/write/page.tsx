import Image from 'next/image'

import NoteEditCompo from '@/components/notes/edit'
import NoteWriteCompo from '@/components/notes/write'

const NoteWritePage = async ({searchParams}: {searchParams: Promise<{noteId?: string}>}) => {
    const {noteId} = await searchParams
    const isEdit = typeof noteId === 'string'

    return (
        <div className="flex flex-col max-w-[792px] min-h-screen pt-6 pr-6 pb-6 pl-20">
            <h1 className="text-subTitle text-custom_slate-900">{isEdit ? '노트 수정' : '노트 작성'}</h1>
            <div>
                <Image src="/goals/flag-goal.svg" alt="목표깃발" width={24} height={24} />
              <h2 className="text-subTitle-sm">원래는 notesData?.[0]?.goal.title을 받아 나타나야 함</h2>
            </div>
            <div className="pt-3 flex items-center gap-2">
                <div className="p-1 bg-custom_slate-100 text-custom_slate-700 text-subBody font-medium rounded-sm">
                    <p>To do</p>
                </div>
               <p className=" text-custom_slate-700 text-subBody font-normal"> 원래는 note.todo.title을 받아 나타나야함</p> 
            </div>
            {isEdit ? <NoteEditCompo noteId={noteId!} /> : <NoteWriteCompo />}
        </div>
    )
}

export default NoteWritePage
