'use client'

import LoadingSpinner from '@/components/common/loading-spinner'
import EditTodoModal from '@/components/common/modal/edit-todo-modal'
import TodoItem from '@/components/common/todo-item'
import useModal from '@/hooks/use-modal'

import type {TodoResponse} from '@/types/todos'

const TodoList = ({
    title,
    todos,
    isLoading,
    onToggle,
    onDelete,
}: {
    title: string
    todos: TodoResponse[]
    isLoading: boolean
    onToggle: (todoId: number, newDone: boolean) => void
    onDelete: (todoId: number) => void
}) => {
    const {openModal: openEditTodoModal} = useModal((todoDetail: TodoResponse) => (
        <EditTodoModal todoDetail={todoDetail} />
    ))
    return (
        <div className="bg-blue-50 py-4 px-6 min-h-[228px]  flex flex-col  lg:flex-1">
            <h1 className="text-subTitle">{title}</h1>
            <div className="mt-4 flex-1 min-h-0 scrollbar-custom">
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
                                        />
                                    </div>
                                ))}
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
