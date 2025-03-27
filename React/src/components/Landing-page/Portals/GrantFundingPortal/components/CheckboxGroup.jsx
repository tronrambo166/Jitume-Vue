// components/CheckboxGroup.js
import React from "react";

const CheckboxGroup = ({ label, name, options, selectedOptions, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-green mb-2">
            {label}
        </label>
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id={`${name}-${option}`}
                        checked={selectedOptions.includes(option)}
                        onChange={() => onChange(option)}
                        className="h-4 w-4 text-green focus:ring-green border-gray-300 rounded"
                    />
                    <label
                        htmlFor={`${name}-${option}`}
                        className="text-sm text-gray-700"
                    >
                        {option}
                    </label>
                </div>
            ))}
        </div>
    </div>
);

export default CheckboxGroup;
