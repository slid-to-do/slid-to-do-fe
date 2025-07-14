'use client'

import InputForm from '@/components/common/InputForm'

const LoginPage = () => {
    return (
        <InputForm
            fields={[
                {label: '아이디', type: 'text', placeholder: '이메일을 입력해주세요'},
                {label: '비밀번호', type: 'password', placeholder: '비밀번호를 입력해주세요'},
            ]}
            submitText="로그인하기"
            bottomText="슬리드 투 두가 처음이신가요?"
            bottomLink={{href: '/signup', text: '회원가입'}}
        />
    )
}

export default LoginPage
