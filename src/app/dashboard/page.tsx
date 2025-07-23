import React from 'react'

import GoalTodoContainer from './components/body/goal-todo-container'
import Headers from './components/header/header-container'

const DashBoard = () => {
    return (
        <section className="p-6 w-full desktop:px-20 text-black text-body-base overflow-y-auto bg-slate-100">
            <h1 className="text-black text-title-base mb-4 ">대시보드</h1>
            <Headers />
            <GoalTodoContainer />
        </section>
    )
}

export default DashBoard
