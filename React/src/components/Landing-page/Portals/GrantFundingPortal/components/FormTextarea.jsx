// components/FormTextarea.js
import React from "react";

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    rows = 4,
}) => (
    <div>
        <label
            htmlFor={name}
            className="block text-sm font-medium text-green mb-2"
        >
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-green"
        />
    </div>
);

export default FormTextarea;
