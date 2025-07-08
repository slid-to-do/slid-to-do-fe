import React from 'react'

// 각 HTML 요소별 정확한 타입 정의
type H1Properties = React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode
}

type H2Properties = React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode
}

type H3Properties = React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode
}

type H4Properties = React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode
}

type H5Properties = React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode
}

type H6Properties = React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode
}

type ParagraphProperties = React.HTMLAttributes<HTMLParagraphElement> & {
    children?: React.ReactNode
}

type StrongProperties = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode
}

type EmphasisProperties = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode
}

type ListProperties = React.HTMLAttributes<HTMLUListElement | HTMLOListElement> & {
    children?: React.ReactNode
}

type ListItemProperties = React.HTMLAttributes<HTMLLIElement> & {
    children?: React.ReactNode
}

type CodeProperties = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode
}

type PreProperties = React.HTMLAttributes<HTMLPreElement> & {
    children?: React.ReactNode
}

type BlockquoteProperties = React.HTMLAttributes<HTMLQuoteElement> & {
    children?: React.ReactNode
}

type AnchorProperties = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children?: React.ReactNode
}

type ImageProperties = React.ImgHTMLAttributes<HTMLImageElement>

type TableProperties = React.TableHTMLAttributes<HTMLTableElement> & {
    children?: React.ReactNode
}

type TableSectionProperties = React.HTMLAttributes<HTMLTableSectionElement> & {
    children?: React.ReactNode
}

type TableCellProperties = React.TdHTMLAttributes<HTMLTableCellElement> & {
    children?: React.ReactNode
}

type TableHeaderProperties = React.ThHTMLAttributes<HTMLTableCellElement> & {
    children?: React.ReactNode
}

type HrProperties = React.HTMLAttributes<HTMLHRElement>

export const markdownElements = {
    h1: (properties: H1Properties) => {
        const {children, ...restProperties} = properties
        return (
            <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-2" {...restProperties}>
                {children}
            </h1>
        )
    },

    h2: (properties: H2Properties) => {
        const {children, ...restProperties} = properties
        return (
            <h2 className="text-2xl font-semibold mb-4 text-gray-800" {...restProperties}>
                {children}
            </h2>
        )
    },

    h3: (properties: H3Properties) => {
        const {children, ...restProperties} = properties
        return (
            <h3 className="text-xl font-medium mb-3 text-gray-700" {...restProperties}>
                {children}
            </h3>
        )
    },

    h4: (properties: H4Properties) => {
        const {children, ...restProperties} = properties
        return (
            <h4 className="text-lg font-medium mb-2 text-gray-700" {...restProperties}>
                {children}
            </h4>
        )
    },

    h5: (properties: H5Properties) => {
        const {children, ...restProperties} = properties
        return (
            <h5 className="text-base font-medium mb-2 text-gray-600" {...restProperties}>
                {children}
            </h5>
        )
    },

    h6: (properties: H6Properties) => {
        const {children, ...restProperties} = properties
        return (
            <h6 className="text-sm font-medium mb-2 text-gray-600" {...restProperties}>
                {children}
            </h6>
        )
    },

    p: (properties: ParagraphProperties) => {
        const {children, ...restProperties} = properties
        return (
            <p className="mb-4 leading-relaxed text-gray-800" {...restProperties}>
                {children}
            </p>
        )
    },

    strong: (properties: StrongProperties) => {
        const {children, ...restProperties} = properties
        return (
            <strong className="font-bold text-gray-900" {...restProperties}>
                {children}
            </strong>
        )
    },

    em: (properties: EmphasisProperties) => {
        const {children, ...restProperties} = properties
        return (
            <em className="italic text-gray-700" {...restProperties}>
                {children}
            </em>
        )
    },

    ul: (properties: ListProperties) => {
        const {children, ...restProperties} = properties
        return (
            <ul className="list-disc list-inside mb-4 space-y-1 text-gray-800" {...restProperties}>
                {children}
            </ul>
        )
    },

    ol: (properties: ListProperties) => {
        const {children, ...restProperties} = properties
        return (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-800" {...restProperties}>
                {children}
            </ol>
        )
    },

    li: (properties: ListItemProperties) => {
        const {children, ...restProperties} = properties
        return (
            <li className="ml-4" {...restProperties}>
                {children}
            </li>
        )
    },

    code: (properties: CodeProperties) => {
        const {children, ...restProperties} = properties
        return (
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600 border" {...restProperties}>
                {children}
            </code>
        )
    },

    pre: (properties: PreProperties) => {
        const {children, ...restProperties} = properties
        return (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border" {...restProperties}>
                {children}
            </pre>
        )
    },

    blockquote: (properties: BlockquoteProperties) => {
        const {children, ...restProperties} = properties
        return (
            <blockquote
                className="border-l-4 border-blue-500 pl-6 py-2 italic mb-4 bg-blue-50 text-gray-700"
                {...restProperties}
            >
                {children}
            </blockquote>
        )
    },

    a: (properties: AnchorProperties) => {
        const {children, ...restProperties} = properties
        return (
            <a
                className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
                {...restProperties}
            >
                {children}
            </a>
        )
    },

    img: (properties: ImageProperties) => {
        const {children, src, alt, ...restProperties} = properties

        if (!src) {
            return
        }

        return <img className="max-w-full h-auto rounded-lg shadow-md mb-4" src={src} alt={alt} {...restProperties} />
    },

    table: (properties: TableProperties) => {
        const {children, ...restProperties} = properties
        return (
            <table className="min-w-full border border-gray-300 mb-4 rounded-lg overflow-hidden" {...restProperties}>
                {children}
            </table>
        )
    },

    thead: (properties: TableSectionProperties) => {
        const {children, ...restProperties} = properties
        return (
            <thead className="bg-gray-50" {...restProperties}>
                {children}
            </thead>
        )
    },

    tbody: (properties: TableSectionProperties) => {
        const {children, ...restProperties} = properties
        return (
            <tbody className="bg-white divide-y divide-gray-200" {...restProperties}>
                {children}
            </tbody>
        )
    },

    th: (properties: TableHeaderProperties) => {
        const {children, ...restProperties} = properties
        return (
            <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                {...restProperties}
            >
                {children}
            </th>
        )
    },

    td: (properties: TableCellProperties) => {
        const {children, ...restProperties} = properties
        return (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b" {...restProperties}>
                {children}
            </td>
        )
    },

    hr: (properties: HrProperties) => {
        const {children, ...restProperties} = properties
        return <hr className="my-8 border-gray-300" {...restProperties} />
    },
}
