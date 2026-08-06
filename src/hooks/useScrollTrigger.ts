
import { useState, useEffect } from 'react'

export function useScrollTrigger(thresholdPercentage: number = 0.72, elementId?: string) {
    const [isTriggered, setIsTriggered] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (elementId) {
                const el = document.getElementById(elementId)
                if (el) {
                    const rect = el.getBoundingClientRect()
                    const windowHeight = window.innerHeight
                    // Trigger when the target section approaches or enters the viewport
                    if (rect.top <= windowHeight * 0.85) {
                        setIsTriggered(true)
                        return
                    }
                }
            }

            const scrollTop = window.scrollY
            const windowHeight = window.innerHeight
            const fullHeight = document.documentElement.scrollHeight

            // Fallback percentage trigger (72% scroll depth)
            if (scrollTop + windowHeight >= fullHeight * thresholdPercentage) {
                setIsTriggered(true)
            } else {
                setIsTriggered(false)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [thresholdPercentage, elementId])

    return isTriggered
}
