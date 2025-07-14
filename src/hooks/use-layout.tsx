'use client'
import {useState, useLayoutEffect} from 'react'

const useLayout = (size: 'mobile' | 'tablet') => {
    const [isResponsive, setIsResponsive] = useState<boolean>(false)

    useLayoutEffect(() => {
        const check = () => {
            if (size === 'mobile') setIsResponsive(window.innerWidth <= 374.5)
            else setIsResponsive(window.innerWidth <= 774 && window.innerWidth > 374.5)
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
