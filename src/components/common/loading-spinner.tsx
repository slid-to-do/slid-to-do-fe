export default function LoadingSpinner() {
    return (
        <div className="sticky top-1/2 -translate-y-1/2 z-30 flex justify-center pointer-events-none w-screen h-screen">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
    )
}
