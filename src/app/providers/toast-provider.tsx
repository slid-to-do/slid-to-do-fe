// app/providers/toast-provider.tsx
'use client'

import {ToastContainer} from 'react-toastify'

const ToastProvider = () => {
    return (
        <ToastContainer
            position="top-center"
            toastClassName="custom-toast"
            theme="dark"
            autoClose={3000}
            hideProgressBar={false}
            limit={1}
        />
    )
}

export default ToastProvider
