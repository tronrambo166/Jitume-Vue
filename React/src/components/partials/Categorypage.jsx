import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import SearchCategory from "./SearchCategory";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const CategoryPage = () => {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [turnoverRange, setTurnoverRange] = useState([0, 100]);
    const [amountRange, setAmountRange] = useState([0, 100]);
    const [maxPrice, setMaxPrice] = useState(100); // Default maximum price
    const [maxTurnover, setMaxTurnover] = useState(100); // Default maximum turnover

    const { name } = useParams();

    // Helper function to calculate marks dynamically
    const calculateMarks = (maxValue) => {
        const stepSize = maxValue <= 10 ? 1 : Math.ceil(maxValue / 5);
        const marks = {};
        for (let i = 0; i <= maxValue; i += stepSize) {
            marks[i] = i.toLocaleString(); // Format numbers for display
        }
        return { marks, step: stepSize };
    };

    const { marks: sliderMarks, step: stepAmount } = calculateMarks(maxPrice);
    const { marks: sliderMarksTurnover, step: stepTurnover } =
        calculateMarks(maxTurnover);

    useEffect(() => {
        const parseInvestment = (value) =>
            parseFloat(value.replace(/,/g, "")) || 0;
        const parseTurnover = (value) => {
            const parts = value.split("-").map((v) => parseFloat(v) || 0);
            return Math.max(...parts);
        };

        const categoryResults = () => {
            axiosClient
                .get("/categoryResults/" + name)
                .then(({ data }) => {
                    setCards(data.data);
                    setFilteredCards(data.data);

                    const maxInvestment = Math.max(
                        ...data.data.map((card) =>
                            parseInvestment(card.investment_needed)
                        )
                    );
                    const maxTurnoverValue = Math.max(
                        ...data.data.map((card) =>
                            parseTurnover(card.y_turnover)
                        )
                    );

                    setMaxPrice(maxInvestment || 100);
                    setMaxTurnover(maxTurnoverValue || 100);
                    setAmountRange([0, maxInvestment]);
                    setTurnoverRange([0, maxTurnoverValue]);
                    setLoading(false);
                })
                .catch((err) => console.error(err));
        };

        categoryResults();
    }, [name]);

    const filterCards = () => {
        const filtered = cards.filter((card) => {
            const investmentNeeded =
                parseFloat(card.investment_needed.replace(/,/g, "")) || 0;
            const turnoverParts = card.y_turnover
                .split("-")
                .map((v) => parseFloat(v) || 0);
            const turnover = Math.max(...turnoverParts);

            return (
                investmentNeeded >= amountRange[0] &&
                investmentNeeded <= amountRange[1] &&
                turnover >= turnoverRange[0] &&
                turnover <= turnoverRange[1]
            );
        });
        setFilteredCards(filtered);
    };

    const handleTurnoverChange = (value) => setTurnoverRange(value);
    const handleAmountChange = (value) => setAmountRange(value);

    useEffect(() => {
        filterCards();
    }, [turnoverRange, amountRange]);
    const [isRangeOpen, setIsRangeOpen] = useState(false);
    const toggleCollapse = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.toggle("hidden");
        }
    };

    return (
        <div className="p-6 max-w-screen-xl mx-auto w-full sm:p-8 lg:p-10">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                What Are You Looking For?
            </h1>
            <div className="w-full mb-6 mx-auto max-w-[84vw]">
                <SearchCategory />
            </div>
            <div className="space-y-6 mb-10">
                <div className="flex flex-col md:flex-row gap-6 ">
                    {/* Amount Range */}
                    <div className="border border-gray-300 py-10 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex-1">
                        {/* COLLAPSE RANGE */}
                        <div className="mt-4 hidden" id="collapseAmountRange">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col w-1/2 pr-2 space-y-2">
                                    <label
                                        htmlFor="minAmount"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Min:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        id="minAmount"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="minAmount"
                                        onChange={(e) =>
                                            UpdateValuesMin(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col w-1/2 pl-2 space-y-2">
                                    <label
                                        htmlFor="maxAmount"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Max:
                                    </label>
                                    <input
                                        type="number"
                                        id="maxAmount"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="maxAmount"
                                        onChange={(e) =>
                                            UpdateValuesMax(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg w-32 mx-auto hover:bg-green-700 transition-colors"
                                onClick={() => {
                                    rangeSliderInitialize();
                                    toggleCollapse("collapseAmountRange");
                                }}
                            >
                                Set
                            </button>
                        </div>

                        {/* COLLAPSE BUTTON */}
                        <button
                            onClick={() =>
                                toggleCollapse("collapseAmountRange")
                            }
                            className="mr-4 my-2 border rounded-full px-3 py-1"
                        >
                            Set Range
                        </button>

                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            Amount Range
                        </h3>

                        <Slider
                            range
                            min={0}
                            max={maxPrice}
                            step={100}
                            value={amountRange}
                            onChange={handleAmountChange}
                            trackStyle={{
                                backgroundColor: "#15803D",
                                height: "10px",
                            }}
                            handleStyle={{
                                borderColor: "white",
                                height: "18px",
                                width: "18px",
                                marginTop: "-4px",
                                backgroundColor: "#15803D",
                                borderRadius: "50%",
                                border: "2px solid white",
                            }}
                            marks={sliderMarks}
                            activeDotStyle={{ display: "none" }}
                            dotStyle={{ display: "none" }}
                        />

                        <div className="flex justify-between mt-6 text-gray-600 dark:text-gray-400 text-sm">
                            <span>${amountRange[0].toLocaleString()}</span>
                            <span>${amountRange[1].toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Turnover Range */}
                    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex-1">
                        {/* COLLAPSE RANGE */}
                        <div className="mt-4 hidden" id="collapseTurnoverRange">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col w-1/2 pr-2 space-y-2">
                                    <label
                                        htmlFor="minTurnover"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Min:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        id="minTurnover"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="minTurnover"
                                        onChange={(e) =>
                                            UpdateValuesMin(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col w-1/2 pl-2 space-y-2">
                                    <label
                                        htmlFor="maxTurnover"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Max:
                                    </label>
                                    <input
                                        type="number"
                                        id="maxTurnover"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="maxTurnover"
                                        onChange={(e) =>
                                            UpdateValuesMax(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg w-32 mx-auto hover:bg-green-700 transition-colors"
                                onClick={() => {
                                    rangeSliderInitialize();
                                    toggleCollapse("collapseTurnoverRange");
                                }}
                            >
                                Set
                            </button>
                        </div>

                        {/* COLLAPSE BUTTON */}
                        <button
                            onClick={() =>
                                toggleCollapse("collapseTurnoverRange")
                            }
                            className="mr-4 my-2 border rounded-full px-3 py-1"
                        >
                            Set Range
                        </button>

                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            Turnover Range
                        </h3>

                        <Slider
                            range
                            min={0}
                            max={maxTurnover}
                            step={100}
                            value={turnoverRange}
                            onChange={handleTurnoverChange}
                            trackStyle={{
                                backgroundColor: "#15803D",
                                height: "10px",
                            }}
                            handleStyle={{
                                borderColor: "white",
                                height: "18px",
                                width: "18px",
                                marginTop: "-4px",
                                backgroundColor: "#15803D",
                                borderRadius: "50%",
                                border: "2px solid white",
                            }}
                            marks={sliderMarksTurnover}
                            activeDotStyle={{ display: "none" }}
                            dotStyle={{ display: "none" }}
                        />

                        <div className="flex justify-between mt-6 text-gray-600 dark:text-gray-400 text-sm">
                            <span>${turnoverRange[0].toLocaleString()}</span>
                            <span>${turnoverRange[1].toLocaleString()}</span>
                        </div>
                    </div>
                </div>
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
