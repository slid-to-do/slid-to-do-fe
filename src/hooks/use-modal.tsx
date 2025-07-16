'use client'

import {useEffect, useRef, type JSX} from 'react'

import {motion, type MotionProps} from 'motion/react'

import {useModalStore} from '@/store/use-modal-store'
/**
 * 모달 애니메이션 타입 정의
 */
type ModalAnimationType =
    | 'fadeAndScale'
    | 'slideFromRight'
    | 'slideFromLeft'
    | 'slideFromTop'
    | 'slideFromBottom'
    | 'none'

/**
 * 배경 애니메이션 타입 정의
 */
type BackdropAnimationType = 'fade' | 'none'

/**
 * 모달 옵션 설정
 */
interface UseModalOptions {
    /** ESC 키로 모달 닫기 활성화 여부 (기본값: true) */
    closeOnEscape?: boolean
    /** 모달 외부 클릭으로 닫기 활성화 여부 (기본값: true) */
    closeOnClickOutside?: boolean
    /** 배경 어둠 처리 활성화 여부 (기본값: true) */
    backdrop?: boolean
    /** 배경 애니메이션 타입 (기본값: 'fade') */
    backdropAnimation?: BackdropAnimationType
    /** 모달 애니메이션 타입 (기본값: 'fadeAndScale') */
    modalAnimation?: ModalAnimationType
}

/**
 * useModal 훅의 반환 값
 */
interface UseModalReturn<T> {
    /** 모달을 여는 함수 */
    openModal: (properties?: T) => void
    /** 모달을 닫는 함수 */
    closeModal: () => void
}

/**
 * 애니메이션 속성 객체 타입
 */
type AnimationProperties = Pick<MotionProps, 'initial' | 'animate' | 'exit' | 'transition'>

/**
 * 모달 관리를 위한 커스텀 훅
 *
 * @template T - 모달에 전달할 props의 타입
 * @param modal - 렌더링할 JSX 요소 또는 props를 받는 함수
 * @param options - 모달 동작 옵션 설정
 * @returns 모달 열기/닫기 함수들
 *
 * @example
 * ```tsx
 * // 정적 모달
 * const {openModal, closeModal} = useModal(<MyModal />)
 *
 * // 동적 모달 (props 전달)
 * const {openModal} = useModal<{count: number}>((props) => <MyModal count={props.count} />)
 * openModal({count: 5})
 *
 * // 옵션 설정
 * const {openModal} = useModal(<MyModal />, {
 *   modalAnimation: 'slideFromRight',
 *   closeOnEscape: false
 * })
 * ```
 */
export const useModal = <T = unknown,>(
    modal: JSX.Element | ((properties: T) => JSX.Element),
    options?: UseModalOptions,
): UseModalReturn<T> => {
    const {currentModal, setModal, clearModal} = useModalStore()

    // 기본값 설정
    const {
        closeOnEscape = true,
        closeOnClickOutside = true,
        backdrop = true,
        backdropAnimation = 'fade',
        modalAnimation = 'fadeAndScale',
    } = options ?? {}

    const modalReference = useRef<HTMLDivElement>(null)

    /**
     * 모달 애니메이션 속성을 반환하는 함수
     */
    const getModalAnimationProperties = (): AnimationProperties => {
        switch (modalAnimation) {
            case 'fadeAndScale': {
                return {
                    initial: {opacity: 0, scale: 0.8},
                    animate: {opacity: 1, scale: 1},
                    exit: {opacity: 0, scale: 0.8},
                }
            }

            case 'slideFromRight': {
                return {
                    initial: {x: '100%'},
                    animate: {x: '0%'},
                    exit: {x: '100%'},
                }
            }

            case 'slideFromLeft': {
                return {
                    initial: {x: '-100%'},
                    animate: {x: '0%'},
                    exit: {x: '-100%'},
                }
            }

            case 'slideFromTop': {
                return {
                    initial: {y: '-100%'},
                    animate: {y: '0%'},
                    exit: {y: '-100%'},
                }
            }

            case 'slideFromBottom': {
                return {
                    initial: {y: '100%'},
                    animate: {y: '0%'},
                    exit: {y: '100%'},
                }
            }

            default: {
                return {}
            }
        }
    }

    /**
     * 배경 애니메이션 속성을 반환하는 함수
     */
    const getBackdropAnimationProperties = (): AnimationProperties => {
        if (backdropAnimation === 'fade') {
            return {
                initial: {opacity: 0},
                animate: {opacity: 1},
                exit: {opacity: 0},
                transition: {type: 'spring', damping: 25, stiffness: 300},
            }
        }
        return {}
    }

    // 키보드 및 마우스 이벤트 핸들러 등록
    useEffect(() => {
        const eventHandlers: [string, EventListener][] = []

        if (closeOnEscape) {
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    clearModal()
                }
            }
            eventHandlers.push(['keydown', handleEscape as EventListener])
        }

        if (closeOnClickOutside) {
            const handleClickOutside = (event: MouseEvent) => {
                if (modalReference.current && !modalReference.current.contains(event.target as Node)) {
                    clearModal()
                }
            }
            eventHandlers.push(['mousedown', handleClickOutside as EventListener])
        }

        // 이벤트 리스너 등록
        for (const [event, handler] of eventHandlers) {
            document.addEventListener(event, handler)
        }

        // 클린업
        return () => {
            for (const [event, handler] of eventHandlers) {
                document.removeEventListener(event, handler)
            }
        }
    }, [closeOnEscape, closeOnClickOutside, clearModal])

    // body 스크롤 제어
    useEffect(() => {
        document.body.style.overflow = currentModal ? 'hidden' : 'visible'

        return () => {
            document.body.style.overflow = 'visible'
        }
    }, [currentModal])

    /**
     * 모달을 여는 함수
     * @param properties - 모달 컴포넌트에 전달할 props
     */
    const openModal = (properties?: T): void => {
        const modalContent = typeof modal === 'function' ? modal(properties as T) : modal

        const backdropProperties = getBackdropAnimationProperties()
        const modalProperties = getModalAnimationProperties()

        if (backdrop) {
            setModal(
                <motion.div
                    {...backdropProperties}
                    className="fixed inset-0 bg-black/50 z-50"
                    transition={{ease: 'easeOut', duration: 0.3}}
                >
                    <motion.div
                        {...modalProperties}
                        className="fixed inset-0 z-50"
                        transition={{ease: 'easeOut', duration: 0.3}}
                    >
                        <div ref={modalReference}>{modalContent}</div>
                    </motion.div>
                </motion.div>,
            )
        } else {
            setModal(
                <motion.div
                    {...modalProperties}
                    className="fixed inset-0 z-50"
                    transition={{ease: 'easeOut', duration: 0.3}}
                >
                    <div ref={modalReference}>{modalContent}</div>
                </motion.div>,
            )
        }
    }

    /**
     * 모달을 닫는 함수
     */
    const closeModal = (): void => {
        clearModal()
    }

    return {openModal, closeModal}
}

export default useModal
