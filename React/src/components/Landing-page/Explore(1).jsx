import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { decode as base64_decode, encode as base64_encode } from "base-64";
import axiosClient from "../../axiosClient";
import e1 from "../../assets/E1.png";
import e2 from "../../assets/E2.png";
import e3 from "../../assets/E3.png";
import e4 from "../../assets/E4.png";
import e5 from "../../assets/E5.png";
import e6 from "../../assets/E6.png";
import e7 from "../../assets/E7.png";
import e8 from "../../assets/E8.png";
import e9 from "../../assets/E9.png";
import e10 from "../../assets/E10.png";

const categories = [
    { name: "Agriculture", count: 0, color: "bg-blue-50", icon: e1 },
    { name: "Renewable Energy", count: 0, color: "bg-[#F3F8FE]", icon: e2 },
    { name: "Arts/Culture", count: 0, color: "bg-red-50", icon: e3 },
    { name: "Auto", count: 0, color: "bg-gray-100", icon: e4 },
    {
        name: "Domestic (HomeHelp-etc)",
        count: 0,
        color: "bg-yellow-50",
        icon: e5,
    },
    { name: "Fashion", count: 0, color: "bg-gray-100", icon: e6 },
    { name: "Finance/Accounting", count: 0, color: "bg-red-50", icon: e7 },
    { name: "Food", count: 0, color: "bg-yellow-50", icon: e8 },
    { name: "Legal", count: 0, color: "bg-blue-50", icon: e9 },
    { name: "Media/Internet", count: 0, color: "bg-purple-50", icon: e10 },
    { name: "Pets", count: 0, color: "bg-gray-100", icon: e1 },
    { name: "Real Estate", count: 0, color: "bg-red-50", icon: e2 },
    { name: "Security", count: 0, color: "bg-red-50", icon: e2 },
    { name: "Sports/Gaming", count: 0, color: "bg-red-50", icon: e2 },
    {
        name: "Technology/Communications",
        count: 0,
        color: "bg-red-50",
        icon: e2,
    },
    { name: "Other", count: 0, color: "bg-red-50", icon: e2 },
];

const Explore = () => {
    const [checkCat, setcheckCat] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getCards = async () => {
            axiosClient
                .get("/categoryCount")
                .then(({ data }) => {
                    //setCat(data.data);
                    for (const [key, value] of Object.entries(data.data)) {
                        for (const [key, value2] of Object.entries(
                            categories
                        )) {
                            if (value.category == value2.name)
                                value2.count = value.total;
                        }
                        setcheckCat(true);
                    }
                    console.log(categories);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getCards();
    }, []);

    const onSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        let ids = "";
        const payload = {
            location: "",
            category: "",
            listing_name: "", // use state
            lat: "",
            lng: "",
        };
        console.log(payload);
        axiosClient
            .post("/search", payload)
            .then(({ data }) => {
                console.log(data);
                Object.entries(data.results).forEach((entry) => {
                    const [index, row] = entry;
                    ids = ids + row.id + ",";
                }); //console.log(ids);
                if (!ids) ids = 0;

                sessionStorage.setItem("queryLat", payload.lat);
                sessionStorage.setItem("queryLng", payload.lng);
                navigate(
                    "/listingResults/" + base64_encode(ids) + "/" + data.loc
                );

                if (locationUrl.pathname.includes("listingResults"))
                    window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
                console.log(err);
                setIsLoading(false);
            });
    };

    return (
        <div className="flex flex-col items-center py-8 sm:py-12 mb-10">
            {/* Business Categories Label */}
            <div className="mb-2 sm:mb-4">
                <span className="text-black bg-yellow-400 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm  tracking-wider uppercase">
                    • Business categories
                </span>
            </div>

            {/* Heading Section */}
            <h1 className="font-sharp-grotesk text-[24px] sm:text-[36px] md:text-[44px] font-semibold leading-[32px] sm:leading-[46px] md:leading-[55.88px] tracking-[0.02em] text-slate-700 text-center mb-4 sm:mb-10">
                Exploring the latest categories
                <br />
                of business trends
            </h1>

            {/* Marquee Containers */}
            {["animate-marquee-right", "animate-marquee-left"].map(
                (animation, idx) => (
                    <div
                        key={idx}
                        className="relative w-full overflow-hidden mb-1"
                    >
                        <div
                            className={`flex items-center gap-2 ${animation} marquee-fade`}
                        >
                            {/* Render Categories */}
                            {checkCat
                                ? categories.map((category, index) => (
                                      <div
                                          key={index}
                                          className={`flex items-center p-4 rounded-md  ${category.color} min-w-[200px] sm:min-w-[220px] transition-transform`}
                                      >
                                          <img
                                              src={category.icon}
                                              alt={category.name}
                                              className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3"
                                          />
                                          <div className="flex flex-col items-start">
                                              <h2 className="text-xs sm:text-xs md:text-md font-medium text-slate-800">
                                                  {category.name}
                                              </h2>
                                              <p className="text-xs sm:text-sm text-gray-600">
                                                  ({category.count})
                                              </p>
                                          </div>
                                      </div>
                                  ))
                                : // Skeleton Loader
                                  Array(10)
                                      .fill(0)
                                      .map((_, index) => (
                                          <div
                                              key={`skeleton-${index}`}
                                              className="flex items-center p-4 rounded-md shadow-md bg-gray-200 min-w-[200px] sm:min-w-[220px] transition-transform animate-pulse"
                                          >
                                              <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gray-300 rounded-full mr-2 sm:mr-3"></div>
                                              <div className="flex flex-col space-y-1">
                                                  <div className="w-16 sm:w-20 h-4 bg-gray-300 rounded"></div>
                                                  <div className="w-12 sm:w-16 h-3 bg-gray-300 rounded"></div>
                                              </div>
                                          </div>
                                      ))}
                            {/* Duplicate Items for Seamless Scroll */}
                            {checkCat &&
                                categories.map((category, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center p-4 rounded-md shadow-md ${category.color} min-w-[200px] sm:min-w-[220px] min-h-[80px] sm:min-h-[100px] max-h-[100px] sm:max-h-[120px] transition-transform`}
                                    >
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3"
                                        />
                                        <div className="flex flex-col items-start">
                                            <h2 className="text-xs sm:text-sm md:text-md font-medium text-slate-800 truncate">
                                                {category.name}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                ({category.count})
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )
            )}

            {/* Explore Button */}
            <button
                onClick={onSearch}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-green-800 hover:bg-green-700 text-white rounded-xl text-sm sm:text-lg shadow-lg hover:opacity-80 transition-opacity duration-300"
                disabled={isLoading} // Disable button while loading
            >
                {isLoading && (
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-lg sm:text-xl" />
                )}
                <span>
                    {isLoading ? "Redirecting..." : "Explore 30+ Businesses"}
                </span>
            </button>
        </div>
    );
};
export default Explore;
