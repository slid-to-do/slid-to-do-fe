import React, {useState} from 'react'

import InputStyle from '@/components/style/input-style'

const LinkModal = ({onSetButton}: {onSetButton: (link: string) => void}) => {
    const [input, setInput] = useState('')

    const handleSubmit = () => {
        const url = /^https?:\/\//i.test(input) ? input : `https://${input}`
        onSetButton(url)
    }

    const enterkey = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] mobile:w-[311px] h-[272px] mobile:h-[268px] p-8 bg-white rounded-lg">
            <div className="text-subTitle">링크 업로드</div>
            <div className="text-body mt-6">링크</div>
            <InputStyle
                type="text"
                placeholder="링크를 입력해주세요"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className=""
                onKeyUp={enterkey}
            />
            <div className="mt-10 w-full">
                <button onClick={handleSubmit} className="px-[46px] py-3 bg-custom_blue-500 rounded-xl text-white ">
                    확인
                </button>
            </div>
        </div>
    )
}

export default LinkModal
