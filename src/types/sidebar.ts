import type {useAnimationControls} from 'motion/react'

export type ControlsType = ReturnType<typeof useAnimationControls>

export interface ClientInterface {
    isOpen: boolean
    controls: ControlsType

    onClickHandler: () => void
}
