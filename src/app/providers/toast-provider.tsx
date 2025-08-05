// app/providers/toast-provider.tsx
'use client'

import {ToastContainer} from 'react-toastify'

export default function ToastProvider() {
    return (
        <ToastContainer position="top-center" toastClassName="center-toast" autoClose={3000} hideProgressBar={false} />
    )
}
