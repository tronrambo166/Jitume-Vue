import React from "react";

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    required = true,
}) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-green mb-2 flex items-center"
            >
                {label}
            </label>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-green appearance-none"
                >
                    <option value="">Select {label}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FormSelect;
