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

    const [collapseAmountRange, setCollapseAmountRange] = useState(false);
    const [collapseTurnoverRange, setCollapseTurnoverRange] = useState(false);

    const toggleAmountRange = () => {
        setCollapseAmountRange(!collapseAmountRange);
        // Ensure the other collapsible section remains unaffected
        setCollapseTurnoverRange(false);
    };

    const [activeCollapse, setActiveCollapse] = useState(null);

    const toggleTurnoverRange = () => {
        setCollapseTurnoverRange(!collapseTurnoverRange);
        // Ensure the other collapsible section remains unaffected
        setCollapseAmountRange(false);
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
           // Toggle the 'hidden' class depending on whether the element is currently visible
           element.classList.toggle(
               "hidden",
               !element.classList.contains("hidden")
           );
       }
   };

    // Handle slide change for Amount Range
    const HandleSlideChange = () => {
        const minAmount =
            parseFloat(document.getElementById("minAmount").value) || 0;
        const maxAmount =
            parseFloat(document.getElementById("maxAmount").value) || maxPrice;

        setAmountRange([minAmount, maxAmount]);
        setMaxPrice(maxAmount);

        toggleCollapse("collapseAmountRange"); // Close the range input section
    };

    // Handle slide change for Turnover Range
    const HandleSlideChange2 = () => {
        const minTurnover =
            parseFloat(document.getElementById("minTurnover").value) || 0;
        const maxTurnover =
            parseFloat(document.getElementById("maxTurnover").value) ||
            maxTurnover;

        setTurnoverRange([minTurnover, maxTurnover]);
        setMaxTurnover(maxTurnover);

        toggleCollapse("collapseTurnoverRange"); // Close the range input section
    };

    return (
        <div className="p-6 max-w-screen-xl mx-auto w-full sm:p-8 lg:p-10">
            <h1 className="text-4xl md:text-6xl mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                What Are You Looking For?
            </h1>
            <div className="w-full mb-6 mx-auto max-w-[84vw]">
                <SearchCategory />
            </div>
            <div className="space-y-8 mb-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Amount Range */}
                    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-6 flex-1">
                        {/* COLLAPSE BUTTON */}
                        <button
                            onClick={() => {
                                toggleCollapse("collapseAmountRange");
                            }}
                            className="border border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 rounded-full px-4 py-1 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                        >
                            Set Range
                        </button>

                        <h3 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">
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
                            activeDotStyle={{ display: "none" }}
                            dotStyle={{ display: "none" }}
                        />

                        <div className="flex justify-between mt-6 text-gray-600 dark:text-gray-400 text-sm">
                            <span>${amountRange[0].toLocaleString()}</span>
                            <span>${amountRange[1].toLocaleString()}</span>
                        </div>

                        <div className="mt-4 hidden" id="collapseAmountRange">
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex flex-col w-1/2 space-y-2">
                                    <label
                                        htmlFor="minAmount"
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Min:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        id="minAmount"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                        name="minAmount"
                                    />
                                </div>

                                <div className="flex flex-col w-1/2 space-y-2">
                                    <label
                                        htmlFor="maxAmount"
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Max:
                                    </label>
                                    <input
                                        type="number"
                                        id="maxAmount"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                        name="maxAmount"
                                    />
                                </div>
                            </div>

                            <button
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg w-full sm:w-32 hover:bg-green-700 transition-colors"
                                onClick={HandleSlideChange} // Pass the function here
                            >
                                Set
                            </button>
                        </div>
                    </div>

                    {/* Turnover Range */}
                    <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-6  flex-1">
                        <button
                            onClick={() =>
                                toggleCollapse("collapseTurnoverRange")
                            }
                            className="border border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 rounded-full px-4 py-1 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                        >
                            Set Range
                        </button>

                        <h3 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">
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
                            activeDotStyle={{ display: "none" }}
                            dotStyle={{ display: "none" }}
                        />

                        <div className="flex justify-between mt-6 text-gray-600 dark:text-gray-400 text-sm">
                            <span>${turnoverRange[0].toLocaleString()}</span>
                            <span>${turnoverRange[1].toLocaleString()}</span>
                        </div>

                        <div className="mt-4 hidden" id="collapseTurnoverRange">
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex flex-col w-1/2 space-y-2">
                                    <label
                                        htmlFor="minTurnover"
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Min:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        id="minTurnover"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                        name="minTurnover"
                                    />
                                </div>

                                <div className="flex flex-col w-1/2 space-y-2">
                                    <label
                                        htmlFor="maxTurnover"
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Max:
                                    </label>
                                    <input
                                        type="number"
                                        id="maxTurnover"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                        name="maxTurnover"
                                    />
                                </div>
                            </div>

                            <button
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg w-full sm:w-32 hover:bg-green-700 transition-colors"
                                onClick={HandleSlideChange2} // Pass the function here
                            >
                                Set
                            </button>
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
