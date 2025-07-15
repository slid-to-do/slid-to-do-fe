'use client'

import {useRouter} from 'next/navigation'

import {useForm} from 'react-hook-form'

import InputForm from '@/components/common/input-form'
import {useLogin} from '@/hooks/use-login'

import type {ApiError} from '@/types/api'
import type {LoginFormData} from '@/types/login'

const LoginPage = () => {
    const {login, loading} = useLogin()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<LoginFormData>()

    const onSubmit = async (data: LoginFormData) => {
        const {email, password} = data
        try {
            await login({email, password})
            alert('로그인에 성공했습니다!')
            router.push('/')
        } catch (error_: unknown) {
            const error = error_ as ApiError
            if (error.status === 400 || error.status === 404) {
                setError('email', {message: error.message})
            } else {
                alert('알 수 없는 오류가 발생했습니다.')
            }
        }
    }

    return (
        <InputForm<LoginFormData>
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
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
                        value: 8,
                        message: '비밀번호는 최소 8자 이상이어야 합니다.',
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
            submitText={loading ? '로그인 중...' : '로그인하기'}
            bottomText="처음이신가요?"
            bottomLink={{href: '/signup', text: '회원가입'}}
        />
    )
}

export default LoginPage
