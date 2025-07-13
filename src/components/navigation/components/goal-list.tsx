'use client'

import Image from 'next/image'
import React from 'react'

import ButtonStyle from '../../style/button-style'

const GoalList = ({isMobile}: {isMobile: boolean}) => {
    return (
        <section
            aria-labelledby="goals-heading"
            className=" border-[#E2E8F0] h-full flex flex-col justify-between mt-4"
        >
            <div className="flex flex-col ">
                <div className="flex  pl-2 gap-3">
                    <Image src={'./sidebar/flag.svg'} alt="flag" width={13} height={15} />
                    <h2 id="goals-heading" className=" text-left w-full   text-subTitle-base   text-custom_slate-700">
                        목표
                    </h2>

                    {isMobile && (
                        <ButtonStyle type="button" onClick={() => false} size="small" color="outline">
                            + 새 목표
                        </ButtonStyle>
                    )}
                </div>
                <ul className=" p-4  flex flex-col space-y-4 overflow-y-scroll max-h-106 max-sm:h-full    ">
                    {[1, 2, 3, 41, 1, 1, 1, 41, 1, 1, 1, 41, 1, 1, 1, 41, 1, 1, 1, 41, 1, 1, 1].map((item, key) => {
                        return (
                            <li className=" flex  items-center whitespace-nowrap cursor-pointer group" key={key}>
                                <span className=" text-custom_slate-700 text-body mr-1 group-hover:opacity-70">・</span>
                                <span className="text-custom_slate-700 text-body-sm tracking-tight truncate group-hover:opacity-70">
                                    {'페이스북 팔로워 1만 달성하기 웹 서비스 만들기'}
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {!isMobile && (
                <ButtonStyle type="button" onClick={() => false} size="full" color="outline">
                    + 새 목표
                </ButtonStyle>
            )}
        </section>
    )
}

export default GoalList
