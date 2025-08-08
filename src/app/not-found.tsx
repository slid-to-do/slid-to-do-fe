import Image from 'next/image'

export default function NotFound() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="relative w-[70%] h-[70vh]">
                <Image src="/not-found/not-found.svg" layout="fill" alt="404-error" className="object-contain" />
            </div>
        </div>
    )
}
