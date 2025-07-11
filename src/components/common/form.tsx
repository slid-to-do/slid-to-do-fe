'use client'

import React from 'react'
import clsx from 'clsx'
import InputStyle from '../style/input-style'

interface FormProps {
    label: string
    inputPlaceholder: string
    className?: string
}

const Form: React.FC<FormProps> = ({label, inputPlaceholder, className}) => {
    return (
        <div className={clsx('flex flex-col gap-3', className)}>
            <label className="text-custom_slate-800 font-semibold">{label}</label>
            <InputStyle placeholder={inputPlaceholder} />
        </div>
    )
}

export default Form
