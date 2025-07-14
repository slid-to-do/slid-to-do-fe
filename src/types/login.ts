export interface LoginResponse {
    accessToken: string
    refreshToken: string
}

export interface Field {
    label: string
    type: string
    placeholder: string
}

export interface FormProps {
    fields: Field[]
    submitText: string
    bottomText: string
    bottomLink?: {
        href: string
        text: string
    }
}
