export function useSidebarToggle(isOpen: boolean | 'noState') {
    if (isOpen === 'noState') {
        return 'w-64 tablet:w-12 mobile:w-screen mobile:h-10'
    } else if (isOpen) {
        return 'w-64 animate-sidebar-open mobile:animate-mobile-open mobile:fixed'
    } else {
        return 'w-12 animate-sidebar-close mobile:animate-mobile-close'
    }
}
