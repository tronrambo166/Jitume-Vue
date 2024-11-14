import React, { useRef } from "react";
import axiosClient from "../../axiosClient"; // Assuming you have axios setup
import { useNavigate } from "react-router-dom";
import Imge4 from "../../assets/image4.png";
import Image6 from "../../assets/image6.png";
import accountman from "../../assets/accountman.png";
import customsu from "../../assets/customsu.png";
import tracking from "../../assets/Track.png";
import wellSecure from "../../assets/Wellsecure.png";
import consistentence from "../../assets/consistence.png";

const WhyChoose = () => {
    const navigate = useNavigate();

    const handleBrowseBusinesses = (e) => {
        e.preventDefault();
        const payload = {
            location: "",
            category: "",
            listing_name: "",
            lat: "",
            lng: "",
        };

        console.log("Browse Businesses clicked with payload:", payload);

        // Call the search endpoint with no specific parameters
        axiosClient
            .post("/search", payload)
            .then(({ data }) => {
                let ids = "";
                console.log(data);
                Object.entries(data.results).forEach((entry) => {
                    const [index, row] = entry;
                    ids = ids + row.id + ",";
                });
                if (!ids) ids = 0;

                sessionStorage.setItem("queryLat", "");
                sessionStorage.setItem("queryLng", "");

                navigate(
                    "/listingResults/" + base64_encode(ids) + "/" + data.loc
                );

                if (window.location.pathname.includes("listingResults"))
                    window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
                console.log(err);
            });
    };

    const base64_encode = (str) => {
        return btoa(str);
    };

    return (
        <div className="max-w-7xl mx-auto px-2 py-4 grid md:grid-cols-2 gap-6 items-stretch mb-20">
            {/* Left Section */}
            <div className="flex flex-col justify-between ml-8">
                <div>
                    <span className="text-black bg-yellow-400 px-2 py-2 rounded-full text-sm mb-2 inline-block">
                        ∙ Why Choose Us
                    </span>
                    <h2 className="text-slate-700 text-2xl md:text-3xl font-bold font-sharp-grotesk mb-5">
                        Why Jitume is the right <br /> choice for your
                        investment
                        <br /> goals
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 mb-2">
                        Some important facilities to consider including are:
                    </p>

                    {/* Two-column layout for features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div className="space-y-9">
                            <div className="flex items-center space-x-2 mt-7 mb-1">
                                <img
                                    src={accountman}
                                    alt="Account Management"
                                    className="w-6 h-6"
                                />
                                <p className="text-base md:text-lg text-slate-700 font-semibold">
                                    Account Management
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={tracking}
                                    alt="Tracking Investments"
                                    className="w-6 h-6"
                                />
                                <p className="text-base md:text-lg text-slate-700 font-semibold">
                                    Tracking Investments
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={wellSecure}
                                    alt="Well Secured"
                                    className="w-6 h-6"
                                />
                                <p className="text-base md:text-lg text-slate-700 font-semibold">
                                    Well Secured
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-9">
                            <div className="flex items-center space-x-3 mt-7 mb-1">
                                <img
                                    src={customsu}
                                    alt="24/7 Customer Support"
                                    className="w-6 h-6"
                                />
                                <p className="text-base md:text-lg text-slate-700 font-semibold">
                                    24/7 Customer Support
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={consistentence}
                                    alt="Consistent Updates"
                                    className="w-6 h-6"
                                />
                                <p className="text-base md:text-lg text-slate-700 font-semibold">
                                    Consistent & Accurate Updates
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={handleBrowseBusinesses}
                    className="mt-6 w-[192px] h-[44px] px-[24px] py-[8px] gap-[8px] bg-green-800 text-white rounded-lg shadow-lg hover:bg-green-700 transition-opacity duration-300"
                >
                    Browse Businesses
                </button>
            </div>

            {/* Right Section */}
            <div className="flex justify-center ml-3">
                <div className="bg-gray-50 p-0.3 rounded-lg border border-gray-300 ">
                    <img
                        src={Image6}
                        alt="Jitume investment"
                        className="rounded-lg ml-3 mt-4"
                    />
                    <div className="mt-3">
                        <p className="text-[22px] md:text-[24px] text-slate-700 font-semibold ml-3">
                            Your trusted partner for{" "}
                            <span className="text-yellow-500 font-bold">
                                100%
                            </span>{" "}
                            <span className="text-gray-700">reliable</span>{" "}
                            <br /> Fund Raising
                        </p>
                        <img
                            src={Imge4}
                            alt="Jitume investment"
                            className="rounded-lg mt-3"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChoose;
