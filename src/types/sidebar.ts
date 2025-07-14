import type {useAnimationControls} from 'motion/react'

export type ControlsType = ReturnType<typeof useAnimationControls>

export interface ClientInterface {
    isClose: boolean
    controls: ControlsType
    setIsClose: React.Dispatch<React.SetStateAction<boolean>>
}
