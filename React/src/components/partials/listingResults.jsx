import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faSearch,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "./footer";
import PriceRangeFilter from "./PriceRangeFilter";
import Navbar from "./Navbar";
import axiosClient from "../../axiosClient";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import ListingSearch from "../partials/ListingSearch";
// import noUiSlider from 'nouislider';
// import 'nouislider/dist/nouislider.css';
import CardsPagination from "./CardsPagination";
import Search from "../partials/ListingSearch";
import BackBtn from "./BackBtn";

// Dummy data
const ListingResults = () => {
    const categories = [
        { value: "Agriculture", label: "Agriculture" },
        { value: "Arts/Culture", label: "Arts/Culture" },
        { value: "Auto", label: "Auto" },
        {
            value: "Domestic (Home Help etc)",
            label: "Domestic (Home Help etc)",
        },
        { value: "Fashion", label: "Fashion" },
        { value: "Finance/Accounting", label: "Finance/Accounting" },
        { value: "Food", label: "Food" },
        { value: "Legal", label: "Legal" },
        { value: "Media/Internet", label: "Media/Internet" },
        { value: "Other", label: "Other" },
        { value: "Pets", label: "Pets" },
        { value: "Real Estate", label: "Real Estate" },
        { value: "Retail", label: "Retail" },
        { value: "Security", label: "Security" },
        { value: "Sports/Gaming", label: "Sports/Gaming" },
        {
            value: "Technology/Communications",
            label: "Technology/Communications",
        },
    ];

    const { resIds } = useParams();
    const { loc } = useParams();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [results, setResults] = useState("");
    // Amount side
    const [priceRange, setPriceRange] = useState([0, 1000000]); // Initial range
    const [result, setResult] = useState("");
    // const [maxRange, setMaxRange] = useState(1000000);
    const [maxRange, setMaxRange] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0); // State for storing max price

    const locationInputRef = useRef(null);
    const sliderRef = useRef(null);

    // const mapRef = useRef(null);

    if (results) var count = results.length;
    else var count = 0;

    let res = [];

    var max = maxRange;
    //else max = 1000000;

    var min = 0;
    var max2 = maxPrice;
    var min2 = 0;

    // Formatting with commas for display
    var formattedMax = max.toLocaleString();
    var formattedMin = min.toLocaleString();
    var formattedMax2 = max2.toLocaleString();
    var formattedMin2 = min2.toLocaleString();

    console.log(`Max: ${formattedMax}, Min: ${formattedMin}`);
    console.log(`Max2: ${formattedMax2}, Min2: ${formattedMin2}`);

    const openInNewTab = (url) => {
        window.open(url, "_blank");
    };
    // State for current page and total pages
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(4); // Number of cards per page

    const totalPages = results ? Math.ceil(results.length / cardsPerPage) : 0;

    // Calculate total pages

    // Calculate the cards to display on the current page
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = results
        ? results.slice(indexOfFirstCard, indexOfLastCard)
        : [];
    // Function to handle page changes
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        console.log("Total Pages: ", totalPages);
        console.log("Current Cards: ", currentCards);
    }, [results, currentPage]);

    //CORE METHODS
    useEffect(() => {
        const getResults = () => {
            axiosClient
                .get("/searchResults/" + base64_decode(resIds))
                .then(({ data }) => {
                    setResults(data.data);
                    res = data.data;
                    console.log("daraaaa", data);

                    // Calculate maximum turnover and investment values
                    const maxTurnover = Math.max(
                        ...data.data.map((item) => {
                            // Extract the upper limit from the range
                            const range = item.y_turnover.split("-");
                            const upperLimit = range[1]
                                ? range[1].replace(/,/g, "")
                                : "0"; // Remove commas and handle missing range
                            return parseFloat(upperLimit) || 0;
                        })
                    );

                    setMaxRange(maxTurnover); // Update max range for turnover

                    const maxInvestment = Math.max(
                        ...data.data.map(
                            (item) => parseFloat(item.investment_needed) || 0
                        )
                    );
                    setMaxPrice(maxInvestment); // Update max price for investment

                    localStorage.setItem("results", JSON.stringify(data.data));

                    var x = navigator.geolocation;
                    x.getCurrentPosition(success, failure);
                    document
                        .querySelector(".permission-granted-button")
                        .addEventListener("click", () => {
                            x.watchPosition(success, failure);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        getResults();
    }, []);

    useEffect(() => {
        // Ensure sliders initialize only when maxRange and maxPrice are updated
        if (maxRange > 0 && maxPrice > 0) {
            const slider = document.getElementById("slider");
            const slider2 = document.getElementById("slider2");

            if (slider && slider.noUiSlider && slider2 && slider2.noUiSlider) {
                slider.noUiSlider.destroy();
                slider2.noUiSlider.destroy();
            }

            setTimeout(() => {
                rangeSliderInitilize();
            }, 300);
            setTimeout(() => {
                amountSliderInitilize();
            }, 300);
        }
    }, [maxRange, maxPrice]);

    //RESUTLS 2
    const getResults2 = (type) => {
        axiosClient
            .get("/searchResults/" + base64_decode(resIds))
            .then(({ data }) => {
                setResults(data.data);
                res = data.data;
                //console.log(results);
                localStorage.setItem("results", JSON.stringify(data.data));

                var x = navigator.geolocation;
                x.getCurrentPosition(success, failure);
                document
                    .querySelector(".permission-granted-button")
                    .addEventListener("click", () => {
                        x.watchPosition(success, failure);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
            if(type == 'R'){
                max = maxRange;
                min = 0;
            }
            else{
                max2 = maxPrice;
                min2 = 0;
            }

            
    };
    //RESUTLS 2

    //Turnover(Nurul)
    const rangeSliderInitilize = () => {
        noUiSlider.create(slider, {
            start: [0, max],
            connect: true,
            range: {
                min: parseFloat(min),
                max: parseFloat(max),
            },
            step: 1000,
            margin: 600,
            pips: {
                stepped: true,
                density: 4,
            },
        });

        const skipValues = [
            document.getElementById("price_low"),
            document.getElementById("price_high"),
        ];

        slider.noUiSlider.on("update", function (values) {
            skipValues[0].innerHTML = `$${new Intl.NumberFormat().format(
                Math.round(values[0])
            )}`;
            skipValues[1].innerHTML = `$${new Intl.NumberFormat().format(
                Math.round(values[1])
            )}`;

            const preResults = localStorage.getItem("results");
            const savedResults = JSON.parse(preResults);

            const turnoverRange = {
                min: parseFloat(values[0]),
                max: parseFloat(values[1]),
            };
            const amountRange = slider2.noUiSlider.get(); // Get current amount range

            const filteredResults = filterResults(savedResults, turnoverRange, {
                min: parseFloat(amountRange[0]),
                max: parseFloat(amountRange[1]),
            });

            setResults(filteredResults);
            setCurrentPage(1);
        });
    };

    // Amount(OWEN)
    const amountSliderInitilize = () => {
        noUiSlider.create(slider2, {
            start: [0, 1000000],
            connect: true,
            range: {
                min: parseFloat(min2),
                max: parseFloat(max2),
            },
            step: 1000,
            margin: 600,
            pips: {
                stepped: true,
                density: 4,
            },
        });

        const skipValues = [
            document.getElementById("price_low2"),
            document.getElementById("price_high2"),
        ];

        slider2.noUiSlider.on("update", function (values) {
            skipValues[0].innerHTML = `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0, // Remove decimals
            }).format(values[0])}`;
            skipValues[1].innerHTML = `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0, // Remove decimals
            }).format(values[1])}`;

            const preResults = localStorage.getItem("results");
            const savedResults = JSON.parse(preResults);

            const amountRange = {
                min: parseFloat(values[0]),
                max: parseFloat(values[1]),
            };
            const turnoverRange = slider.noUiSlider.get(); // Get current turnover range

            const filteredResults = filterResults(
                savedResults,
                {
                    min: parseFloat(turnoverRange[0]),
                    max: parseFloat(turnoverRange[1]),
                },
                amountRange
            );

            setResults(filteredResults);
            setCurrentPage(1);
        });
    };

    const updateDisplay = (elements, handle, values) => {
        if (elements[handle]) {
            elements[handle].innerHTML = `$${values[handle]}`;
        }
    };

    const updateStateAndStorage = (roundedValues) => {
        setPriceRange(roundedValues);
        localStorage.setItem("amountResults", JSON.stringify(roundedValues));
        const filteredResults = filterResults(roundedValues);
        setResult(filteredResults);
    };

    const filterResults = (savedResults, turnoverRange, amountRange) => {
        return savedResults.filter((item) => {
            let matchesTurnover = false;
            let matchesAmount = false;

            // Turnover Filter
            if (item.y_turnover && typeof item.y_turnover === "string") {
                const [db_min, db_max] = item.y_turnover.split("-").map(Number);
                if (
                    db_min <= turnoverRange.max &&
                    db_max >= turnoverRange.min
                ) {
                    matchesTurnover = true;
                }
            }

            // Amount Filter
            if (
                item.investment_needed &&
                typeof item.investment_needed === "number"
            ) {
                const investmentAmount = item.investment_needed;
                if (
                    investmentAmount >= amountRange.min &&
                    investmentAmount <= amountRange.max
                ) {
                    matchesAmount = true;
                }
            }

            // Include results that match both filters
            return matchesTurnover && matchesAmount;
        });
    };

    //MAP -- MAP

    const success = (position) => {
        if ((loc == true || loc == "true") && res.length != 0) {
            var myLat = sessionStorage.getItem("queryLat"); // this.queryLat;
            var myLong = sessionStorage.getItem("queryLng"); // this.queryLng;
        } else {
            var myLat = position.coords.latitude;
            var myLong = position.coords.longitude;
        }

        var coords = [myLat, myLong];
        var mapOptions = {
            zoom: 8,
            center: coords,
            //center:new google.maps.LatLng(51.508742,-0.120850),
        };

        //MAP CONTAINER
        let map = new L.map("map", mapOptions);
        let layer = new L.TileLayer(
            "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        );
        map.addLayer(layer);

        Object.entries(res).map(([key, value]) => {
            //INFO
            const contentString =
                '<a className="info_map py-0 font-weight-bold  text-center" target="_blank" href="/listing/' +
                btoa(btoa(value.id)) +
                '">' +
                value.name +
                "</a>";

            //INFO
            const investment_needed = value.investment_needed / 1000 + "K";
            //this.addMarker({lat:value.lat, lng:value.lng},map,value.name,investment_needed,infowindow);
            var coord = [value.lat, value.lng];
            addMarker(coord, map, contentString);
        });

        addMarkerHome(coords, map);
    };

    const addMarker = (coords, map, contentString) => {
        let customIcon = {
            iconUrl: "../../images/map/other_business.png",
            iconSize: [32, 32],
        };
        let myIcon = L.icon(customIcon);

        let iconOptions = {
            title: "Spurs",
            draggable: true,
            icon: myIcon,
        };

        var marker = new L.Marker(coords, iconOptions);
        marker.addTo(map);
        marker.bindPopup(contentString).openPopup();
    };

    const addMarkerHome = (coords, map) => {
        let customIcon = {
            iconUrl: "../../images/map/myloc.png",
            iconSize: [32, 32],
        };
        let myIcon = L.icon(customIcon);

        let iconOptions = {
            title: "Spurs",
            draggable: true,
            icon: myIcon,
        };

        var marker = new L.Marker(coords, iconOptions);
        marker.addTo(map);
    };

    const failure = () => {};
    //MAP -- MAP

    //Range Function
    const collapse = () => {
        var slider = document.getElementById("slider");

        if (slider && slider.noUiSlider) {
            slider.noUiSlider.destroy();
            //$('.noUi-pips-horizontal').hide();
        }
        $("#collapseExample").removeClass("hidden");
        $("#colBut").addClass("hidden");
        $("#colBut2").removeClass("hidden");

        // Hide the price elements when collapse is activated
        $("#price_low").addClass("hidden");
        $("#price_high").addClass("hidden");
    };

    const hide = () => {
        $("#collapseExample").addClass("hidden");
        $("#price_low").removeClass("hidden");
        $("#price_high").removeClass("hidden");
        console.log(min,max)
    };

    const collapse2 = () => {
        var slider = document.getElementById("slider2");

        if (slider && slider.noUiSlider) {
            slider.noUiSlider.destroy();
        }
        $("#collapseExample2").removeClass("hidden");
        $("#colBut3").addClass("hidden");
        $("#colBut4").removeClass("hidden");

        // Hide the price elements when collapse2 is activated
        $("#price_low2").addClass("hidden");
        $("#price_high2").addClass("hidden");
    };

    const hide2 = () => {
        $("#collapseExample2").addClass("hidden");
        $("#price_low2").removeClass("hidden");
        $("#price_high2").removeClass("hidden");
        console.log(min,max)
    };

    //UPDATE NEW VALUES
    const UpdateValuesMin = (value) => {
        // Remove commas and update min
        min = value.replace(/,/g, "");
    };

    const UpdateValuesMax = (value) => {
        // Remove commas and update max
        max = value.replace(/,/g, "");
    };

    // Handling input change for min field
    const handleMinInput = (e) => {
        const formattedValue = formatNumberWithCommas(e.target.value);
        e.target.value = formattedValue; // Update the input field with the formatted value
        UpdateValuesMin(e.target.value); // Update min with the raw value without commas
    };

    // Handling input change for max field
    const handleMaxInput = (e) => {
        const formattedValue = formatNumberWithCommas(e.target.value);
        e.target.value = formattedValue; // Update the input field with the formatted value
        UpdateValuesMax(e.target.value); // Update max with the raw value without commas
    };

    // AMOUNT LOGIC
    const UpdateValuesMin2 = (value) => {
        // Remove commas before updating the value
        min2 = value.replace(/,/g, "");
    };

    const UpdateValuesMax2 = (value) => {
        // Remove commas before updating the value
        max2 = value.replace(/,/g, "");
    };

    const formatNumberWithCommas = (value) => {
        // Remove non-numeric characters except for the period (.)
        const numericValue = value.replace(/[^0-9.]/g, "");

        // Format the number with commas
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleMin2Input = (e) => {
        const formattedValue = formatNumberWithCommas(e.target.value);
        e.target.value = formattedValue; // Update the input field with the formatted value
        UpdateValuesMin2(e.target.value); // Update min2 with the value without commas
    };

    const handleMax2Input = (e) => {
        const formattedValue = formatNumberWithCommas(e.target.value);
        e.target.value = formattedValue; // Update the input field with the formatted value
        UpdateValuesMax2(e.target.value); // Update max2 with the value without commas
    };

    const clearRangeSlider = () => {
        var slider = document.getElementById("slider");
        if (slider && slider.noUiSlider) {
            slider.noUiSlider.destroy();
        }
        //min = 0;
        //max = 1000000;
    };
    const clearAmountSlider = () => {
        var slider2 = document.getElementById("slider2");
        if (slider2 && slider2.noUiSlider) {
            slider2.noUiSlider.destroy();
        }
        console.log(min,max)
    };

    //Range Function

    return (
        <>
            <BackBtn />
            <div className="w-full mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
                {/* <div className="flex mb-6 flex-col md:flex-row gap-4 justify-center pt-8 px-2 sm:px-6 md:px-4 items-center w-full max-w-3xl mx-auto">
                <input
                    type="text"
                    className="border py-2 text-md px-4 border-[#666666]/30 rounded-xl focus:outline-none w-full md:flex-1"
                    placeholder="What are you looking for?"
                    style={{ textAlign: "center" }}
                />
                <div className="relative w-full md:flex-1">
                    <input
                        type="text"
                        placeholder="Location"
                        className="border border-[#666666]/30 w-full text-md rounded-xl py-2 px-10 focus:outline-none"
                        style={{ textAlign: "center" }}
                        ref={locationInputRef}
                    />
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        className="absolute right-3 ml-2 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                    />
                </div>
                <Select
                    className="w-full md:flex-1"
                    options={categories}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Select a category"
                    isClearable
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            borderRadius: "12px",
                            padding: "2px 0", // Adjust this value as needed
                        }),
                    }}
                />
                <button className="btn-primary w-full md:w-auto py-3 rounded-full px-4 focus:outline-none mt-4 md:mt-0">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div> */}
                <div className="pt-4">
                    {/*<ListingSearch />*/}
                    <Search />
                </div>

                {/* Turnover Range Slider */}
                <div className="flex flex-col lg:flex-row items-center gap-6 my-6">
                    <div
                        id="turnover_slider"
                        className="w-full jakarta text-md border border-[#cbd5e1] rounded-lg space-y-2 px-6 py-4 mt-1"
                    >
                        <div class="flex justify-between items-center">
                            <button
                                onClick={collapse}
                                id="colBut4"
                                className="px-6 py-2  text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-gray-100 hover:text-green-900 transition-colors"
                                name="min"
                            >
                                Set Range
                            </button>

                            <button
                                className="px-6 py-2  text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-green-100 transition-colors"
                                onClick={(event) => {
                                    clearRangeSlider();
                                    rangeSliderInitilize();
                                    getResults2();
                                }}
                            >
                                Clear
                            </button>
                        </div>

                        <label className="text-gray-700 font-semibold mb-2">
                            Turnover Range
                        </label>

                        <div id="slider" className=""></div>

                        <div className="row mt-3 jakarta">
                            <div className="col-6 mt-1">
                                <span
                                    id="price_low"
                                    className="py-0 text-sm"
                                    name="min"
                                ></span>
                            </div>
                            <div className="col-6 mt-1 pr-0">
                                <span
                                    id="price_high"
                                    className="float-right py-0 text-sm"
                                    name="min"
                                ></span>
                            </div>
                        </div>

                        {/* COLLAPSE RANGE */}
                        <div className="mt-3 hidden" id="collapseExample">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label
                                        htmlFor="low"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Min: {formattedMin}
                                    </label>
                                    <input
                                        type="text"
                                        id="low"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="min"
                                        onChange={handleMinInput}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label
                                        htmlFor="high"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Max: {formattedMax}
                                    </label>
                                    <input
                                        type="text"
                                        id="high"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="max"
                                        onChange={handleMaxInput}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between items-center w-full">
                                <button
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg sm:w-32 hover:bg-green-700 transition-colors"
                                    onClick={(event) => {
                                        rangeSliderInitilize();
                                        hide();
                                    }}
                                >
                                    Set
                                </button>

                                <button
                                    className="px-6 py-2  text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-red-100 hover:text-red-900 transition-colors"
                                    onClick={(event) => {
                                        getResults2('R');
                                        rangeSliderInitilize();
                                        hide();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        {/* COLLAPSE RANGE */}
                    </div>

                    {/* Turnover Range Slider */}


                    {/* Amount Slider Starts */}

                    <div
                        id="amount_slider"
                        className="w-full jakarta   text-md border border-[#cbd5e1] rounded-lg space-y-2 px-6 py-4  mt-1"
                    >
                        <div class="flex justify-between items-center">
                            <button
                                onClick={collapse2}
                                id="colBut4"
                                className="px-6 py-2  text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-gray-100 hover:text-green-900 transition-colors"
                                name="min"
                            >
                                Set Range
                            </button>

                            <button
                                className="px-6 py-2  text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-green-100 transition-colors"
                                onClick={(event) => {
                                    clearAmountSlider();
                                    //getResults2();
                                    //rangeSliderInitilize();
                                }}
                            >
                                Clear
                            </button>
                        </div>

                        <label className="text-gray-700 font-semibold mb-2">
                            Amount Range
                        </label>

                        <div id="slider2" className=""></div>
                        <div className="row mt-3 jakarta">
                            <div className="col-6 mt-1">
                                <span
                                    id="price_low2"
                                    className="py-0 text-sm "
                                    name="min"
                                ></span>
                            </div>
                            <div className="col-6 mt-1 pr-0">
                                <span
                                    id="price_high2"
                                    className="float-right py-0 text-sm "
                                    name="min"
                                ></span>
                            </div>
                        </div>

                        {/*COLLAPSE Amount*/}
                        <div className="mt-3 hidden" id="collapseExample2">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label
                                        htmlFor="low2"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Min: {formattedMin2}
                                    </label>
                                    <input
                                        type="text" // Use text instead of number to allow formatting
                                        min="0"
                                        id="low2"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="min"
                                        onInput={handleMin2Input} // Use onInput for real-time formatting
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label
                                        htmlFor="high2"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Max: {formattedMax2}
                                    </label>
                                    <input
                                        type="text" // Use text instead of number to allow formatting
                                        id="high2"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="min"
                                        onInput={handleMax2Input} // Use onInput for real-time formatting
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center w-full">
                                <button
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg sm:w-32 hover:bg-green-700 transition-colors"
                                    onClick={(event) => {
                                        amountSliderInitilize();
                                        hide2();
                                    }}
                                >
                                    Set
                                </button>

                                <button
                                    className="px-6 py-2  text-black border-2 border-gray-400 rounded-lg sm:w-32 hover:bg-red-100 hover:text-red-900 transition-colors"
                                    onClick={(event) => {
                                        getResults2();
                                        amountSliderInitilize('A');
                                        hide2();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {/*COLLAPSE Amount*/}
                    </div>
                </div>
                {/* Price Range Slider */}

                {/*<PriceRangeFilter />
        <PriceRangeFilter />*/}

                <h1 className=" text-gray-700 text-2xl mb-2   font-semibold ">
                    <b>{count} Results Found</b>
                    {/* <button className="permission-granted-button">
                  {" "}
                  Allow location{" "}
              </button> */}
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 gap-4 items-start">
                    {/* Cards Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1 sm:px-4 lg:px-0">
                        {currentCards.length === 0 ? (
                            <div className="space-y-4">
                                {/* Skeleton Loader for Cards */}
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="border p-5 border-gray-200 shadow-sm bg-white rounded-2xl flex flex-col w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] mx-auto h-full animate-pulse"
                                    >
                                        {/* Skeleton Content */}
                                        <div className="bg-gray-200 w-full h-[200px] sm:h-[220px] lg:h-[250px] rounded-lg"></div>
                                        <div className="flex flex-col pt-4 justify-between flex-grow pb-4">
                                            {/* Additional Skeleton Elements */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            currentCards.map((row) => (
                                <Link
                                    to={`/listing/${btoa(btoa(row.id))}`}
                                    key={row.id}
                                >
                                    <div className="border p-5 border-gray-200 shadow-sm bg-white rounded-2xl flex flex-col w-full max-w-[500px] sm:max-w-[600px] lg:max-w-[700px] mx-auto h-full">
                                        <div className="w-full h-[180px] sm:h-[200px] lg:h-[250px]">
                                            <img
                                                src={"../../" + row.image}
                                                alt={row.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex flex-col pt-4 justify-between flex-grow pb-4">
                                            <div className="flex flex-wrap gap-2 text-sm font-bold text-[#1E293B] mb-2">
                                                {row.category
                                                    ? row.category
                                                          .split(",")
                                                          .map((tag, index) => (
                                                              <span
                                                                  key={index}
                                                                  className="text-[#1E293B] font-semibold"
                                                              >
                                                                  #{tag.trim()}
                                                              </span>
                                                          ))
                                                    : ["example", "dummy"]}
                                            </div>

                                            <p className="text-lg font-semibold text-[#1E293B] mb-2">
                                                {row.name}
                                            </p>
                                            <p className="text-sm text-[#1E293B] truncate-multiline mb-2">
                                                {row.details ||
                                                    "Lorem ipsum dolor sit amet consectetur..."}
                                            </p>
                                            <p className="text-sm text-[#1E293B] mb-2">
                                                {row.category}
                                            </p>
                                            <div className="text-sm text-gray-600 flex flex-col gap-1 mb-2">
                                                <p className="flex items-center">
                                                    <FontAwesomeIcon
                                                        icon={faLocationDot}
                                                        className="mr-2"
                                                    />
                                                    {row.location}
                                                </p>
                                                <p className="flex items-center">
                                                    <FontAwesomeIcon
                                                        icon={faPhone}
                                                        className="mr-2"
                                                    />
                                                    contact:{" "}
                                                    {row.contact ||
                                                        "+1791205437"}
                                                </p>
                                            </div>
                                            <div className="text-sm text-green-600 mb-1">
                                                <p>
                                                    $
                                                    {row.investment_needed.toLocaleString() ||
                                                        ""}
                                                    <span className="text-[#1E293B]">
                                                        {" "}
                                                        / Amount Requested
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-sm text-green-600">
                                                <p>
                                                    {row.y_turnover
                                                        ? `$${row.y_turnover
                                                              .split("-")
                                                              .map((value) =>
                                                                  parseInt(
                                                                      value
                                                                  ).toLocaleString()
                                                              )
                                                              .join("-")}`
                                                        : ""}
                                                    <span className="text-[#1E293B]">
                                                        {" "}
                                                        / Yearly Turnover
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Map Section */}
                    <div
                        className="relative w-full h-screen lg:h-auto rounded-lg flex items-center justify-center"
                        style={{
                            top: 0, // Ensures it starts at the top of the container
                            margin: 0, // Removes any margins
                            padding: 0, // Removes padding
                        }}
                    >
                        <div
                            className="map_style w-full h-full"
                            style={{
                                borderRadius: "16px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                id="map"
                                style={{
                                    height: "100%", // Ensures the map fills the parent
                                    width: "100%", // Full width
                                    borderRadius: "16px",
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Pagination Section */}
                    <div className="flex justify-center lg:justify-start ml-6 lg:ml-0 mt-4 mb-20">
                        <CardsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListingResults;
