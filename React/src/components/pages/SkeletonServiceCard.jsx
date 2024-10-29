// src/components/SkeletonServiceCard.js
import React from "react";

const SkeletonServiceCard = () => (
    <div className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between animate-pulse">
        {/* Image Placeholder */}
        <div className="w-full h-40 sm:h-48 bg-gray-300 rounded-lg"></div>

        {/* Title and Description Placeholder */}
        <div className="mt-3 flex-grow">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Goal and Progress Placeholder */}
        <div className="mt-4 bg-gray-200 p-3 rounded-lg">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-300 rounded-full w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
    </div>
);

export default SkeletonServiceCard;
