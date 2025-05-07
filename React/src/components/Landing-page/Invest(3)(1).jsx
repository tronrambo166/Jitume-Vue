import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import SkeletonCard from "./SkeletonCard";
import Image from "../../assets/emaillogo.png";
const Invest = () => {
    const [activeTab, setActiveTab] = useState("businesses"); // 'businesses', 'grants', or 'capitals'
    const [businesses, setBusinesses] = useState([]);
    const [grants, setGrants] = useState([]);
    const [capitals, setCapitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const [canScrollBack, setCanScrollBack] = useState(false);
    const [canScrollForward, setCanScrollForward] = useState(false);
    const [currentCount, setCurrentCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await axiosClient.get("/latBusiness");
                setBusinesses(data.data);
                setGrants(data.grants || []);
                setCapitals(data.capitals || []);
                setCurrentCount(data.data.length - 1);
                setTimeout(checkScrollConditions, 0);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const checkScrollConditions = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const isAtStart = scrollLeft <= 0;
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth;

            setCanScrollBack(!isAtStart);
            setCanScrollForward(!isAtEnd);
        }
    };

    const handleNext = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            scrollRef.current.scrollLeft = scrollLeft + clientWidth;
            setTimeout(checkScrollConditions, 100);
        }
    };

    const handlePrev = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            scrollRef.current.scrollLeft = scrollLeft - clientWidth;
            setTimeout(checkScrollConditions, 100);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            checkScrollConditions();
            scrollRef.current.addEventListener("scroll", checkScrollConditions);
            return () => {
                if (scrollRef.current) {
                    scrollRef.current.removeEventListener(
                        "scroll",
                        checkScrollConditions
                    );
                }
            };
        }
    }, [activeTab]); // Re-check when tab changes

    const renderBusinessCards = () => {
        return businesses.map((business) => (
            <Link
                to={`/listing/${btoa(btoa(business.id))}`}
                key={business.id}
                onClick={() => window.scrollTo(0, 0)}
            >
                <div className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
                    <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg"
                        loading="lazy"
                    />
                    <div className="mt-3 flex-grow">
                        <p className="text-sm sm:text-base text-gray-500">
                            {business.category}
                        </p>
                        <h3 className="text-lg sm:text-xl mt-1 text-slate-800 font-semibold">
                            {business.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mt-2 truncate">
                            {business.details}
                        </p>
                    </div>
                    <div className="mt-4 bg-sky-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-800 flex justify-between mb-2">
                            <span>
                                <span className="font-semibold">
                                    $
                                    {business.investment_needed.toLocaleString()}
                                </span>
                                <br />
                                Goal
                            </span>
                            <span>
                                <span className="font-semibold">
                                    {business.invest_count}
                                </span>
                                <br />
                                Invested
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full mt-2">
                            <div
                                className="bg-green-600 h-full rounded-full"
                                style={{
                                    width: `${
                                        (business.amount_collected /
                                            parseInt(
                                                business.investment_needed
                                                    .toString()
                                                    .replace(",", "")
                                            )) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                        <div className="text-sm text-gray-800 flex justify-between mt-2">
                            <span>
                                Collected:{" "}
                                <strong>
                                    ${business.amount_collected / 1000}K
                                </strong>
                            </span>
                            <span>
                                Need:{" "}
                                <strong>
                                    $
                                    {(parseInt(
                                        business.investment_needed
                                            .toString()
                                            .replace(",", "")
                                    ) -
                                        parseInt(business.amount_collected)) /
                                        1000}
                                    K
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        ));
    };

   const renderGrantCards = () => {
       return grants.map((grant) => (
           <div
               key={grant.id}
               className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between"
           >
               <div className="bg-emerald-100 w-full h-40 sm:h-48 flex items-center justify-center rounded-lg overflow-hidden p-4">
                   <img
                       src={grant.logo || Image}
                       className="object-contain w-auto h-auto max-w-[80%] max-h-[80%] min-w-[60px] min-h-[60px]"
                       alt="Grant logo"
                   />
               </div>
               <div className="mt-3 flex-grow">
                   <p className="text-sm sm:text-base text-gray-500 line-clamp-1">
                       {grant.grant_focus}
                   </p>
                   <h3 className="text-lg sm:text-xl mt-1 text-slate-800 font-semibold line-clamp-2">
                       {grant.grant_title}
                   </h3>
                   <p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-3">
                       {grant.eligibility_criteria}
                   </p>
               </div>
               <div className="mt-4 bg-emerald-50 p-3 rounded-lg">
                   <div className="text-sm text-gray-800 flex justify-between mb-2">
                       <span className="line-clamp-2">
                           <span className="font-semibold">
                               ${grant.total_grant_amount}
                           </span>
                           <br />
                           Total Grant
                       </span>
                       <span className="line-clamp-2">
                           <span className="font-semibold">
                               ${grant.funding_per_business}
                           </span>
                           <br />
                           Per Business
                       </span>
                   </div>
                   <div className="text-sm text-gray-800">
                       <p className="font-semibold">Deadline:</p>
                       <p className="line-clamp-1">
                           {new Date(
                               grant.application_deadline
                           ).toLocaleDateString()}
                       </p>
                   </div>
               </div>
           </div>
       ));
   };

   const renderCapitalCards = () => {
       return capitals.map((capital) => (
           <div
               key={capital.id}
               className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between"
           >
               <div className="bg-yellow-100 w-full h-40 sm:h-48 flex items-center justify-center rounded-lg overflow-hidden p-4">
                   <img
                       src={capital.logo || Image}
                       className="object-contain w-auto h-auto max-w-[80%] max-h-[80%] min-w-[60px] min-h-[60px]"
                       alt="Grant logo"
                   />
               </div>
               <div className="mt-3 flex-grow">
                   <p className="text-sm sm:text-base text-gray-500 line-clamp-1">
                       {capital.sectors}
                   </p>
                   <h3 className="text-lg sm:text-xl mt-1 text-slate-800 font-semibold line-clamp-2">
                       {capital.offer_title}
                   </h3>
                   <p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-3">
                       {capital.milestone_requirements}
                   </p>
               </div>
               <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                   <div className="text-sm text-gray-800 flex justify-between mb-2">
                       <span className="line-clamp-2">
                           <span className="font-semibold">
                               ${capital.total_capital_available}
                           </span>
                           <br />
                           Total Capital
                       </span>
                       <span className="line-clamp-2">
                           <span className="font-semibold">
                               ${capital.per_startup_allocation}
                           </span>
                           <br />
                           Per Startup
                       </span>
                   </div>
                   <div className="text-sm text-gray-800">
                       <p className="font-semibold">Stage Focus:</p>
                       <p className="line-clamp-2">{capital.startup_stage}</p>
                   </div>
               </div>
           </div>
       ));
   };

    const getActiveCards = () => {
        switch (activeTab) {
            case "grants":
                return grants.length > 0 ? (
                    renderGrantCards()
                ) : (
                    <p className="text-gray-500">No grants available</p>
                );
            case "capitals":
                return capitals.length > 0 ? (
                    renderCapitalCards()
                ) : (
                    <p className="text-gray-500">
                        No capital offerings available
                    </p>
                );
            default:
                return businesses.length > 0 ? (
                    renderBusinessCards()
                ) : (
                    <p className="text-gray-500">No businesses available</p>
                );
        }
    };

    return (
        <>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                <div className="flex justify-start">
                    <span className="bg-[#F8D849] px-2 py-2 rounded-full text-sm mb-2 font-medium shadow-md max-w-xs text-center">
                        ∙ More Than {currentCount}+
                    </span>
                </div>

                <div className="flex justify-between items-center my-4">
                    <h2 className="text-[28px] sm:text-[44px] font-bold text-slate-700 leading-snug sm:leading-tight">
                        {activeTab === "businesses" &&
                            "Invest In Promising New Ventures"}
                        {activeTab === "grants" &&
                            "Available Grant Opportunities"}
                        {activeTab === "capitals" &&
                            "Capital Investment Offers"}
                    </h2>
                </div>

                {/* Tab switcher */}
                <div className="flex mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("businesses")}
                        className={`py-2 px-4 font-medium text-sm sm:text-base ${
                            activeTab === "businesses"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Businesses
                    </button>
                    <button
                        onClick={() => setActiveTab("grants")}
                        className={`py-2 px-4 font-medium text-sm sm:text-base ${
                            activeTab === "grants"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Grants
                    </button>
                    <button
                        onClick={() => setActiveTab("capitals")}
                        className={`py-2 px-4 font-medium text-sm sm:text-base ${
                            activeTab === "capitals"
                                ? "text-yellow-600 border-b-2 border-yellow-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Capital
                    </button>
                </div>

                <div className="flex justify-end space-x-1 mb-2">
                    <button
                        onClick={handlePrev}
                        disabled={!canScrollBack}
                        className={`rounded-full w-10 h-10 flex items-center justify-center ${
                            canScrollBack
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-300 cursor-not-allowed"
                        } transition duration-200 ease-in-out`}
                    >
                        <FaArrowLeft className="text-white text-xl" />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canScrollForward}
                        className={`rounded-full w-10 h-10 flex items-center justify-center ${
                            canScrollForward
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-300 cursor-not-allowed"
                        } transition duration-200 ease-in-out`}
                    >
                        <FaArrowRight className="text-white text-xl" />
                    </button>
                </div>
            </div>

            <div
                className="flex overflow-x-auto no-scrollbar px-4 lg:px-8"
                ref={scrollRef}
            >
                <div className="flex flex-nowrap space-x-4 pb-10">
                    {loading
                        ? Array(4)
                              .fill()
                              .map((_, index) => <SkeletonCard key={index} />)
                        : getActiveCards()}
                </div>
            </div>
        </>
    );
};

export default Invest;
