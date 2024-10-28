import React from "react";
import Theimg from "../../assets/sev/Frame.png"; // Import the single image

const DiscoverLocal = () => {
    return (
        <div className="flex flex-col lg:py-20 lg:flex-row justify-between items-center lg:items-stretch px-6 lg:px-12 bg-blue-50 w-full">
            {/* Image section */}
            <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-10 lg:justify-start mb-6 lg:mb-0">
                <img
                    src={Theimg}
                    alt="service"
                    className="object-cover w-full h-auto lg:max-h-[400px] rounded-md" // Adjust height as needed
                />
            </div>

            {/* Text content */}
            <div className="flex flex-col justify-center items-center lg:items-start lg:w-1/2 mt-2 mb-2 lg:mt-0 py-20 px-8 text-center lg:text-left">
                <button className="bg-yellow-400 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6">
                    • Discover local services
                </button>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                    Find the best local service in your area
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                    Explore categories to suit your needs. Connect with
                    businesses offering top-notch services.
                </p>
                <button className="mt-6 w-[192px] h-[44px] px-[24px] py-[8px] gap-[8px] bg-green-800 text-white rounded-lg shadow-lg hover:opacity-80 transition-opacity duration-300">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default DiscoverLocal;
