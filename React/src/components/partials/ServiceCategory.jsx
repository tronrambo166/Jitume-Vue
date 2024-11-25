import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import SearchCategory from "./SearchCategory";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const CategoryPage = ({ categoryName }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const { name } = useParams();
    const [range, setRange] = useState([0, 1000000]);  // Track the price range

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            const testData = [
                {
                    id: 1,
                    name: "Business 1",
                    image: "https://via.placeholder.com/300",
                    contact: "123-456-7890",
                    price: 100000,
                    category: "Service",
                    location: "Kenya",
                    details: "Business 1 details",
                },
                // Add more listings as needed
            ];

            if (testData.length === 0) {
                setNotificationMessage("Listings not found.");
                setShowNotification(true);
            } else {
                setCards(testData);
                setLoading(false);
            }
        }, 1000); // Simulate network delay
    }, []);

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const handleAmountChange = (value) => {
        setRange(value); // Update the range
        console.log(value);
    };

    const filteredCards = cards.filter((card) => card.price >= range[0] && card.price <= range[1]);

    const sliderMarks = {
        0: "$0",
        100000: "$100K",
        200000: "$200K",
        300000: "$300K",
        400000: "$400K",
        500000: "$500K",
        600000: "$600K",
        700000: "$700K",
        800000: "$800K",
        900000: "$900K",
        1000000: "$1M",
    };

    useEffect(() => {
        const categoryResults = () => {
            axiosClient
                .get("/categoryResults/" + name)
                .then(({ data }) => {
                    setCards(data.services);
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        categoryResults();
    }, []);

    return (
        <div className="p-6 max-w-screen-xl mx-auto space-y-10">
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                What Are You Looking For?
            </h1>

            {/* Search Category */}
            <div className="w-full mb-6 mx-auto max-w-[84vw]">
                <SearchCategory />
            </div>

            {/* Amount Range Section */}
            <div className="border border-gray-200 rounded-lg p-6 md:p-8 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-[#1E293B]">
                    Amount Range
                </h3>
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => console.log(range)}
                        id="colBut4"
                        className="mr-4 border border-green-600 text-green-600 rounded-full px-4 py-2 hover:bg-green-600 hover:text-white transition"
                        name="min"
                    >
                        Set Range
                    </button>
                </div>
                <Slider
                    range
                    min={0}
                    max={1000000}
                    step={10000}
                    value={range}
                    onChange={handleAmountChange}
                    trackStyle={{
                        backgroundColor: "green",
                        height: "10px",
                        borderRadius: "5px",
                    }}
                    handleStyle={{
                        borderColor: "white",
                        height: "20px",
                        width: "20px",
                        marginTop: "-5px",
                        backgroundColor: "green",
                        borderRadius: "50%",
                        border: "2px solid white",
                    }}
                    marks={sliderMarks}
                    activeDotStyle={{ display: "none" }}
                    dotStyle={{ display: "none" }}
                />
                <div className="flex justify-between mt-4 text-[#1E293B] text-sm">
                    <span>${range[0].toLocaleString()}</span>
                    <span>${range[1].toLocaleString()}</span>
                </div>
            </div>

            {/* Notification */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Category: {name}</h1>
                {showNotification && (
                    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <p>{notificationMessage}</p>
                            <button
                                onClick={handleCloseNotification}
                                className="ml-4 text-white font-bold"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array(4)
                        .fill()
                        .map((_, index) => (
                            <div
                                key={index}
                                className="bg-gray-200 rounded-2xl w-full overflow-hidden animate-pulse"
                            >
                                <div className="w-full h-40 sm:h-48 bg-gray-300"></div>
                                <div className="p-3 sm:p-4 space-y-4">
                                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                /* Listings */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCards.length === 0 ? (
                        <p className="text-center text-gray-500 col-span-full">
                            No listings available.
                        </p>
                    ) : (
                        filteredCards.map((card) => (
                            <Link
                                to={`/service-details/${btoa(btoa(card.id))}`}
                                key={card.id}
                                className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition"
                            >
                                <img
                                    src={"../" + card.image}
                                    alt={card.name}
                                    className="w-full h-40 sm:h-48 object-cover rounded-lg"
                                />
                                <p className="text-sm mt-2 mb-2 font-semibold text-[#1E293B]">
                                    #{card.category}
                                </p>
                                <div>
                                    <h2 className="text-lg sm:text-xl mt-1 font-semibold text-slate-800">
                                        {card.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {card.contact_mail || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {card.location ||
                                            "Location not available"}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {card.details}
                                    </p>
                                    <p className="text-black space-x-2 font-semibold mt-2">
                                        <span className="text-[#15803D]">
                                            ${card.price}
                                        </span>
                                        <span className="text-[#1E293B]">
                                            /Price
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
export default CategoryPage;
