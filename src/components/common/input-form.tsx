'use client'

import Image from 'next/image'
import React from 'react'

import clsx from 'clsx'

import InputStyle from '../style/input-style'

import type {InputFormProperties} from '@/types/login'

const InputForm = <T extends Record<string, unknown>>({
    fields,
    submitText,
    bottomText,
    bottomLink,
    register,
    errors,
    handleSubmit,
    onSubmit,
    validationRules,
}: InputFormProperties<T>) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <div className="relative w-[240px] h-[48px] mb-2">
                <Image src="/common/img-logo.svg" alt="Logo" fill className="object-contain" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl flex flex-col gap-6">
                {fields.map((field, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <label className="text-custom_slate-800 font-semibold">{field.label}</label>
                        <InputStyle
                            type={field.type}
                            placeholder={field.placeholder}
                            {...register(field.name, validationRules?.[field.name])}
                            className={clsx('w-full', errors?.[field.name] && 'border border-red-500')}
                        />
                        {errors?.[field.name] && (
                            <span className="text-sm text-red-500 mt-1">{errors[field.name]?.message as string}</span>
                        )}
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
