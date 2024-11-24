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

    const locationInputRef = useRef(null);
    const sliderRef = useRef(null);

    // const mapRef = useRef(null);

    var count = results.length;
    let res = [];
    var max = 1000000;
    var min = 0;
    var max2 = 1000000;
    var min2 = 0;

    const openInNewTab = (url) => {
        window.open(url, "_blank");
    };
    // State for current page and total pages
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(4); // Number of cards per page

    const totalPages = Math.ceil(results.length / cardsPerPage);
    // Calculate total pages

    // Calculate the cards to display on the current page
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = results.slice(indexOfFirstCard, indexOfLastCard);
    // Function to handle page changes
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        console.log("Results Length: ", results.length);
        //console.log("Total Pages: ", totalPages);
        //console.log("Current Cards: ", currentCards);
    }, [results, currentPage]);

    //CORE METHODS
    useEffect(() => {
        const getResults = () => {
            axiosClient
                .get("/searchResults/" + base64_decode(resIds))
                .then(({ data }) => {
                    setResults(data.data);
                    res = data.data;
                    //console.log(results);
                    localStorage.setItem("results", JSON.stringify(data.data));

                    var x = navigator.geolocation;
                    x.getCurrentPosition(success, failure);
                    // document.querySelector('.permission-granted-button').addEventListener('click', () => {
                    //   x.watchPosition(success, failure);
                    // });
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getResults();
        //console.log(res);

        const onChangeSlider = () => {
            alert("slider is moving");
        };

        //x.getCurrentPosition(success, failure);
        var slider = document.getElementById("slider");
        var slider2 = document.getElementById("slider2");

        if ((slider && slider.noUiSlider) || (slider2 && slider2.noUiSlider)) {
            slider.noUiSlider.destroy();
            slider2.noUiSlider.destroy();
        }

        //SLIDERS FILTER

        // const amountSliderInitilize = () => {
        //     noUiSlider.create(slider2, {
        //         start: [0, 1000000],
        //         connect: true,
        //         range: {
        //             min: parseFloat(min2),
        //             max: parseFloat(max2),
        //         },

        //         step: 10000,
        //         margin: 600,
        //         pips: {
        //             //mode: 'steps',
        //             stepped: true,
        //             density: 6,
        //         },
        //     });
        //     var skipValues = [
        //         document.getElementById("price_low2"),
        //         document.getElementById("price_high2"),
        //     ];
        //     // slider2.noUiSlider.on("update", function (values, handle) {
        //     //     skipValues[handle].innerHTML = "$" + values[handle];
        //     //     //console.log(values[1] - values[0]);

        //     // });
        // };
        //SLIDERS FILTER

        rangeSliderInitilize();
        amountSliderInitilize();
    }, []);

    //Turnover(Nurul)
    const rangeSliderInitilize = () => {
       
        //var slider = document.getElementById('slider');
        //console.log("Stored Results");
        //console.log(results);
        noUiSlider.create(slider, {
            start: [0, 1000000],
            connect: true,
            range: {
                min: parseFloat(min),
                max: parseFloat(max),
            },

            step: 10000,
            margin: 600,
            pips: {
                //mode: 'steps',
                stepped: true,
                density: 6,
            },
        });
        var skipValues = [
            document.getElementById("price_low"),
            document.getElementById("price_high"),
        ];
        slider.noUiSlider.on("update", function (values, handle) {
            skipValues[handle].innerHTML = "$" + values[handle];
            //console.log(values[1]+ ' ' + values[0]);
            const preResults = localStorage.getItem("results");
            const savedResults = JSON.parse(preResults);
            const turnoverRes = [];

            Object.entries(savedResults).map(([key, value]) => {
                // Ensure y_turnover exists and is a valid string
                if (value.y_turnover && typeof value.y_turnover === "string") {
                    const range = value.y_turnover.split("-");

                    // Check if the range array has two elements
                    if (range.length === 2) {
                        const db_min = parseInt(range[0], 10); // Parse as integer
                        const db_max = parseInt(range[1], 10); // Parse as integer

                        //console.log(db_max)
                        if (
                            
                            parseInt(values[1]) <= db_max
                        ) {
                            turnoverRes.push(value);
                        }
                    }
                    console.log(turnoverRes);
                }
            });
            setResults(turnoverRes);
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
            step: 10000,
            margin: 600,
            pips: {
                stepped: true,
                density: 6,
            },
        });

        var skipValues = [
            document.getElementById("price_low2"),
            document.getElementById("price_high2"),
        ];

        slider2.noUiSlider.on("update", function (values, handle) {
            skipValues[handle].innerHTML = "$" + values[handle];

            // Log the current values of the slider for debugging
            const minValue = parseFloat(values[0]);
            const maxValue = parseFloat(values[1]);
            console.log(
                "Slider Updated - minValue:",
                minValue,
                "maxValue:",
                maxValue
            );

            // Fetch saved results from localStorage
            const preResults = localStorage.getItem("results");
            const savedResults = JSON.parse(preResults);
            console.log("Saved Results from LocalStorage:", savedResults);

            let filteredResults = [];

            // If the slider is at full range (0-1000000), show all results
            if (minValue === 0 && maxValue === 1000000) {
                console.log("Full range selected. Showing all results.");
                filteredResults = savedResults;
            } else {
                // Filter results based on the slider range
                filteredResults = Object.entries(savedResults)
                    .map(([key, value]) => {
                        if (
                            value.investment_needed &&
                            typeof value.investment_needed === "number"
                        ) {
                            const investmentAmount = value.investment_needed;

                            // Log each result being checked
                            console.log(
                                "Checking result:",
                                key,
                                "Investment amount:",
                                investmentAmount
                            );

                            if (
                                investmentAmount >= minValue &&
                                investmentAmount <= maxValue
                            ) {
                                console.log("Included:", key);
                                return value; // Include the result if within the range
                            }
                        }
                        return null; // Ignore results that don't meet the criteria
                    })
                    .filter(Boolean); // Remove null values from the array
            }

            // Log the filtered results before updating state
            console.log("Filtered Results:", filteredResults);

            // Update the state with the filtered results
            setResults(filteredResults);

            // Reset to page 1 when filter is applied
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

    const filterResults = (range) => {
        const storedData = localStorage.getItem("amountResults");
        const parsedData = storedData ? JSON.parse(storedData) : [];
        return parsedData.filter((item) => {
            if (item.y_turnover && typeof item.y_turnover === "string") {
                const [db_min, db_max] = item.y_turnover.split("-").map(Number);
                return range[0] <= db_max && range[1] >= db_min;
            }
            return false;
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
        }
        $("#collapseExample").removeClass("hidden");
        $("#colBut").addClass("hidden");
        $("#colBut2").removeClass("hidden");
    };
    const hide = () => {
        $("#collapseExample").addClass("hidden");
    };
    const collapse2 = () => {
        var slider = document.getElementById("slider2");

        if (slider && slider.noUiSlider) {
            slider.noUiSlider.destroy();
        }
        $("#collapseExample2").removeClass("hidden");
        $("#colBut3").addClass("hidden");
        $("#colBut4").removeClass("hidden");
    };
    const hide2 = () => {
        $("#collapseExample2").addClass("hidden");
    };

    //UPDATE NEW VALUES
    const UpdateValuesMin = (value) => { min = value; }
    const UpdateValuesMax = (value) => { max = value; }

    const UpdateValuesMin2 = (value) => { min2 = value; }
    const UpdateValuesMax2 = (value) => { max2 = value; }
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
                        className="w-full border rounded-lg jakarta border-[#CBD5E1] space-y-2 px-6 pb-4"
                    >
                        <button
                            onClick={collapse}
                            id="colBut4"
                            className="mr-4 my-2 border rounded-full px-3 py-1 "
                            name="min"
                        >
                            Set Range{" "}
                        </button>

                        <label className="text-gray-700 font-semibold ">
                            Turnover Range
                        </label>
                        <div id="slider" className=" "></div>

                        <div className="row mt-3 ">
                            <div className="col-6 mt-1">
                                <span
                                    id="price_low"
                                    className="py-0 "
                                    name="min"
                                ></span>
                            </div>
                            <div className="col-6 mt-1 pr-0">
                                <span
                                    id="price_high"
                                    className="float-right py-0 "
                                    name="min"
                                ></span>
                            </div>
                        </div>

                        {/*COLLAPSE RANGE*/}
                        <div className="mt-4 hidden" id="collapseExample">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col w-1/2 pr-2 space-y-2">
                                    <label
                                        htmlFor="low"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Min:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        id="low"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="min"
                                        onChange={(e) =>
                                            UpdateValuesMin(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col w-1/2 pl-2 space-y-2">
                                    <label
                                        htmlFor="high"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Max:
                                    </label>
                                    <input
                                        type="number"
                                        id="high"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="max"
                                        onChange={(e) =>
                                            UpdateValuesMax(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg w-32 mx-auto hover:bg-green-700 transition-colors"
                                onClick={(event) => {
                                    rangeSliderInitilize();
                                    hide();
                                }}
                            >
                                Set
                            </button>
                        </div>

                        {/*COLLAPSE RANGE*/}
                    </div>
                    {/* Turnover Range Slider */}

                    <div
                        id="amount_slider"
                        className="w-full jakarta   text-md border border-[#cbd5e1] rounded-lg space-y-2 px-6 py-4  mt-1"
                    >
                        <button
                            onClick={collapse2}
                            id="colBut4"
                            className="mr-4 my-2  border rounded-full px-3 py-1 "
                            name="min"
                        >
                            Set Range{" "}
                        </button>

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
                                        Min:
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        id="low2"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="min"
                                        onChange={(e) =>
                                            UpdateValuesMin2(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label
                                        htmlFor="high2"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Max:
                                    </label>
                                    <input
                                        type="number"
                                        id="high2"
                                        className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        name="min"
                                        onChange={(e) =>
                                            UpdateValuesMax2(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg w-full sm:w-32 mx-auto hover:bg-green-700 transition-colors"
                                onClick={(event) => {
                                    amountSliderInitilize();
                                    hide2();
                                }}
                            >
                                Set
                            </button>
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
                                                {(
                                                    row.tags || [
                                                        "example",
                                                        "dummy",
                                                    ]
                                                ).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-[#1E293B] font-semibold"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-lg font-semibold text-[#1E293B] mb-2">
                                                {row.name}
                                            </p>
                                            <p className="text-sm text-[#1E293B] mb-2">
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
                                                    {row.investment_needed ||
                                                        ""}
                                                    <span className="text-[#1E293B]">
                                                        {" "}
                                                        / Amount Requested
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-sm text-green-600">
                                                <p>
                                                    ${row.y_turnover || ""}
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
                    <div className="h-[500px] lg:h-auto rounded-lg flex items-center justify-center">
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
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: "16px",
                                }}
                            ></div>
                        </div>
                    </div>
                    {/* Pagination - Positioned outside of the cards div */}
                    <div className="flex justify-start ml-6 mt-4 mb-20">
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
