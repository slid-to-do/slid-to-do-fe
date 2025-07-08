import {cva} from 'class-variance-authority'

import {cn} from './utils'

type ButtonInterface = React.ComponentProps<'button'> & {
    size?: 'default' | 'medium' | 'round_small' | 'small'
    color?: 'default' | 'outline'
}

const ButtonStyle = ({size = 'default', color = 'default', children, ...restButtonProperties}: ButtonInterface) => {
    const buttonVariants = cva('', {
        variants: {
            size: {
                default: 'w-80 h-12  max-sm:text-[12px] max-sm:w-16 max-sm:h-6 ',
                medium: 'w-36 h-12 max-sm:w-16 max-sm:h-6 max-sm:text-[12px]',
                small: 'w-16 h-6 text-[12px]',
                round_small: 'w-16 h-6 rounded-full text-[12px]',
            },
            color: {
                default:
                    'bg-custom_blue hover:bg-custom_blue-600 active:bg-custom_blue-800 disabled:bg-custom_slate-400 text-white',
                outline:
                    'bg-white text-custom_blue hover:text-custom_blue-600 active:text-custom_blue-800 disabled:text-custom_slate-400 ',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    })
    return (
        <button
            {...restButtonProperties}
            className={cn(
                buttonVariants({size, color}),
                ' flex justify-center items-center text-center  font-semibold rounded-md whitespace-nowrap ',
            )}
        >
            {children}
        </button>
    )
}

export default ButtonStyle
