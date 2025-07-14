export const disappearAnimation = {
    open: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    mobile: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    close: {
        opacity: 0,

        transition: {
            duration: 0.2,
        },
    },
}

export const widthAnimation = {
    open: {
        width: 256,
        height: '100vh',
        transition: {
            duration: 0.3,
        },
    },
    close: {
        width: 50,
        height: '100vh',
        transition: {
            duration: 0.3,
        },
    },
    mobile: {
        width: '100vw',
        height: '40px',
    },
    mobileClose: {
        width: '100vw',
        height: '100vh',
    },
}

export const buttonAnimation = {
    open: {
        rotate: 180,
        x: 0,
        y: 0,

        transitiion: {
            duration: 0.3,
            delay: 0.25,
        },
    },

    close: {
        rotate: 0,
        x: -28,
        y: 40,

        transitiion: {
            duration: 0.3,
            delay: 0,
        },
    },

    mobileOpen: {
        rotate: 180,
        x: 0,
        y: 0,

        transitiion: {
            duration: 0.3,
            delay: 0.25,
        },
    },

    mobileClose: {
        rotate: 0,
        x: -28,
        y: 40,

        transitiion: {
            duration: 0.3,
            delay: 0,
        },
    },
}
