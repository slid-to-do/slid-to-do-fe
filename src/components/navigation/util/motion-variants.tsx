export const disappearAnimation = {
    open: {
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

        transition: {
            duration: 0.3,
        },
    },
    close: {
        width: 50,
        transition: {
            duration: 0.3,
        },
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
}
