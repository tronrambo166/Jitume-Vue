import React, { useState, useEffect } from "react";

const SmartCheckboxGroup = ({
    label,
    name,
    options = [],
    selectedOptions = [],
    onChange,
}) => {
    const [availableOptions, setAvailableOptions] = useState(options);
    const [recommendedOptions, setRecommendedOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const stringifyOption = (opt) => {
        if (typeof opt === "string") return opt;
        if (typeof opt === "object" && opt.value) return opt.value;
        return String(opt);
    };

    useEffect(() => {
        setAvailableOptions(
            options.filter(
                (opt) => !selectedOptions.includes(stringifyOption(opt))
            )
        );
    }, [options, selectedOptions]);

    useEffect(() => {
        if (selectedOptions.length > 0) {
            const firstLetters = new Set(
                selectedOptions.map((opt) =>
                    stringifyOption(opt).charAt(0).toLowerCase()
                )
            );

            const newRecommendations = options
                .filter((opt) => {
                    const optValue = stringifyOption(opt);
                    return (
                        !selectedOptions.includes(optValue) &&
                        firstLetters.has(optValue.charAt(0).toLowerCase())
                    );
                })
                .slice(0, 3);

            setRecommendedOptions(newRecommendations);
        } else {
            setRecommendedOptions([]);
        }
    }, [selectedOptions, options]);

    const filteredOptions = availableOptions.filter((opt) => {
        const optString = stringifyOption(opt);
        return optString.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>

            {/* Selected Options */}
            {selectedOptions.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">
                        Selected Items
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onChange(option)}
                                className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition"
                            >
                                {option}
                                <span className="ml-2 text-green-600 cursor-pointer">
                                    ×
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Options */}
            {recommendedOptions.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg shadow-sm">
                    <h4 className="text-xs font-semibold text-blue-700 mb-2">
                        Recommended for You
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {recommendedOptions.map((option) => {
                            const optionValue = stringifyOption(option);
                            return (
                                <button
                                    key={optionValue}
                                    type="button"
                                    onClick={() => onChange(option)}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition"
                                >
                                    + {optionValue}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Search and Available Options */}
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">
                        Available Options
                    </h4>
                    {filteredOptions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {filteredOptions.map((option) => {
                                const optionValue = stringifyOption(option);
                                return (
                                    <button
                                        key={optionValue}
                                        type="button"
                                        onClick={() => onChange(option)}
                                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition"
                                    >
                                        {optionValue}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No matching options found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartCheckboxGroup;
