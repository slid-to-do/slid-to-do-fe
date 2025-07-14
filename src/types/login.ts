import type {FieldErrors, RegisterOptions, UseFormRegister} from 'react-hook-form'

export interface LoginResponse {
    accessToken: string
    refreshToken: string
}

export interface Field {
    name: string
    label: string
    type: string
    placeholder: string
}

export interface InputFormProps {
    fields: Field[]
    submitText: string
    bottomText: string
    bottomLink: {
        href: string
        text: string
    }
    register: UseFormRegister<any>
    errors: FieldErrors
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
    validationRules?: Record<string, RegisterOptions>
}
