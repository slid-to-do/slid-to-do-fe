import React from 'react'

import Headers from './components/header-container'
import GoalTodoContainer from './components/goal-todo-container'

const DashBoard = () => {
    return (
        <section className="p-6 w-full desktop:px-20 text-black text-body-base">
            <h1 className="text-black text-title-base ">대시보드</h1>
            <Headers />
            <GoalTodoContainer />
        </section>
    )
}

export default DashBoard
