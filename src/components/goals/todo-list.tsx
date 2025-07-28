'use client'
import Image from 'next/image'

import LoadingSpinner from '@/components/common/loading-spinner'
import TodoItem from '@/components/common/todo-item'
import useModal from '@/hooks/use-modal'

import EditTodoModal from '../common/modal/edit-todo-modal'

import type {TodoResponse} from '@/types/todos'

export default function InfiniteTodoList({
    title,
    todos,
    isLoading,
    hasMore,
    isBlue,
    refCallback,
    onToggle,
    onDelete,
    onAddClick,
}: {
    title: string
    todos: TodoResponse[]
    isLoading: boolean
    hasMore: boolean
    isBlue?: boolean
    refCallback: (node?: Element | null) => void
    onToggle: (todoId: number, newDone: boolean) => void
    onDelete: (todoId: number) => void
    onAddClick?: () => void
}) {
    /**할일 수정 모달 */
    const {openModal: openEditTodoModal} = useModal((todoDetail: TodoResponse) => (
        <EditTodoModal todoDetail={todoDetail} />
    ))

    return (
        <div
            className={`py-4 px-6 h-[228px] rounded-xl flex flex-col min-h-0 lg:flex-1 ${
                isBlue ? 'bg-custom_blue-50' : title === 'To do' ? 'bg-white' : 'bg-custom_slate-200'
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="text-subTitle">{title}</div>
                {onAddClick && (
                    <div className="flex items-center">
                        <Image src="/goals/ic-plus.svg" alt="+" width={16} height={16} />
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
                                        <TodoItem
                                            todoDetail={todo}
                                            onToggle={onToggle}
                                            onDelete={onDelete}
                                            onEdit={() => openEditTodoModal(todo)}
                                            isGoal
                                        />
                                    </div>
                                ))}
                                {hasMore && <div ref={refCallback} style={{height: '1px'}} />}
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
