'use client'

import InputForm from '@/components/common/InputForm'

const SignPage = () => {
    return (
        <InputForm
            fields={[
                {label: '이름', type: 'text', placeholder: '이름을 입력해주세요'},
                {label: '이메일', type: 'text', placeholder: '이메일을 입력해주세요'},
                {label: '비밀번호', type: 'password', placeholder: '비밀번호를 입력해주세요'},
                {label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 입력해주세요'},
            ]}
            submitText="회원가입하기"
            bottomText="이미 회원이신가요?"
            bottomLink={{href: '/login', text: '로그인'}}
        />
    )
}

export default SignPage
