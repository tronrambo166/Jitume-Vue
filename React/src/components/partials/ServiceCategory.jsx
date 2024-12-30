import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";
import SearchSevicesCategory from "./SearchSevicesCategory";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import BackBtn from "./BackBtn";
import CardsPagination from "./CardsPagination";

const CategoryPage = ({ categoryName }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const { name } = useParams();
    const [range, setRange] = useState([0, 0]); // Adjust range dynamically
    const [maxPrice, setMaxPrice] = useState(1000000); // Default maximum price

    const [minn, setMinn] = useState(0); // Default minimum price
    const [maxx, setMaxx] = useState(0); // Default maximum price
    const [locationQuery, setLocationQuery] = useState("");
    const [nameQuery, setNameQuery] = useState(""); // Name query

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Items per page (adjust as needed)

    useEffect(() => {
        // Fetch category results
        const fetchCategoryResults = () => {
            axiosClient
                .get(`/categoryResults/${name}`)
                .then(({ data }) => {
                    if (data.services && data.services.length > 0) {
                        setCards(data.services);
                        console.log(data);

                        const prices = data.services.map((card) => card.price);
                        const max = Math.max(...prices);
                        const min = Math.min(...prices);

                        setMinn(0);
                        setMaxx(max);
                        setMaxPrice(max);

                        // Load range from localStorage or set default
                        const savedRange = JSON.parse(
                            localStorage.getItem("sliderRange")
                        );
                        if (savedRange) {
                            setRange(savedRange);
                        } else {
                            setRange([0, max]);
                        }
                    }
                })
                .catch((err) => {
                    console.error("Error fetching category results:", err);
                })
                .finally(() => setLoading(false));
        };

        fetchCategoryResults();
    }, [name]);

    const handleAmountChange = (value) => {
        setRange(value); // Update the range
        console.log("Selected range:", value);
    };

    const filteredCards = cards.filter(
        (card) =>
            card.price >= range[0] && // Price filter
            card.price <= range[1] &&
            (card.location
                .toLowerCase()
                .includes(locationQuery.toLowerCase()) || // Location filter
                locationQuery === "") &&
            (card.name.toLowerCase().includes(nameQuery.toLowerCase()) || // Name filter
                nameQuery === "")
    );

    const sliderMarks = {};
    const step = Math.floor(maxPrice / 5); // Determine step size for slider marks

    // Create marks for the slider
    for (let i = 0; i <= maxPrice; i += step) {
        sliderMarks[i] = `$${(i / 1000).toFixed(1)}K`;
    }
    const toggleCollapse = (id) => {
        const element = document.getElementById(id);
        const slider = document.getElementById("sliderElement"); // ID for the slider container
        const amountRangeDisplay =
            document.getElementById("amountRangeDisplay"); // ID for the amount range display section

        if (element) {
            // Toggle visibility of the collapse section
            element.classList.toggle("hidden");

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
    const handleSetRange = () => {
        // Get the min value and remove commas before parsing
        const minAmount =
            parseFloat(
                document.getElementById("minAmount").value.replace(/,/g, "")
            ) || 0;

        // Get the max value and remove commas before parsing
        const maxAmount =
            parseFloat(
                document.getElementById("maxAmount").value.replace(/,/g, "")
            ) || maxPrice;

        setRange([minAmount, maxAmount]); // Set the range
        setMaxPrice(maxAmount); // Update maxPrice if necessary

        toggleCollapse("collapseAmountRange"); // Close the range input section
    };

    // comas logic
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

    // Function to format numbers with commas
    const formatNumberWithCommas = (value) => {
        value = value.replace(/,/g, ""); // Remove commas if any
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    };

    // Handle min amount input change
    const UpdateValuesMin = (value) => {
        setMinAmount(formatNumberWithCommas(value));
    };

    // Handle max amount input change
    const UpdateValuesMax = (value) => {
        setMaxAmount(formatNumberWithCommas(value));
    };
    const Cancel = () => {
        // Hide the dropdown by toggling its visibility
        toggleCollapse("collapseAmountRange");
    };
    const handleClear = () => {
        // Reset the range slider to its initial values (min and max)
        setRange([minn, maxx]); // Reset the slider range to its initial min and max values

        // Clear the input fields for min and max amount
        setMinAmount(minn); // Reset min input to initial min value
        setMaxAmount(maxx); // Reset max input to initial max value
        // Clear the input fields for min and max amount
        setMinAmount("");
        setMaxAmount("");
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
            <div className="p-6 max-w-screen-xl mx-auto space-y-10">
                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-6xl mb-4 sm:mb-6 md:mb-10 font-bold leading-tight text-center font-sharp-grotesk text-[#00290F]">
                    What Are You Looking For?
                </h1>

                {/* Search Category */}
                <div className="w-full mb-6 mx-auto max-w-[84vw]">
                    <SearchSevicesCategory
                        value={{ locationQuery, nameQuery }} // Pass both queries here
                        setLocationQuery={setLocationQuery}
                        setNameQuery={setNameQuery}
                    />
                </div>

                <div></div>
                {/* Amount Range Section */}
                <div className="border border-gray-200 rounded-lg p-6 md:p-8 bg-white ">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => {
                                    toggleCollapse("collapseAmountRange");
                                }}
                                className="px-6 py-2 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-gray-100 hover:text-green-900 transition-colors"
                            >
                                Set Range
                            </button>
                            <label className="text-gray-700 font-semibold mt-2">
                                Price Range
                            </label>
                        </div>

                        <button
                            onClick={handleClear}
                            className="px-6 py-2 mb-6 text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-green-100 transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="py-4" id="sliderElement">
                        {/* Slider element */}
                        <Slider
                            range
                            min={0}
                            max={maxPrice}
                            step={Math.round(maxPrice / 100)} // Dynamic step: divide maxPrice into 100 parts
                            value={range}
                            onChange={handleAmountChange}
                            trackStyle={{
                                backgroundColor: "#15803D", // Dark green for track
                                height: "8px",
                                borderRadius: "5px",
                            }}
                            handleStyle={{
                                borderColor: "white",
                                height: "24px",
                                width: "24px",
                                marginTop: "-8px",
                                backgroundColor: "#15803D", // Dark green for handles
                                borderRadius: "50%",
                                border: "2px solid white",
                            }}
                            activeDotStyle={{ display: "none" }}
                            dotStyle={{ display: "none" }}
                        />
                    </div>

                    <div
                        id="amountRangeDisplay"
                        className="flex justify-between mt-4 text-[#1E293B] text-sm"
                    >
                        <span>${range[0].toLocaleString()}</span>
                        <span>${range[1].toLocaleString()}</span>
                    </div>

                    {/* COLLAPSE RANGE */}
                    <div className="mt-6 hidden" id="collapseAmountRange">
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col w-1/2 pr-2 space-y-2">
                                <label
                                    htmlFor="minAmount"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Min: {minn}
                                </label>
                                <input
                                    type="text" // Change to text to allow commas
                                    min="0"
                                    id="minAmount"
                                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
                                    name="minAmount"
                                    value={minAmount}
                                    onChange={(e) =>
                                        UpdateValuesMin(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col w-1/2 pl-2 space-y-2">
                                <label
                                    htmlFor="maxAmount"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Max: {maxx.toLocaleString()}
                                </label>
                                <input
                                    type="text" // Change to text to allow commas
                                    id="maxAmount"
                                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
                                    name="maxAmount"
                                    value={maxAmount}
                                    onChange={(e) =>
                                        UpdateValuesMax(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg sm:w-32 hover:bg-green-700 transition-colors"
                                onClick={() => {
                                    handleSetRange();
                                }}
                            >
                                Set
                            </button>
                            <button
                                className="px-6 py-2  text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-red-100 hover:text-red-900 transition-colors"
                                onClick={Cancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification */}
                {/* <div className="mb-6">
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
            </div> */}

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
                            <>
                                {/* Display Paginated Cards */}
                                {filteredCards
                                    .slice(
                                        (currentPage - 1) * itemsPerPage,
                                        currentPage * itemsPerPage
                                    )
                                    .map((card) => (
                                        <Link
                                            to={`/service-details/${btoa(
                                                btoa(card.id)
                                            )}`}
                                            onClick={() => {
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: "smooth",
                                                });
                                            }}
                                            key={card.id}
                                            className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between "
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
                                                    {card.location ||
                                                        "Location not available"}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-2 truncate">
                                                    {card.details}
                                                </p>
                                                {/* <p className="text-black space-x-2 font-semibold mt-2">
                                    <span className="text-[#15803D]">
                                        ${card.price.toLocaleString()}
                                    </span>
                                    <span className="text-[#1E293B]">
                                        /Price
                                    </span>
                                </p> */}
                                                <div className="mt-4 bg-sky-50 p-3 rounded-lg">
                                                    <div className="text-sm text-gray-800 flex justify-between mt-2">
                                                        <span>
                                                            <strong>
                                                                Service Fee:{" "}
                                                            </strong>
                                                        </span>
                                                        <span>
                                                            <strong>
                                                                $
                                                                {card.price.toLocaleString()}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </>
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
