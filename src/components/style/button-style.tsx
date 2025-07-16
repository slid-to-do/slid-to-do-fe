import {cva} from 'class-variance-authority'

import {cn} from './utils'

type ButtonInterface = React.ComponentProps<'button'> & {
    size?: 'default' | 'medium' | 'round_small' | 'small' | 'full' | 'width_full'
    color?: 'default' | 'outline'
    className?: string
}

const ButtonStyle = ({
    size = 'default',
    color = 'default',
    children,
    className,
    ...restButtonProperties
}: ButtonInterface) => {
    const buttonVariants = cva('', {
        variants: {
            size: {
                default: 'w-80 h-12  max-sm:text-[12px] max-sm:w-16 max-sm:h-6 rounded-md',
                medium: 'w-36 h-12 max-sm:w-16 max-sm:h-6 max-sm:text-[12px] rounded-md',
                small: 'w-16 h-6 text-[12px] min-w-16 rounded-md',
                full: 'w-full h-12 min-h-12 rounded-xl',
                width_full: 'w-full h-6 rounded-md text-[12px] ',
                round_small: 'w-16 h-6 min-w-16 rounded-full text-[12px] ',
            },
            color: {
                default:
                    'bg-custom_blue hover:bg-custom_blue-600 active:bg-custom_blue-800 disabled:bg-custom_slate-400 text-white',
                outline:
                    'bg-white border text-custom_blue hover:text-custom_blue-600 active:text-custom_blue-800 disabled:text-custom_slate-400 ',
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
                className,
                ` flex justify-center items-center text-center  font-semibold  whitespace-nowrap `,
            )}
        >
            {children}
        </button>
    )
}

export default ButtonStyle
