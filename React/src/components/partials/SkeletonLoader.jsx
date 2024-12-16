import React from "react";

const SkeletonLoader = () => {
    return (
        <div className="flex flex-col mt-4 rounded-lg md:flex-row h-screen animate-pulse">
            {/* Conversations List Skeleton */}
            <div className="w-full md:w-1/3 bg-gray-100 border-r overflow-y-auto">
                <div className="p-3 border-b bg-gray-200 h-10"></div>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="p-3 border-b flex space-x-3 items-center"
                    >
                        <div className="bg-gray-300 rounded-full h-8 w-8"></div>
                        <div className="flex-1 space-y-2">
                            <div className="bg-gray-300 h-4 w-1/2"></div>
                            <div className="bg-gray-300 h-3 w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Window Skeleton */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header Skeleton */}
                <div className="p-3 bg-gray-100 border-b">
                    <div className="bg-gray-300 h-5 w-1/4 mb-2"></div>
                    <div className="bg-gray-300 h-4 w-1/3"></div>
                </div>

                {/* Chat Messages Skeleton */}
                <div className="flex-1 p-3 overflow-y-auto space-y-4 bg-gray-50">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                index % 2 === 0
                                    ? "justify-start"
                                    : "justify-end"
                            }`}
                        >
                            <div
                                className={`rounded-lg p-3 max-w-xs ${
                                    index % 2 === 0
                                        ? "bg-gray-300"
                                        : "bg-gray-400"
                                }`}
                            >
                                <div className="bg-gray-200 h-3 w-full mb-2"></div>
                                <div className="bg-gray-200 h-3 w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input Skeleton */}
                <div className="p-3 border-t bg-white">
                    <div className="bg-gray-200 h-10 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
