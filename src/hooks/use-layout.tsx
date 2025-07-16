'use client'
import {useState, useLayoutEffect} from 'react'

/**
 * @param size: 'mobile' | 'tablet' | 'desktop'
 * @returns
 *  초기값: "noState"
 *  boolean: "false", 'true'
 *  초기값: "noState"
 *
 * 사용법
 * const isTablet = useLayout('tablet')
 * const isDesktop = useLayout('desktop')
 * const isMobile = useLayout('mobile')
 *
 */

const useLayout = (size: 'mobile' | 'tablet' | 'desktop') => {
    const [isResponsive, setIsResponsive] = useState<boolean | 'noState'>('noState')

    useLayoutEffect(() => {
        const check = () => {
            if (size === 'mobile') setIsResponsive(window.innerWidth <= 374)
            else if (size === 'desktop') setIsResponsive(window.innerWidth > 774)
            else setIsResponsive(window.innerWidth <= 774 && window.innerWidth > 374)
        }
        check()

        window.addEventListener('resize', check)
        return () => {
            window.removeEventListener('resize', check)
        }
    }, [size])

    return isResponsive
}
export default useLayout
