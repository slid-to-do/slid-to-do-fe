import React from 'react'

import GoalTodoContainer from './components/body/goal-todo-container'
import Headers from './components/header/header-container'

const DashBoardPage = () => {
    return (
        <section className=" w-full text-black text-body-base overflow-x-hidden overflow-y-auto   bg-slate-100">
            <div className=" w-full h-auto desktop-layout">
                <h1 className="text-black text-title-base mb-4 ">대시보드</h1>
                <Headers />
                <GoalTodoContainer />
            </div>
        </section>
    )
}

export default DashBoardPage
