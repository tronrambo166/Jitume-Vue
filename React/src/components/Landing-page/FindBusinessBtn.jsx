import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../axiosClient"; // Ensure axiosClient is correctly set up
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import FindServicesBtn from "./FindServicesBtn";

const FindBusinessBtn = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Hook to get the current location

    const handleBrowseBusinesses = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true at the start

        const payload = {
            location: "",
            category: "",
            listing_name: "",
            lat: "",
            lng: "",
        };

        console.log("Browse Businesses clicked with payload:", payload);

        try {
            const { data } = await axiosClient.post("/search", payload);

            let ids = "";
            console.log(data);
            Object.entries(data.results).forEach(([index, row]) => {
                ids += `${row.id},`;
            });

            if (!ids) ids = 0;

            sessionStorage.setItem("queryLat", "");
            sessionStorage.setItem("queryLng", "");

            navigate(`/listingResults/${base64_encode(ids)}/${data.loc}`);

            if (window.location.pathname.includes("listingResults")) {
                // window.location.reload();
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.error(err);
            const response = err.response;
            if (response && response.status === 422) {
                console.log(response.data.errors);
            }
        } finally {
            setLoading(false); // Ensure loading is turned off after the request
        }
    };

    const base64_encode = (str) => {
        return btoa(str);
    };

    // Check if the current route contains 'service'
    const isServiceRoute = location.pathname.includes("service");

    return (
        <div>
            {isServiceRoute ? (
                <FindServicesBtn />
            ) : (
                <button
                    onClick={handleBrowseBusinesses}
                    disabled={loading}
                    className={`flex items-center justify-center px-6 md:px-8 py-3 md:py-4 font-semibold rounded-lg text-white text-[10px] md:text-[12px] bg-green-500 hover:bg-green-600 transition ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? (
                        <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    ) : null}
                    {loading ? "Redirecting..." : "Find Business"}
                </button>
            )}
        </div>
    );
};

export default FindBusinessBtn;
