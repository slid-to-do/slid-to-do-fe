// app/providers/toast-provider.tsx
'use client'

import {ToastContainer} from 'react-toastify'

export default function ToastProvider() {
    return (
        <ToastContainer
            position="top-center"
            toastClassName="custom-toast"
            autoClose={3000}
            hideProgressBar={false}
            limit={1}
        />
    )
}
