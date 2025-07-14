'use client'

import InputForm from '@/components/common/InputForm'
import {useForm} from 'react-hook-form'

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()

    const onSubmit = (data: any) => {
        console.log('로그인 요청:', data)
    }

    return (
        <InputForm
            onSubmit={handleSubmit(onSubmit)}
            register={register}
            errors={errors}
            validationRules={{
                email: {
                    required: '이메일은 필수입니다.',
                    pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: '이메일 형식이 올바르지 않습니다.',
                    },
                },
                password: {
                    required: '비밀번호는 필수입니다.',
                    minLength: {
                        value: 6,
                        message: '비밀번호는 최소 6자 이상이어야 합니다.',
                    },
                },
            }}
            fields={[
                {
                    name: 'email',
                    label: '아이디',
                    type: 'text',
                    placeholder: '이메일을 입력해주세요',
                },
                {
                    name: 'password',
                    label: '비밀번호',
                    type: 'password',
                    placeholder: '비밀번호를 입력해주세요',
                },
            ]}
            submitText="로그인하기"
            bottomText="처음이신가요?"
            bottomLink={{href: '/signup', text: '회원가입'}}
        />
    )
}

export default LoginPage
