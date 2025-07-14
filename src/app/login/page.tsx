'use client'

import InputForm from '@/components/common/input-form'
import {useLogin} from '@/hooks/use-login'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm()
    const {login, loading, error} = useLogin()
    const router = useRouter()

    const onSubmit = async (data: any) => {
        const {email, password} = data
        try {
            await login({email, password})
            alert('로그인에 성공했습니다!')
            router.push('/')
        } catch (e: any) {
            if (e.status === 400) {
                setError('email', {message: e.message})
            } else if (e.status === 404) {
                setError('email', {message: e.message})
            }
        }
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
