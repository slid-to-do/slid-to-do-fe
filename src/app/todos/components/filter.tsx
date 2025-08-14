import type {FilterProperties} from "@/types/todos"

const Filter = ({children, checked = false, onChange, value, name}: FilterProperties) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value)
    }

    return (
        <label
            className={`px-3 py-1 border rounded-full border-slate-200 cursor-pointer text-sm font-medium transition-colors ${
                checked ? 'bg-custom_blue-500 text-white' : 'bg-white text-slate-800'
            }`}
        >
            {children}
            <input
                type="radio"
                className="hidden"
                checked={checked}
                onChange={handleChange}
                value={value}
                name={name}
            />
        </label>
    )
}

export default Filter
