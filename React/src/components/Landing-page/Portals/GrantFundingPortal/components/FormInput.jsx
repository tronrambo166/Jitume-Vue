import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormInput = ({
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    required = true,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        let inputValue = e.target.value;

        // Special handling for phone number
        if (name === "phoneNumber") {
            // Remove non-numeric characters
            inputValue = inputValue.replace(/\D/g, "");

            // Limit to 15 digits (international phone number max length)
            inputValue = inputValue.slice(0, 15);
        }

        onChange({
            target: {
                name: name,
                value: inputValue,
            },
        });
    };

    // Determine input type based on password visibility
    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : name === "phoneNumber"
            ? "tel"
            : type;

    return (
        <div className="relative">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-green mb-2"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    pattern={name === "phoneNumber" ? "\\d*" : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-green"
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormInput;
