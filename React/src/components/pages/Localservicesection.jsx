import React, { useState } from "react";
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";
import Theimg from "../../assets/sev/Frame.png";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import spinner icon

const DiscoverLocal = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleGetStarted = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            search: "",
            category: "",
            listing_name: "",
            lat: "",
            lng: "",
        };

        axiosClient
            .post("/searchService", payload)
            .then(({ data }) => {
                let ids = "";
                Object.entries(data.results).forEach((entry) => {
                    const [index, row] = entry;
                    ids += row.id + ",";
                });
                if (!ids) ids = 0;

                sessionStorage.setItem("queryLat", "");
                sessionStorage.setItem("queryLng", "");

                navigate(
                    "/serviceResults/" + base64_encode(ids) + "/" + data.loc
                );

                if (window.location.pathname.includes("serviceResults"))
                    window.location.reload();
            })
            .catch((err) => {
                console.error("Error during search:", err);
                if (err.response && err.response.status === 422) {
                    console.error(
                        "Validation errors:",
                        err.response.data.errors
                    );
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const base64_encode = (str) => {
        return btoa(str);
    };

    return (
        <div className="flex flex-col lg:py-20 lg:flex-row justify-between items-center lg:items-stretch px-6 lg:px-12 bg-blue-50 w-full">
            <div className="lg:w-1/2 flex justify-center mt-10 lg:mt-10 lg:justify-start mb-6 lg:mb-0">
                <img
                    src={Theimg}
                    alt="service"
                    className="object-cover w-full h-auto lg:max-h-[400px] rounded-md"
                />
            </div>

            <div className="flex flex-col justify-center items-center lg:items-start lg:w-1/2 mt-2 mb-2 lg:mt-0 py-20 px-8 text-center lg:text-left">
                <p className="bg-yellow-400 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6">
                    • Discover local services
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                    Find the best local service in your area
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                    Explore categories to suit your needs. Connect with
                    businesses offering top-notch services.
                </p>
                <button
                    onClick={handleGetStarted}
                    disabled={isLoading}
                    className={`mt-6 w-[192px] h-[44px] px-[24px] py-[8px] gap-[8px] bg-green-800 text-white rounded-lg shadow-lg flex justify-center items-center ${
                        isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-80"
                    } transition-opacity duration-300`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <AiOutlineLoading3Quarters className="animate-spin text-white text-lg" />
                            Redirecting...
                        </span>
                    ) : (
                        "Browse Services"
                    )}
                </button>
            </div>
        </div>
    );
};

export default DiscoverLocal;
