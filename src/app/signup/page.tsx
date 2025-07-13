'use client'

import clsx from 'clsx'
import InputStyle from '@/components/style/input-style'

const SignPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <img src="/common/img-logo.svg" alt="Logo" className="h-15 mb-2" />
            <form className="w-full max-w-xl flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <label className="text-custom_slate-800 font-semibold">이름</label>
                    <InputStyle type="text" placeholder={'이름을 입력해주세요'} />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-custom_slate-800 font-semibold">이메일</label>
                    <InputStyle type="text" placeholder={'이메일을 입력해주세요'} />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-custom_slate-800 font-semibold">비밀번호</label>
                    <InputStyle type="password" placeholder={'비밀번호를 입력해주세요'} />
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-custom_slate-800 font-semibold">비밀번호 확인</label>
                    <InputStyle type="password" placeholder={'비밀번호를 입력해주세요'} />
                </div>
                <button
                    type="submit"
                    className={clsx(
                        'w-full py-2  mt-6 rounded-md text-white font-semibold',
                        'bg-custom_slate-400 hover:bg-custom_slate-500 transition-colors',
                    )}
                >
                    회원가입하기
                </button>
            </form>
            <div className="mt-6 text-sm text-custom_slate-800">
                이미 회원이신가요?{' '}
                <a href="/login" className="text-blue-500 underline">
                    로그인
                </a>
            </div>
        </div>
    )
}

export default SignPage
