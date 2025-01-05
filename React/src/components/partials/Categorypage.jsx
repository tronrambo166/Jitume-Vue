import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import SearchCategory from "./SearchCategory";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import BackBtn from "./BackBtn";
import CardsPagination from "./CardsPagination";

const CategoryPage = () => {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [turnoverRange, setTurnoverRange] = useState([0, 100]);
    const [amountRange, setAmountRange] = useState([0, 100]);
    const [maxPrice, setMaxPrice] = useState(100);
    const [maxTurnover, setMaxTurnover] = useState(100);
    const [locationQuery, setLocationQuery] = useState("");
    const [nameQuery, setNameQuery] = useState(""); // Name query

    const { name } = useParams();

    // Helper function to calculate marks dynamically

    const [collapseAmountRange, setCollapseAmountRange] = useState(false);
    const [collapseTurnoverRange, setCollapseTurnoverRange] = useState(false);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Items per page (adjust as needed)

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

    const calculateMarks = (maxValue) => {
        const stepSize = maxValue <= 10 ? 1 : Math.ceil(maxValue / 5);
        const marks = {};
        for (let i = 0; i <= maxValue; i += stepSize) {
            marks[i] = i.toLocaleString(); // Format numbers for display
        }
        return { marks, step: stepSize };
    };

    const { marks: sliderMarks } = calculateMarks(maxPrice);
    const { marks: sliderMarksTurnover } = calculateMarks(maxTurnover);
    const step = Math.round(maxPrice / 100); // Determine step size for slider marks

    for (let i = 0; i <= maxPrice; i += step) {
        sliderMarks[i] = i % (step * 5) === 0 ? "|" : ""; // Vertical line every 5 steps
    }
    const step2 = Math.round(maxTurnover / 100); // Determine step size for slider marks

    for (let i = 0; i <= maxTurnover; i += step2) {
        sliderMarksTurnover[i] = i % (step2 * 5) === 0 ? "|" : ""; // Vertical line every 5 steps
    }

    const [maxx, setMaxx] = useState(0); // Default maximum investment
    const [maxx2, setMaxx2] = useState(0); // Default maximum turnover

    const [minn, setMinn] = useState(0); // Default minimum investment
    const [minn2, setMinn2] = useState(0); // Default minimum turnover

    // Function to format numbers with commas
    const formatWithCommas = (value) => {
        return new Intl.NumberFormat().format(value);
    };

    useEffect(() => {
        const parseInvestment = (value) =>
            parseFloat(value.replace(/,/g, "")) || 0;
        const parseTurnover = (value) => {
            const parts = value.split("-").map((v) => parseFloat(v) || 0);
            return Math.max(...parts);
        };

        const categoryResults = async () => {
            try {
                const { data } = await axiosClient.get(
                    "/categoryResults/" + name
                );
                setCards(data.data);
                setFilteredCards(data.data);

                // Ensure the data is valid before mapping
                const investments = data.data.map((card) =>
                    parseInvestment(card.investment_needed)
                );
                const turnovers = data.data.map((card) =>
                    parseTurnover(card.y_turnover)
                );

                const maxInvestment = Math.max(...investments, 0); // Fallback to 0
                const maxTurnoverValue = Math.max(...turnovers, 0); // Fallback to 0

                const minInvestment = Math.min(...investments, 0); // Fallback to 0
                const minTurnoverValue = Math.min(...turnovers, 0); // Fallback to 0

                // Set ranges dynamically
                setMaxx(maxInvestment);
                setMinn(minInvestment);
                setMaxx2(maxTurnoverValue);
                setMinn2(minTurnoverValue);

                // Update sliders
                setAmountRange([minInvestment, maxInvestment]);
                setTurnoverRange([minTurnoverValue, maxTurnoverValue]);

                setMaxPrice(maxInvestment);
                setMaxTurnover(maxTurnoverValue);

                setLoading(false);
            } catch (err) {
            }
        };

        categoryResults();
    }, [name]);

   


    const filterCardsByLocationAndName = () => {
        setLoading(true); // Trigger loading for location and name filters

        setTimeout(() => {
            const filtered = cards.filter((card) => {
                const investmentNeeded =
                    parseFloat(card.investment_needed.replace(/,/g, "")) || 0;

                // Parse the turnover range
                const turnoverRangeArray = card.y_turnover
                    .split("-")
                    .map((v) => parseFloat(v.trim()) || 0);
                const minTurnoverValue = Math.min(...turnoverRangeArray);
                const maxTurnoverValue = Math.max(...turnoverRangeArray);

                // Check for overlap with the selected turnover range
                const turnoverInRange =
                    minTurnoverValue <= turnoverRange[1] &&
                    maxTurnoverValue >= turnoverRange[0];

                return (
                    investmentNeeded >= amountRange[0] &&
                    investmentNeeded <= amountRange[1] &&
                    turnoverInRange &&
                    (locationQuery === "" ||
                        card.location
                            .toLowerCase()
                            .includes(locationQuery.toLowerCase())) &&
                    (nameQuery === "" ||
                        card.name
                            .toLowerCase()
                            .includes(nameQuery.toLowerCase()))
                );
            });

            setFilteredCards(filtered);
            setLoading(false); // Stop loading
        }, 2000); // Add a 2-second delay
    };

    const filterCards = () => {
        const filtered = cards.filter((card) => {
            const investmentNeeded =
                parseFloat(card.investment_needed.replace(/,/g, "")) || 0;

            // Parse the turnover range
            const turnoverRangeArray = card.y_turnover
                .split("-")
                .map((v) => parseFloat(v.trim()) || 0);
            const minTurnoverValue = Math.min(...turnoverRangeArray);
            const maxTurnoverValue = Math.max(...turnoverRangeArray);

            // Check for overlap with the selected turnover range
            const turnoverInRange =
                minTurnoverValue <= turnoverRange[1] &&
                maxTurnoverValue >= turnoverRange[0];

            return (
                investmentNeeded >= amountRange[0] &&
                investmentNeeded <= amountRange[1] &&
                turnoverInRange
            );
        });

        setFilteredCards(filtered);
    };

    // Trigger `filterCardsByLocationAndName` when name or location changes
    useEffect(() => {
        if (locationQuery || nameQuery) {
            filterCardsByLocationAndName();
        } else {
            filterCards(); // Apply other filters without loading
        }
    }, [locationQuery, nameQuery]);

    // Trigger `filterCards` for amount and turnover range changes
    useEffect(() => {
        filterCards();
    }, [amountRange, turnoverRange]);

    useEffect(() => {
        filterCards();
    }, [amountRange, turnoverRange, locationQuery, nameQuery]);

    
    const handleTurnoverChange = (value) => setTurnoverRange(value);
    const handleAmountChange = (value) => setAmountRange(value);

    useEffect(() => {
        filterCards();
    }, [turnoverRange, amountRange]);
    const [isRangeOpen, setIsRangeOpen] = useState(false);

    const toggleCollapse = (id) => {
        const element = document.getElementById(id);
        const slider = document.getElementById("sliderElement"); // ID for the slider container
        const amountRangeDisplay =
            document.getElementById("amountRangeDisplay"); // ID for the amount range display section
        if (element) {
            // Toggle the 'hidden' class depending on whether the element is currently visible
            element.classList.toggle(
                "hidden",
                !element.classList.contains("hidden")
            );

            // Hide the slider and amountRangeDisplay when collapse is opened
            if (!element.classList.contains("hidden")) {
                if (slider) slider.classList.add("hidden");
                if (amountRangeDisplay)
                    amountRangeDisplay.classList.add("hidden");
            } else {
                if (slider) slider.classList.remove("hidden");
                if (amountRangeDisplay)
                    amountRangeDisplay.classList.remove("hidden");
            }
        }
    };

    const toggleCollapse2 = (collapseId, sliderId, rangeDisplayId) => {
        const collapseElement = document.getElementById(collapseId);
        const slider = document.getElementById(sliderId);
        const amountRangeDisplay = document.getElementById(rangeDisplayId);

        if (collapseElement) {
            const isHidden = collapseElement.classList.contains("hidden");

            collapseElement.classList.toggle("hidden", !isHidden);

            if (isHidden) {
                if (slider) slider.classList.add("hidden");
                if (amountRangeDisplay)
                    amountRangeDisplay.classList.add("hidden");
            } else {
                if (slider) slider.classList.remove("hidden");
                if (amountRangeDisplay)
                    amountRangeDisplay.classList.remove("hidden");
            }
        }
    };

    // Handle slide change for Amount Range
    const HandleSlideChange = () => {
        // Remove commas and parse the input values as floats
        const minAmount =
            parseFloat(
                document.getElementById("minAmount").value.replace(/,/g, "")
            ) || 0;
        const maxAmount =
            parseFloat(
                document.getElementById("maxAmount").value.replace(/,/g, "")
            ) || maxPrice;

        setAmountRange([minAmount, maxAmount]);
        setMaxPrice(maxAmount);

        toggleCollapse("collapseAmountRange"); // Close the range input section
    };

    // Handle slide change for Turnover Range
    const HandleSlideChange2 = () => {
        // Remove commas and parse the input values as floats
        const minTurnover =
            parseFloat(
                document.getElementById("minTurnover").value.replace(/,/g, "")
            ) || 0;
        const maxTurnover =
            parseFloat(
                document.getElementById("maxTurnover").value.replace(/,/g, "")
            ) || maxTurnover;

        setTurnoverRange([minTurnover, maxTurnover]);
        setMaxTurnover(maxTurnover);

        // Close the range input section
        toggleCollapse2(
            "collapseTurnoverRange",
            "sliderElement1",
            "amountRangeDisplay1"
        );

        // Reopen the slider and range display by removing 'hidden' class
        setTimeout(() => {
            document
                .getElementById("sliderElement1")
                .classList.remove("hidden");
            document
                .getElementById("amountRangeDisplay1")
                .classList.remove("hidden");
        }, 300); // Add delay if needed for smooth transition
    };



    
    const Cancel = () => {
        toggleCollapse("collapseAmountRange");
    };
    const cancelTurnover = () => {
        toggleCollapse2(
            "collapseTurnoverRange",
            "sliderElement1",
            "amountRangeDisplay1"
        );
    };
     const Clear = () => {
         // Reset state to the initial min and max values
         setAmountRange([minn, maxx]);
         setMaxPrice(maxx);

         // Check if the elements exist before attempting to set their values
         const minAmountElement = document.getElementById("minAmount");
         const maxAmountElement = document.getElementById("maxAmount");
         const minTurnoverElement = document.getElementById("minTurnover");
         const maxTurnoverElement = document.getElementById("maxTurnover");

         if (minAmountElement && maxAmountElement) {
             minAmountElement.value = formatWithCommas(minn);
             maxAmountElement.value = formatWithCommas(maxx);
         }

         if (minTurnoverElement && maxTurnoverElement) {
             minTurnoverElement.value = formatWithCommas(minn2);
             maxTurnoverElement.value = formatWithCommas(maxx2);
         }

         // Reset turnover values if applicable
         setTurnoverRange([minn2, maxx2]);

         // Reset filtered cards to the original full list
         setFilteredCards(cards);

         // Clear Inputs
          setMinAmount("");
          setMaxAmount("");
        //   clearing location
        setLocationQuery("");
        setNameQuery("");

         // Log or provide feedback for better UX
     };

    const Clear2 = () => {
        // Reset the turnover range slider to the initial min and max values
        setTurnoverRange([minn2, maxx2]);

        // Check if the elements exist before attempting to clear their values
        const minTurnoverElement = document.getElementById("minTurnover");
        const maxTurnoverElement = document.getElementById("maxTurnover");

        if (minTurnoverElement && maxTurnoverElement) {
            // Reset the input fields to the default range values
            minTurnoverElement.value = formatWithCommas(minn2);
            maxTurnoverElement.value = formatWithCommas(maxx2);
        }

        // Optionally, if you want to set state for input fields as well:
        setMinTurnover(minn2);
        setMaxTurnover(maxx2);

        // Reset filtered cards to the original full list
        setFilteredCards(cards);

        // Clear Inputs
        setMinTurnover("");
        setMaxTurnoveR("");

        // clearing location
        setLocationQuery("");
        setNameQuery("");

        // Log or provide feedback for better UX (optional)
    };


    // comas logic
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

    const handleInputChange = (e, setAmount) => {
        let value = e.target.value;
        value = value.replace(/,/g, ""); // Remove any commas already in the input
        if (!isNaN(value)) {
            setAmount(value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // Add commas
        }
    };
    const [minTurnover, setMinTurnover] = useState("");
    const [maxTurnoveR, setMaxTurnoveR] = useState("");

    const handleInputChange2 = (e, setAmount) => {
        let value = e.target.value;
        value = value.replace(/,/g, ""); // Remove any commas already in the input
        if (!isNaN(value)) {
            setAmount(value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // Add commas
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCards = filteredCards.slice(startIndex, endIndex);

    return (
        <>
            <BackBtn />
            <div className="p-4 sm:p-6 lg:p-8 max-w-screen-lg xl:max-w-screen-xl mx-auto w-full">
                <h1 className="text-2xl sm:text-3xl md:text-6xl mb-4 sm:mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                    What Are You Looking For?
                </h1>

                <div className="w-full mb-6 mx-auto max-w-[84vw]">
                    <SearchCategory
                        value={{ locationQuery, nameQuery }} // Pass both queries here
                        setLocationQuery={setLocationQuery}
                        setNameQuery={setNameQuery}
                    />
                </div>
                <div className="space-y-8 mb-10">
                    <div></div>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Turnover Range */}
                        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-6 flex-1">
                            <div className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() =>
                                            toggleCollapse2(
                                                "collapseTurnoverRange",
                                                "sliderElement1",
                                                "amountRangeDisplay1"
                                            )
                                        }
                                        className="px-6 py-2 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-gray-100 hover:text-green-900 transition-colors"
                                    >
                                        Set Range
                                    </button>

                                    <label className="text-gray-700 font-semibold mt-2">
                                        Turnover Range
                                    </label>
                                </div>

                                <button
                                    className="ml-auto mb-6 px-6 py-2 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-green-100 transition-colors"
                                    onClick={Clear2}
                                >
                                    Clear
                                </button>
                            </div>

                            <div id="sliderElement1" className="py-4">
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
                                    marks={sliderMarksTurnover}
                                />
                            </div>

                            <div
                                id="amountRangeDisplay1"
                                className="flex justify-between mt-6 text-gray-600 dark:text-gray-400 text-sm"
                            >
                                <span>
                                    ${turnoverRange[0].toLocaleString()}
                                </span>
                                <span>
                                    ${turnoverRange[1].toLocaleString()}
                                </span>
                            </div>

                            <div
                                className="mt-4 hidden"
                                id="collapseTurnoverRange"
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex flex-col w-1/2 space-y-2">
                                        <label
                                            htmlFor="minTurnover"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Min: {minn2}
                                        </label>
                                        <input
                                            type="text"
                                            id="minTurnover"
                                            value={minTurnover}
                                            onChange={(e) =>
                                                handleInputChange2(
                                                    e,
                                                    setMinTurnover
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    document
                                                        .getElementById(
                                                            "maxTurnover"
                                                        )
                                                        .focus();
                                                }
                                            }}
                                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                            name="minTurnover"
                                        />
                                    </div>

                                    <div className="flex flex-col w-1/2 space-y-2">
                                        <label
                                            htmlFor="maxTurnover"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Max: {maxx2.toLocaleString()}
                                        </label>
                                        <input
                                            type="text"
                                            id="maxTurnover"
                                            value={maxTurnoveR}
                                            onChange={(e) =>
                                                handleInputChange2(
                                                    e,
                                                    setMaxTurnoveR
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    document
                                                        .getElementById(
                                                            "setButton"
                                                        )
                                                        .focus();
                                                }
                                            }}
                                            className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                            name="maxTurnover"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between">
                                    <button
                                        id="setButton"
                                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg sm:w-32 hover:bg-green-700 transition-colors"
                                        onClick={HandleSlideChange2}
                                    >
                                        Set
                                    </button>

                                    {/* Cancel Button */}
                                    <button
                                        className="px-6 py-2 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-red-100 hover:text-red-900 transition-colors"
                                        onClick={cancelTurnover}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Amount Range */}
                        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg p-6 flex-1">
                            {/* COLLAPSE BUTTON */}
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => {
                                            toggleCollapse(
                                                "collapseAmountRange"
                                            );
                                        }}
                                        className="px-6 py-2 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-gray-100 hover:text-green-900 transition-colors"
                                    >
                                        Set Range
                                    </button>
                                    <label className="text-gray-700 font-semibold mt-2">
                                        Amount Range
                                    </label>
                                </div>

                                <button
                                    className="ml-4 px-6 py-2 mb-6 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-green-100 transition-colors"
                                    onClick={Clear}
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="py-4" id="sliderElement">
                                <Slider
                                    range
                                    min={0}
                                    max={maxPrice}
                                    step={100}
                                    value={amountRange} // Controlled component
                                    onChange={handleAmountChange} // Handles state changes
                                    trackStyle={[
                                        {
                                            backgroundColor: "#15803D",
                                            height: "10px",
                                        },
                                    ]} // Array for range styles
                                    handleStyle={[
                                        {
                                            borderColor: "white",
                                            height: "18px",
                                            width: "18px",
                                            marginTop: "-4px",
                                            backgroundColor: "#15803D",
                                            borderRadius: "50%",
                                            border: "2px solid white",
                                        },
                                        {
                                            borderColor: "white",
                                            height: "18px",
                                            width: "18px",
                                            marginTop: "-4px",
                                            backgroundColor: "#15803D",
                                            borderRadius: "50%",
                                            border: "2px solid white",
                                        },
                                    ]} // Separate handles for range slider
                                    activeDotStyle={{ display: "none" }}
                                    dotStyle={{ display: "none" }}
                                    marks={sliderMarks}
                                />
                            </div>
                            <div
                                className="flex justify-between mt-6 text-gray-600 dark:text-gray-400 text-sm"
                                id="amountRangeDisplay"
                            >
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
                Min: {minn}
            </label>
            <input
                type="text"
                id="minAmount"
                value={minAmount}
                onChange={(e) => handleInputChange(e, setMinAmount)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        document.getElementById("maxAmount").focus();
                    }
                }}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                name="minAmount"
            />
        </div>

        <div className="flex flex-col w-1/2 space-y-2">
            <label
                htmlFor="maxAmount"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                Max: {maxx.toLocaleString()}
            </label>

            <input
                type="text"
                id="maxAmount"
                value={maxAmount}
                onChange={(e) => handleInputChange(e, setMaxAmount)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        document.getElementById("setAmountButton").focus();
                    }
                }}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-green-300 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                name="maxAmount"
            />
        </div>
    </div>

    <div className="mt-4 flex justify-between">
        <button
            id="setAmountButton"
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg sm:w-32 hover:bg-green-700 transition-colors"
            onClick={HandleSlideChange} // Pass the function here
        >
            Set
        </button>

        {/* Cancel Button */}
        <button
            className="px-6 py-2 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-red-100 hover:text-red-900 transition-colors"
            onClick={Cancel}
        >
            Cancel
        </button>
    </div>
</div>

                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
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
                            filteredCards
                                .slice(
                                    (currentPage - 1) * itemsPerPage,
                                    currentPage * itemsPerPage
                                )
                                .map((card) => (
                                    <Link
                                        to={`/listing/${btoa(btoa(card.id))}`}
                                        key={card.id}
                                        className="flex-shrink-0 w-full sm:w-[320px] md:w-[350px] lg:w-[390px] bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden"
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
                                            <p className="text-sm sm:text-base text-gray-600 mt-2 truncate-multiline">
                                                {card.description ||
                                                    "Lorem ipsum dolor sit amet consectetur. Eu quis vel pellentesque ullamcorper donec lorem auctor egestas adipiscing."}
                                            </p>

                                            <p className="text-black space-x-2 font-semibold mt-2">
                                                <span className="text-[#1E293B] jakarta">
                                                    Amount Requested:
                                                </span>
                                                <span className="text-[#15803D]">
                                                    {card.investment_needed.toLocaleString() ||
                                                        "N/A"}
                                                </span>
                                            </p>
                                            <p className="text-black space-x-2 font-semibold mt-2">
                                                <span className="text-[#1E293B] jakarta">
                                                    {" "}
                                                    Turnover:
                                                </span>
                                                <span className="text-[#15803D]">
                                                    {card.y_turnover
                                                        ? card.y_turnover
                                                              .split("-")
                                                              .map((value) =>
                                                                  parseInt(
                                                                      value
                                                                  ).toLocaleString()
                                                              )
                                                              .join("-")
                                                        : "N/A"}
                                                </span>
                                            </p>
                                        </div>
                                    </Link>
                                ))
                        )}
                    </div>
                )}
                <CardsPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredCards.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};
export default CategoryPage;
