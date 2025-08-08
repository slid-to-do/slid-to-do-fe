'use client'

import {useRouter} from 'next/navigation'

import {useForm} from 'react-hook-form'

import InputForm from '@/components/common/input-form'
import {useCustomMutation} from '@/hooks/use-custom-mutation'
import useToast from '@/hooks/use-toast'

import {loginApi} from '@/lib/auth/login-api'

import type {ApiError} from '@/types/api'
import type {LoginFormData} from '@/types/login'

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<LoginFormData>()

    const router = useRouter()
    const {showToast} = useToast()

    const {mutate, isPending: loading} = useCustomMutation<void, ApiError, LoginFormData>(loginApi, {
        setError,
        errorDisplayType: 'form',
        onError: (error) => {
            if (error.status === 404) {
                showToast('로그인에 실패했습니다!', {type: 'error'})
                return [{name: 'email', message: error.message}]
            }
            if (error.status === 400) {
                showToast('로그인에 실패했습니다!', {type: 'error'})
                return [{name: 'password', message: error.message}]
            }
            if (error.status === 401) {
                showToast(error.message, {type: 'error'})
                return [{name: 'password', message: error.message}]
            }
            return []
        },

        onSuccess: () => {
            showToast('로그인에 성공했습니다!', {type: 'success'})
            router.push('/dashboard')
        },
    })

    const onSubmit = (data: LoginFormData) => {
        mutate(data)
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
