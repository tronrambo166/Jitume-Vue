import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { decode as base64_decode, encode as base64_encode } from "base-64";
import axiosClient from "../../axiosClient";

const imgpath = "../../src/assets/";

const categories = [
    {
        name: "Agriculture",
        count: 0,
        color: "bg-blue-50",
        icon: imgpath + "E1.png",
    },
    {
        name: "Renewable Energy",
        count: 0,
        color: "bg-[#F3F8FE]",
        icon: imgpath + "E2.png",
    },
    {
        name: "Arts/Culture",
        count: 0,
        color: "bg-red-50",
        icon: imgpath + "E3.png",
    },
    { name: "Auto", count: 0, color: "bg-gray-100", icon: imgpath + "E4.png" },
    {
        name: "Domestic (HomeHelp-etc)",
        count: 0,
        color: "bg-yellow-50",
        icon: imgpath + "E5.png",
    },
    {
        name: "Fashion",
        count: 0,
        color: "bg-gray-100",
        icon: imgpath + "E6.png",
    },
    {
        name: "Finance/Accounting",
        count: 0,
        color: "bg-red-50",
        icon: imgpath + "E7.png",
    },
    { name: "Food", count: 0, color: "bg-yellow-50", icon: imgpath + "E8.png" },
    { name: "Legal", count: 0, color: "bg-blue-50", icon: imgpath + "E9.png" },
    {
        name: "Media/Internet",
        count: 0,
        color: "bg-purple-50",
        icon: imgpath + "E10.png",
    },
    { name: "Pets", count: 0, color: "bg-gray-100", icon: imgpath + "E1.png" },
    {
        name: "Real Estate",
        count: 0,
        color: "bg-red-50",
        icon: imgpath + "E2.png",
    },
    {
        name: "Security",
        count: 0,
        color: "bg-red-50",
        icon: imgpath + "E2.png",
    },
    {
        name: "Sports/Gaming",
        count: 0,
        color: "bg-red-50",
        icon: imgpath + "E2.png",
    },
    {
        name: "Technology/Communications",
        count: 0,
        color: "bg-red-50",
        icon: imgpath + "E2.png",
    },
    { name: "Other", count: 0, color: "bg-red-50", icon: imgpath + "E2.png" },
];

const Explore = () => {
    const [checkCat, setcheckCat] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [exp, setExp] = useState(null);
    const [currentCount, setCurrentCount] = useState(0);

    useEffect(() => {
        const getCards = async () => {
            axiosClient
                .get("/categoryCount")
                .then(({ data }) => {
                    setExp(data.listing_count);

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
                    setCurrentCount(data.listing_count - 1);
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
                // this the reason of the scroll to top

                window.scrollTo(0, 0);

                // this the reason of the scroll to top
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
        <div className="flex flex-col items-center mt-10">
            {/* Business Categories Label */}
            <div className="mb-4 sm:mb-4">
                <span className="text-black bg-[#F8D849] px-2 py-2 rounded-full text-sm mb-2 sm:py-2 sm:text-sm tracking-wider ">
                    • Business Categories
                </span>
            </div>

            {/* Heading Section */}
            <h1 className="font-sharp-grotesk text-[24px] sm:text-[36px] md:text-[44px] font-semibold leading-[32px] sm:leading-[46px] md:leading-[55.88px] tracking-[0.02em] text-slate-700 text-center mb-4 sm:mb-10 mt-4 sm:mt-0">
                Exploring the latest categories
                <br />
                of business trends
            </h1>

            {/* Marquee Containers */}
            {["animate-marquee-right", "animate-marquee-left"].map(
                (animation, index) => (
                    <div
                        key={index}
                        className="relative w-full overflow-hidden group"
                    >
                        <div
                            key={index}
                            className={`flex items-center gap-1 ${animation} marquee-fade group-hover:animation-pause`}
                        >
                            {/* Render Categories */}
                            {checkCat
                                ? categories.map((category, index) => (
                                      <Link
                                          key={index}
                                          to={`/category/${category.name
                                              .replace("/", "-")
                                              .replace(" ", "-")}`}
                                          onClick={() => window.scrollTo(0, 0)}
                                      >
                                          <div
                                              key={index}
                                              className={`flex items-center p-4 rounded-md ${category.color} min-w-[200px] sm:min-w-[220px] transition-transform`}
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
                                      </Link>
                                  ))
                                : // Skeleton Loader
                                  Array(10)
                                      .fill(0)
                                      .map((_, index) => (
                                          <div
                                              key={`skeleton-${index}`}
                                              className="flex items-center p-2 mb-6 rounded-md shadow-md bg-gray-200 min-w-[200px] sm:min-w-[220px] transition-transform animate-pulse"
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
                className="flex items-center mt-12 mb-16 justify-center gap-2 px-4 sm:px-6 py-3 bg-green-800 hover:bg-green-700 text-white rounded-xl text-sm sm:text-lg shadow-lg hover:opacity-80 transition-opacity duration-300"
                disabled={isLoading} // Disable button while loading
            >
                {isLoading && (
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-lg sm:text-xl" />
                )}
                <span>
                    {isLoading
                        ? "Redirecting..."
                        : `Explore ${currentCount}+ Businesses`}
                </span>
            </button>
        </div>
    );
};
export default Explore;
