'use client'

import React from 'react'
import clsx from 'clsx'
import InputStyle from '../style/input-style'
import type {FormProps} from '@/types/login'

const InputForm: React.FC<FormProps> = ({fields, submitText, bottomText, bottomLink}) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <img src="/common/img-logo.svg" alt="Logo" className="h-15 mb-2" />
            <form className="w-full max-w-xl flex flex-col gap-6">
                {fields.map((field, index) => (
                    <div key={index} className="flex flex-col gap-3">
                        <label className="text-custom_slate-800 font-semibold">{field.label}</label>
                        <InputStyle type={field.type} placeholder={field.placeholder} className="w-full" />
                    </div>
                ))}
                <button
                    type="submit"
                    className={clsx(
                        'w-full py-2 mt-6 rounded-md text-white font-semibold',
                        'bg-custom_slate-400 hover:bg-custom_slate-500 transition-colors',
                    )}
                >
                    {submitText}
                </button>
            </form>
            <div className="mt-6 text-sm text-custom_slate-800">
                {bottomText}{' '}
                <a href={bottomLink?.href} className="text-blue-500 underline">
                    {bottomLink?.text}
                </a>
            </div>
        </div>
    )
}

export default InputForm
