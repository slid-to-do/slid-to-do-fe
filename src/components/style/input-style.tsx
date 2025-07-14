import React from 'react'

import {cva} from 'class-variance-authority'

import {cn} from './utils'

type InputInterface = React.ComponentProps<'input'> & {
    state?: 'default' | 'error' | 'blue'
    custom_size?: 'default' | 'medium'
    placeholder: string
}

const InputStyle = React.forwardRef<HTMLInputElement, InputInterface>(function InputStyle(
    {placeholder, state = 'default', custom_size = 'default', ...restInputProperties},
    reference,
) {
    const inputVariants = cva('', {
        variants: {
            state: {
                default: ' border-transparent ',
                blue: 'border-custom_blue-300 border-1',
                error: 'border-red-700 border-2',
            },
            custom_size: {
                default: 'w-full',
                medium: 'w-80',
            },
        },
        defaultVariants: {
            state: 'default',
            custom_size: 'default',
        },
    })

    return (
        <input
            {...restInputProperties}
            ref={reference}
            className={cn(
                inputVariants({state, custom_size}),
                ' px-6 py-3 border placeholder:text-slate-400 text-black bg-slate-50 disabled:text-slate-400  rounded-md  outline-none ',
            )}
            placeholder={placeholder}
        />
    )
})

export default InputStyle
