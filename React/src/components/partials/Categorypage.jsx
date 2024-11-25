import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import SearchCategory from "./SearchCategory";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const CategoryPage = ({ categoryName }) => {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const { name } = useParams();
    const [turnoverRange, setTurnoverRange] = useState([0, 1000000]);
    const [amountRange, setAmountRange] = useState([0, 1000000]);

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
                    setCards(data.data);
                    setFilteredCards(data.data); // Initialize filtered cards
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        categoryResults();
    }, [name]);

    const filterCards = () => {
        const filtered = cards.filter((card) => {
            const investmentNeeded = parseFloat(card.investment_needed) || 0;
            const turnover = parseFloat(card.y_turnover) || 0;

            return (
                investmentNeeded >= amountRange[0] &&
                investmentNeeded <= amountRange[1] &&
                turnover >= turnoverRange[0] &&
                turnover <= turnoverRange[1]
            );
        });
        setFilteredCards(filtered);
    };

    const handleTurnoverChange = (value) => {
        setTurnoverRange(value);
    };

    const handleAmountChange = (value) => {
        setAmountRange(value);
    };

    useEffect(() => {
        filterCards();
    }, [turnoverRange, amountRange]);


    return (
        <div className="p-6 max-w-screen-xl mx-auto w-full sm:p-8 lg:p-10">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                What Are You Looking For?
            </h1>
            <div className="w-full mb-6 mx-auto max-w-[84vw]">
                <SearchCategory />
            </div>
            <div>
                <div className="flex gap-6 justify-between">
                    {/* Amount Range */}
                    <div className="border border-gray-200 rounded-lg p-4 flex-1">
                        <h3 className="text-lg font-semibold mb-2 text-[#1E293B]">
                            Amount Range
                        </h3>
                        <button
                            onClick={()=>{console.log(amountRange)}}
                            id="colBut4"
                            className="mr-4 my-2 border rounded-full px-3 py-1 "
                            name="min"
                        >
                            Set Range{" "}
                        </button>
                        <Slider
                            range
                            min={0}
                            max={1000000}
                            step={10000}
                            value={amountRange}
                            onChange={handleAmountChange}
                            trackStyle={{
                                backgroundColor: "green",
                                height: "10px",
                            }}
                            handleStyle={{
                                borderColor: "white",
                                height: "18px",
                                width: "18px",
                                marginTop: "-4px",
                                backgroundColor: "green",
                                borderRadius: "50%",
                                border: "2px solid white",
                            }}
                            marks={sliderMarks}
                            activeDotStyle={{ display: "none" }}
                            dotStyle={{ display: "none" }}
                        />
                        <div className="flex justify-between mt-8 text-[#1E293B] text-sm">
                            <span>${amountRange[0].toLocaleString()}</span>
                            <span>${amountRange[1].toLocaleString()}</span>
                        </div>
                      
                    </div>

                    {/* Turnover Range */}
                    <div className="border border-gray-200 rounded-lg p-4 flex-1">
                        <h3 className="text-lg font-semibold mb-2 text-[#1E293B]">
                            Turnover Range
                        </h3>
                        <button
                            onClick={() => {
                                console.log(turnoverRange);
                            }}
                            id="colBut4"
                            className="mr-4 my-2 border rounded-full px-3 py-1 "
                            name="min"
                        >
                            Set Range{" "}
                        </button>

                        <Slider
                            range
                            min={0}
                            max={1000000}
                            step={10000}
                            value={turnoverRange}
                            onChange={handleTurnoverChange}
                            trackStyle={{
                                backgroundColor: "green",
                                height: "10px",
                            }}
                            handleStyle={{
                                borderColor: "white",
                                height: "18px",
                                width: "18px",
                                marginTop: "-4px",
                                backgroundColor: "green",
                                borderRadius: "50%",
                                border: "2px solid white",
                            }}
                            marks={sliderMarks}
                            activeDotStyle={{ display: "none" }}
                            dotStyle={{ display: "none" }}
                        />
                        <div className="flex justify-between mt-8 text-[#1E293B] text-sm">
                            <span>${turnoverRange[0].toLocaleString()}</span>
                            <span>${turnoverRange[1].toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Category: {name}</h1>
                {showNotification && (
                    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
                        <div className="flex items-center justify-between">
                            <p>{notificationMessage}</p>
                            <button
                                onClick={() => setShowNotification(false)}
                                className="ml-4 text-white font-bold"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCards.length === 0 ? (
                        <p className="text-center text-gray-500 col-span-full">
                            No listings available.
                        </p>
                    ) : (
                        filteredCards.map((card) => (
                            <Link
                                to={`/listing/${btoa(btoa(card.id))}`}
                                key={card.id}
                                className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden"
                            >
                                <img
                                    src={"../" + card.image}
                                    alt={card.name}
                                    className="w-full h-60 sm:h-48 object-cover rounded-lg"
                                />
                                <p className="text-sm sm:text-base mt-2 mb-2 font-semibold text-[#1E293B]">
                                    #Motorcycle Transport #Bikes
                                </p>
                                <div className="mt-3 flex-grow">
                                    <h2 className="text-lg sm:text-xl mt-1 text-slate-800 font-semibold">
                                        {card.name}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-500">
                                        {card.contact ||
                                            "Contact not available"}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-500">
                                        {card.location ||
                                            "Location not available"}
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                                        Lorem ipsum dolor sit amet consectetur.
                                        Eu quis vel pellentesque ullamcorper
                                        donec lorem auctor egestas adipiscing.
                                    </p>
                                    <p className="text-black space-x-2 font-semibold mt-2">
                                        <span className="text-[#1E293B] jakarta">
                                            Amount Requested:
                                        </span>
                                        <span className="text-[#15803D]">
                                            {card.investment_needed || "N/A"}
                                        </span>
                                    </p>
                                    <p className="text-black space-x-2 font-semibold mt-2">
                                        <span className="text-[#1E293B] jakarta">
                                            {" "}
                                            Turnover:
                                        </span>
                                        <span className="text-[#15803D]">
                                            {card.y_turnover || "N/A"}
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
