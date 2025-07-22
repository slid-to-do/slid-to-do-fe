import Image from 'next/image'
import React, {useState} from 'react'

import {cva} from 'class-variance-authority'

import {cn} from './utils'

type InputInterface = React.ComponentProps<'input'> & {
    state?: 'default' | 'error' | 'blue'
    custom_size?: 'default' | 'medium'
    placeholder: string
    type: string
    className: string
}

const InputStyle = React.forwardRef<HTMLInputElement, InputInterface>(function InputStyle(
    {placeholder, state = 'default', custom_size = 'default', type = 'text', className, ...restInputProperties},
    reference,
) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

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
        <div className={cn('relative', inputVariants({state, custom_size}))}>
            <input
                {...restInputProperties}
                ref={reference}
                type={isPassword && showPassword ? 'text' : type}
                className={cn(
                    'w-full px-6 py-3 border placeholder:text-slate-400 text-black bg-slate-50 disabled:text-slate-400 rounded-md outline-none pr-12',
                    inputVariants({state, custom_size}),
                    className,
                )}
                placeholder={placeholder}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                    {showPassword ? (
                        <Image src="/input/ic-eye-on.svg" alt="비밀번호 보기" width={20} height={20} />
                    ) : (
                        <Image src="/input/ic-eye-off.svg" alt="비밀번호 숨기기" width={20} height={20} />
                    )}
                </button>
            )}
        </div>
    )
})

export default InputStyle
