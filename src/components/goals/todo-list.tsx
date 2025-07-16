'use client'
import Image from 'next/image'

import LoadingSpinner from '@/components/common/loading-spinner'
import TodoItem from '@/components/common/todo-item'

import type {TodoResponse} from '@/types/todos'

export default function InfiniteTodoList({
    title,
    todos,
    isLoading,
    hasMore,
    refCallback,
    onToggle,
    onDelete,
    onAddClick,
}: {
    title: string
    todos: TodoResponse[]
    isLoading: boolean
    hasMore: boolean
    refCallback: (node?: Element | null) => void
    onToggle: (todoId: number, newDone: boolean) => void
    onDelete: (todoId: number) => void
    onAddClick?: () => void
}) {
    return (
        <div className="py-4 px-6 h-[228px] bg-white rounded-xl flex flex-col min-h-0 lg:flex-1">
            <div className="flex items-center justify-between">
                <div className="text-subTitle">{title}</div>
                {onAddClick && (
                    <div className="flex items-center">
                        <Image src="/goals/ic_plus.svg" alt="+" width={16} height={16} />
                        <div className="text-custom_blue-500 text-sm font-semibold cursor-pointer" onClick={onAddClick}>
                            할일 추가
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 flex-1 min-h-0 overflow-y-auto scrollbar-custom">
                {todos.length > 0 ? (
                    <>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {todos.map((todo) => (
                                    <div key={`todoList_${todo.id}`} className="mb-2">
                                        <TodoItem todoDetail={todo} onToggle={onToggle} onDelete={onDelete} />
                                    </div>
                                ))}
                                {hasMore && <div ref={refCallback} />}
                                {!hasMore && (
                                    <div className="mt-4 text-gray-400 text-sm">모든 할일을 다 불러왔어요</div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center text-sm text-custom_slate-500 text-center h-[120px]">
                        {title === 'To do' ? '해야할 일이 아직 없어요' : '다 한 일이 아직 없어요'}
                    </div>
                )}
            </div>
        </div>
    )
}
