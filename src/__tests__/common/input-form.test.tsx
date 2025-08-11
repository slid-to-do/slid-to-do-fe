import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import InputForm from '../../components/common/input-form'

const mockFields = [
    {name: 'email', label: '이메일', type: 'text', placeholder: '이메일 입력'},
    {name: 'password', label: '비밀번호', type: 'password', placeholder: '비밀번호 입력'},
]

const mockRegister = jest.fn((name, options) => ({
    name,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
}))

const mockHandleSubmit = (fn: any) => (e: any) => {
    e.preventDefault()
    fn({email: 'test@test.com', password: '1234'})
}

const mockOnSubmit = jest.fn()

const mockValidationRules = {
    email: {required: '이메일을 입력하세요.'},
    password: {required: '비밀번호를 입력하세요.'},
}

describe('InputForm', () => {
    it('모든 입력 필드와 라벨을 렌더링한다', () => {
        render(
            <InputForm
                fields={mockFields}
                submitText="로그인"
                bottomText="계정이 없으신가요?"
                bottomLink={{href: '/signup', text: '회원가입'}}
                register={mockRegister}
                errors={{}}
                handleSubmit={mockHandleSubmit}
                onSubmit={mockOnSubmit}
                validationRules={mockValidationRules}
            />,
        )
        expect(screen.getByLabelText('이메일')).toBeInTheDocument()
        expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
        expect(screen.getByText('로그인')).toBeInTheDocument()
        expect(screen.getByText('계정이 없으신가요?')).toBeInTheDocument()
        expect(screen.getByText('회원가입')).toBeInTheDocument()
    })

    it('에러가 있을 때 에러 메시지를 표시한다', () => {
        render(
            <InputForm
                fields={mockFields}
                submitText="로그인"
                bottomText="계정이 없으신가요?"
                bottomLink={{href: '/signup', text: '회원가입'}}
                register={mockRegister}
                errors={{
                    email: {type: 'manual', message: '이메일 오류'},
                    password: {type: 'manual', message: '비밀번호 오류'},
                }}
                handleSubmit={mockHandleSubmit}
                onSubmit={mockOnSubmit}
                validationRules={mockValidationRules}
            />,
        )
        expect(screen.getByText('이메일 오류')).toBeInTheDocument()
        expect(screen.getByText('비밀번호 오류')).toBeInTheDocument()
    })

    it('폼 제출 시 onSubmit이 호출된다', () => {
        render(
            <InputForm
                fields={mockFields}
                submitText="로그인"
                bottomText="계정이 없으신가요?"
                bottomLink={{href: '/signup', text: '회원가입'}}
                register={mockRegister}
                errors={{}}
                handleSubmit={mockHandleSubmit}
                onSubmit={mockOnSubmit}
                validationRules={mockValidationRules}
            />,
        )
        fireEvent.click(screen.getByRole('button', {name: '로그인'}))
        expect(mockOnSubmit).toHaveBeenCalledWith({email: 'test@test.com', password: '1234'})
    })

    it('상단 설명 문구를 렌더링한다', () => {
        render(
            <InputForm
                fields={mockFields}
                submitText="로그인"
                bottomText="계정이 없으신가요?"
                bottomLink={{href: '/signup', text: '회원가입'}}
                register={mockRegister}
                errors={{}}
                handleSubmit={mockHandleSubmit}
                onSubmit={mockOnSubmit}
                validationRules={mockValidationRules}
            />,
        )
        expect(screen.getByText('하루를 계획하고, 성취하는 습관💪')).toBeInTheDocument()
    })

    it('하단 링크가 올바른 href 속성을 가진다', () => {
        render(
            <InputForm
                fields={mockFields}
                submitText="로그인"
                bottomText="계정이 없으신가요?"
                bottomLink={{href: '/signup', text: '회원가입'}}
                register={mockRegister}
                errors={{}}
                handleSubmit={mockHandleSubmit}
                onSubmit={mockOnSubmit}
                validationRules={mockValidationRules}
            />,
        )
        const link = screen.getByText('회원가입')
        expect(link).toHaveAttribute('href', '/signup')
    })
})
