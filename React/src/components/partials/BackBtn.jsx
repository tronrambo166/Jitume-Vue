import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackBtn = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center space-x-2 mt-3 border border-black text-black bg-transparent px-2 py-1 md:px-4 md:py-2 rounded hover:bg-black hover:text-white transition-colors ml-6 md:ml-6 lg:ml-10" // Adjusted margin for mobile
        >
            <FaArrowLeft className="text-sm md:text-base" />{" "}
            {/* Responsive icon size */}
            <span className="text-sm md:text-base">Back</span>{" "}
            {/* Responsive text size */}
        </button>
    );
};

export default BackBtn;
