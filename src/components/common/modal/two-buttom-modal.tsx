import React from 'react'

const TwoButtonModal = ({
    handleLeftBtn,
    handleRightBtn,
    topText,
    bottomText,
    buttonText,
}: {
    handleLeftBtn: () => void
    handleRightBtn: () => void
    topText: string
    bottomText: string
    buttonText: string
}) => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[216px] md:h-[200px] pt-12 md:pt-10 pb-8 flex flex-col items-center text-body bg-white rounded-lg">
            <p className="font-medium">{topText}</p>
            <p className="font-medium">{bottomText}</p>
            <div className="flex gap-2 mt-10 md:mt-8">
                <button
                    onClick={handleLeftBtn}
                    className="border border-custom_blue-500 rounded-xl w-[120px] py-2.5 text-custom_blue-500 font-semibold"
                >
                    취소
                </button>
                <button
                    onClick={handleRightBtn}
                    className="w-[120px] bg-custom_blue-500 rounded-xl text-white font-semibold"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    )
}

export default TwoButtonModal
