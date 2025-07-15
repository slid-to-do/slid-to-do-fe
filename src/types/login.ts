import type {FieldErrors, RegisterOptions, UseFormRegister, SubmitHandler, Path} from 'react-hook-form'

export interface LoginResponse {
    accessToken: string
    refreshToken: string
}

export interface Field<T> {
    name: Path<T>
    label: string
    type: string
    placeholder: string
}

export interface InputFormProperties<T extends object> {
    fields: Field<T>[]
    submitText: string
    bottomText: string
    bottomLink: {
        href: string
        text: string
    }
    register: UseFormRegister<T>
    errors: FieldErrors<T>
    handleSubmit: (onValid: SubmitHandler<T>) => (event?: React.BaseSyntheticEvent) => void
    onSubmit: SubmitHandler<T>
    validationRules?: Partial<Record<keyof T, RegisterOptions<T, Path<T>>>>
}

export interface LoginFormData {
    email: string
    password: string
    [key: string]: string | undefined
}
