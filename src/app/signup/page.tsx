'use client'

import InputForm from '@/components/common/input-form'
import {useForm} from 'react-hook-form'
import {useSignup} from '@/hooks/use-signup'
import {useRouter} from 'next/navigation'

const SignPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
        setError,
    } = useForm()

    const password = watch('password')
    const {signup, loading, error} = useSignup()
    const router = useRouter()

    const onSubmit = async (data: any) => {
        const {name, email, password} = data
        try {
            await signup({name, email, password})
            alert('회원가입이 완료되었습니다!')
            router.push('/')
        } catch (e: any) {
            console.error('회원가입 실패:', e)
            if (e.status === 400) {
                setError('email', {message: e.message})
            } else if (e.status === 409) {
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
                name: {
                    required: '이름은 필수입니다.',
                },
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
                confirmPassword: {
                    required: '비밀번호 확인은 필수입니다.',
                    validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
                },
            }}
            fields={[
                {name: 'name', label: '이름', type: 'text', placeholder: '이름을 입력해주세요'},
                {name: 'email', label: '이메일', type: 'text', placeholder: '이메일을 입력해주세요'},
                {name: 'password', label: '비밀번호', type: 'password', placeholder: '비밀번호를 입력해주세요'},
                {
                    name: 'confirmPassword',
                    label: '비밀번호 확인',
                    type: 'password',
                    placeholder: '비밀번호를 다시 입력해주세요',
                },
            ]}
            submitText={loading ? '가입 중...' : '회원가입하기'}
            bottomText="이미 회원이신가요?"
            bottomLink={{href: '/login', text: '로그인'}}
        />
    )
}

export default SignPage
