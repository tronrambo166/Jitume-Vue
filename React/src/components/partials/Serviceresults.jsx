import { useState, useRef } from "react";
import { useEffect } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
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
import ServiceSearch from "../partials/ServiceSearch";
import CardsPagination from "./CardsPagination";
import BackBtn from "./BackBtn";
const ServiceResults = () => {
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
    const locationInputRef = useRef(null);
    const count = results.length;
    let res = [];

    const [cartRes, setCartRes] = useState("");
    var max = 1000000;
    var min = 0;

    //KEVIN
    useEffect(() => {
        const getResults = () => {
            axiosClient
                .get("/ServiceResults/" + base64_decode(resIds))
                .then(({ data }) => {
                    setResults(data.data);
                    res = data.data;
                    //console.log(data);
                    localStorage.setItem(
                        "s_results",
                        JSON.stringify(data.data)
                    );

                    var x = navigator.geolocation;
                    x.getCurrentPosition(success, failure);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getResults();

        var slider = document.getElementById("slider");
        if (slider && slider.noUiSlider) slider.noUiSlider.destroy();

        amountSlider();
    }, []);

    // Nurul/Owen
    const amountSlider = () => {
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

            // Here you can use local data or preloaded data instead of making an API request.
            const preResults = localStorage.getItem("s_results");
            const savedResults = JSON.parse(preResults || "[]");

            // Filter the saved results based on the slider values
            const filteredResults = savedResults.filter((value) => {
                // console.log(value);
                if (value && value.price) {
                    var trim_price = value.price.replace(",", "");
                    const price = parseFloat(trim_price);
                    return (
                        price >= parseFloat(values[0]) &&
                        price <= parseFloat(values[1])
                    );
                }
                return false;
            });

            // Update the results after filtering
            setResults(filteredResults);
            setCurrentPage(1);


            // Optional: Process the filtered data, e.g., encode IDs
            filteredResults.forEach((item) => {
                item.id = btoa(item.id); // Encode the item ID
            });
        });
    };

    const search = () => {
        // let filteredResults = dummyResults;
        // if (selectedCategory) {
        //   filteredResults = filteredResults.filter(
        //     (result) => result.category === selectedCategory.value
        //   );
        // }
        // setResults(filteredResults);
    };

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
        // console.log("Results Length: ", results.length);
        // console.log("Total Pages: ", totalPages);
        // console.log("Current Cards: ", currentCards);
    }, [results, currentPage]);

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
                '<a className ="info_map py-0 font-weight-bold  text-center" target="_blank" href="/service-details/' +
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

    //UPDATE NEW VALUES
    const UpdateValuesMin = (value) => {
        min = value;
    };
    const UpdateValuesMax = (value) => {
        max = value;
    };

    //Range Function

    return (
        <>
            <BackBtn />
            <div className="w-full mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
                {/* <h1 className="text-3xl pt-4 md:text-[64px] mb-8 md:mb-16 font-semibold leading-tight md:leading-[79.36px] tracking-[0.02em] text-center font-sharp-grotesk text-[#00290F]">
                What Are You Looking For?
            </h1> */}
                <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
                    <ServiceSearch />
                </div>

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
              <button
                  className="btn-primary w-full md:w-auto py-3 rounded-full px-4 focus:outline-none mt-4 md:mt-0"
                  onClick={search}
              >
                  <FontAwesomeIcon icon={faSearch} />
              </button>
          </div> */}

                <div className="flex flex-col lg:flex-row items-center gap-6 my-6">
                    <div
                        id="turnover_slider"
                        className=" w-full jakarta  text-md border border-[#cbd5e1] rounded-lg space-y-2 px-6 py-4 "
                    >
                        <button
                            onClick={collapse}
                            id="colBut4"
                            className="mr-4 my-2 py-0 border rounded-full px-3 py-1 "
                            name="min"
                        >
                            Set Range{" "}
                        </button>
                        <label className="text-gray-700 font-semibold mb-2">
                            Price Range
                        </label>
                        <div id="slider" className="">
                            {" "}
                        </div>
                        <div className="row mt-3 jakarta">
                            <div className="col-6  mt-1">
                                <span
                                    id="price_low"
                                    className="py-0 "
                                    name="min"
                                >
                                    {" "}
                                </span>
                            </div>
                            <div className="col-6 mt-1 pr-0">
                                <span
                                    id="price_high"
                                    className="float-right py-0 "
                                    name="min"
                                >
                                    {" "}
                                </span>
                            </div>
                            {/*COLLAPSE Amount*/}
                            <div className="mt-3 hidden" id="collapseExample">
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-2">
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
                                    <div className="flex-1 space-y-2">
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
                                            name="min"
                                            onChange={(e) =>
                                                UpdateValuesMax(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <button
                                    className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg w-full sm:w-32 mx-auto hover:bg-green-700 transition-colors"
                                    onClick={(event) => {
                                        amountSlider();
                                        hide();
                                    }}
                                >
                                    Set
                                </button>
                            </div>

                            {/*COLLAPSE Amount*/}
                        </div>
                    </div>
                    {/*<PriceRangeFilter />*/}
                </div>

                <h1 className=" text-gray-700 text-2xl mb-2   font-semibold ">
                    <b>{count} Results Found</b>
                </h1>

                <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
                    {/* Results Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {results.length === 0 ? (
                            <div className="space-y-4">
                                {/* Skeleton Loader for Cards */}
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="border p-5 border-[#0000001A]/10 shadow-sm bg-white h-[500px] rounded-2xl flex flex-col w-full max-w-[900px] mx-auto animate-pulse"
                                    >
                                        {/* Skeleton Image */}
                                        <div className="bg-gray-200 w-full h-[250px] rounded-lg"></div>

                                        <div className="flex flex-col pt-2 justify-between flex-grow p-0">
                                            {/* Skeleton Tags */}
                                            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#1E293B]">
                                                <div className="bg-gray-200 w-20 h-4 rounded-md"></div>
                                                <div className="bg-gray-200 w-20 h-4 rounded-md"></div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between flex-grow">
                                            {/* Skeleton Title */}
                                            <div className="bg-gray-200 w-3/4 h-6 rounded-md mt-2"></div>

                                            {/* Skeleton Details */}
                                            <div className="bg-gray-200 w-full h-4 rounded-md mt-2"></div>

                                            {/* Skeleton Category */}
                                            <div className="bg-gray-200 w-1/4 h-4 rounded-md mt-2"></div>

                                            <div className="text-sm text-gray-500 flex flex-col gap-1">
                                                {/* Skeleton Location */}
                                                <div className="bg-gray-200 w-3/4 h-4 rounded-md"></div>

                                                {/* Skeleton Contact */}
                                                <div className="bg-gray-200 w-3/4 h-4 rounded-md"></div>
                                            </div>

                                            {/* Skeleton Price */}
                                            <div className="bg-gray-200 w-1/3 h-6 rounded-md mt-2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            currentCards.map((row) => (
                                <Link
                                    to={`/service-details/${btoa(
                                        btoa(row.id)
                                    )}`}
                                    key={row.id}
                                >
                                    <div className="border p-5 border-[#0000001A]/10 shadow-sm bg-white h-[500px] rounded-2xl flex flex-col w-full max-w-[900px] mx-auto">
                                        <div>
                                            <img
                                                src={"../../" + row.image}
                                                alt={row.listing_name}
                                                className="w-full h-[250px] object-cover rounded-lg"
                                            />
                                        </div>

                                        <div className="flex flex-col pt-2 justify-between flex-grow">
                                            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#1E293B]">
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
                                        </div>

                                        <div className="flex flex-col justify-between flex-grow">
                                            <p className="text-lg font-semibold text-slate-800">
                                                {row.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {row.details ||
                                                    "Lorem ipsum dolor sit amet consectetur..."}
                                            </p>
                                            <p className="text-sm text-gray-600 inline-block">
                                                {row.category}
                                            </p>

                                            <div className="text-sm text-gray-500 flex flex-col gap-1">
                                                <p className="flex items-center">
                                                    <FontAwesomeIcon
                                                        icon={faLocationDot}
                                                        className="mr-1 text-slate-500"
                                                    />
                                                    {row.location}
                                                </p>
                                                <p className="flex items-center truncate">
                                                    <FontAwesomeIcon
                                                        icon={faPhone}
                                                        className="mr-1 text-slate-500"
                                                    />
                                                    {row.contact ||
                                                        "+1791205437"}
                                                </p>
                                            </div>

                                            <p className="text-green-600 font-bold mt-2">
                                                ${row.price}
                                                <span className="text-gray-500 ml-1 text-xs">
                                                    / Price
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Map Section */}
                    <div className="h-[500px] sticky top-0 rounded-lg flex items-center justify-center">
                        <div
                            className="m-auto map_style w-full h-full"
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

                    {/* Pagination Section */}
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

export default ServiceResults;
