'use client'

import LoadingSpinner from '@/components/common/loading-spinner'
import TodoItem from '@/components/common/todo-item'

import type {TodoResponse} from '@/types/todos'

const TodoList = ({
    title,
    todos,
    isLoading,
    hasMore,
    refCallback,
    onToggle,
    onDelete,
}: {
    title: string
    todos: TodoResponse[]
    isLoading: boolean
    hasMore: boolean
    refCallback: (node?: Element | null) => void
    onToggle: (todoId: number, newDone: boolean) => void
    onDelete: (todoId: number) => void
}) => {
    return (
        <div className=" bg-blue-50 py-4 px-6 h-[228px] flex flex-col min-h-0 lg:flex-1">
            <h1 className="text-subTitle">{title}</h1>
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

export default TodoList
