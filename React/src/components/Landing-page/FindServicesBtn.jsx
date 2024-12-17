import React, { useState } from "react";
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import spinner icon

const FindServicesBtn = () => {
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
                    // window.location.reload();
                    window.scrollTo(0, 0);
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
        <div>
            <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className={`flex items-center justify-center px-6 md:px-8 py-3 md:py-4 font-semibold rounded-lg text-white text-[10px] md:text-[12px] bg-green-500 hover:bg-green-600 transition ${
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
                    "Find Services"
                )}
            </button>
        </div>
    );
};

export default FindServicesBtn;
