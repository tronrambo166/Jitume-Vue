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

    useEffect(() => {
        if (!Array.isArray(selectedOptions)) return;

        if (selectedOptions.length > 0) {
            const firstLetters = new Set(
                selectedOptions.map((opt) => opt.charAt(0).toLowerCase())
            );

            const newRecommendations = options
                .filter(
                    (opt) =>
                        !selectedOptions.includes(opt) &&
                        firstLetters.has(opt.charAt(0).toLowerCase())
                )
                .slice(0, 3);

            setRecommendedOptions(newRecommendations);
        } else {
            setRecommendedOptions([]);
        }
    }, [selectedOptions, options]);

    useEffect(() => {
        setAvailableOptions(
            options.filter((opt) => !selectedOptions.includes(opt))
        );
    }, [options, selectedOptions]);

    const filteredOptions = availableOptions.filter((opt) =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mb-6">
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
                        {recommendedOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onChange(option)}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition"
                            >
                                + {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Input */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
            </div>

            {/* Available Options */}
            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                <h4 className="text-xs font-semibold text-gray-600 mb-2">
                    Available Options
                </h4>
                {filteredOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {filteredOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onChange(option)}
                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No matching options found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SmartCheckboxGroup;
