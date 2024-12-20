import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axiosClient from "../../axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLocationDot,
    faChevronDown,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { FaChevronDown } from "react-icons/fa";

import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // Import only necessary icons

const Search = () => {
    const locationUrl = useLocation();
    //const searchPage = locationUrl.pathname === "/listingResults";

    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const locationInputRef = useRef(null);
    const categoryRef = useRef(null);
    const nameRef = useRef(null);
    const latRef = useRef(null);
    const lngRef = useRef(null);

    const navigate = useNavigate();
    const [results, setResults] = useState("");
    const [rangeResults, setRangeResults] = useState("");
    const [rangeAmountResults, setRangeAmountResults] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [locationValue, setLocationValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [categoryValue, setCategoryValue] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    const onSearch = (e) => {
        e.preventDefault();
        let ids = "";
        const payload = {
            location: locationInputRef.current.value,
            category: categoryRef.current.value,
            listing_name: nameRef.current.value, // use state
            lat: $("#lat").val(),
            lng: $("#lng").val(),
        };
        console.log(payload);
        axiosClient
            .post("/search", payload)
            .then(({ data }) => {
                console.log(data);
                Object.entries(data.results).forEach((entry) => {
                    const [index, row] = entry;
                    ids = ids + row.id + ",";
                }); //console.log(ids);
                if (!ids) ids = 0;

                sessionStorage.setItem("queryLat", payload.lat);
                sessionStorage.setItem("queryLng", payload.lng);
                navigate(
                    "/listingResults/" + base64_encode(ids) + "/" + data.loc
                );

                if (locationUrl.pathname.includes("listingResults"))
                    window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
                console.log(err);
            });
    };

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    };
    const handleCategoryChange = (event) => {
        setCategoryValue(event.target.value);
    };
    const handleLocationChange = (event) => {
        setLocationValue(event.target.value);
    };


   document.addEventListener("click", (event) => {
       const dropdown = document.getElementById("result_list");
       const searchInput = locationInputRef.current; // Adjust based on your actual search input reference

       // Check if the clicked element is outside the dropdown or search input
       if (
           dropdown &&
           searchInput &&
           !dropdown.contains(event.target) &&
           !searchInput.contains(event.target)
       ) {
           dropdown.style.display = "none";
       }
   });
     



    const getPlaces = (e) => {
        e.preventDefault();
        $("#result_list").html("");
        const searchText = locationInputRef.current.value;

        $.ajax({
            url:
                "https://photon.komoot.io/api/?q=" +
                encodeURIComponent(searchText),
            method: "get",
            dataType: "json",
            success: function (response) {
                var i;
                console.log(response.features);

                for (i = 0; i < 10; i++) {
                    //console.log(response.features[i].name);
                    var name = response.features[i].properties.name;
                    var city = response.features[i].properties.city;
                    if (city == null || city == "undefined") city = "";
                    var country = response.features[i].properties.country;
                    var lng = response.features[i].geometry.coordinates[0];
                    var lat = response.features[i].geometry.coordinates[1];

                    $("#result_list").show();
                    if (i < 10)
                        if (city == "") {
                            $("#result_list").append(
                                "<div onclick=\"address('" +
                                    name +
                                    "," +
                                    country +
                                    "', '" +
                                    lat +
                                    "', '" +
                                    lng +
                                    '\');" style="cursor: pointer; padding: 10px 15px; margin: 1px 0; border-bottom: 1px solid #ddd; background-color: #f9f9f9; transition: background-color 0.3s ease;" data-id="' +
                                    name +
                                    '" class="address rounded single_comms"> ' +
                                    '<p class="h6 rounded small text-dark d-inline" style="font-size: 16px; margin: 0; display: flex; align-items: center;"><span style="margin-right: 8px; display: inline-flex; align-items: center;">' +
                                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" height="16" fill="black"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>' +
                                    "</span>" +
                                    name +
                                    "<small>, " +
                                    country +
                                    "</small> </p></div>"
                            );
                        } else {
                            $("#result_list").append(
                                "<div onclick=\"address('" +
                                    name +
                                    "," +
                                    city +
                                    "," +
                                    country +
                                    "', '" +
                                    lat +
                                    "', '" +
                                    lng +
                                    '\');" style="cursor: pointer; padding: 10px 15px; margin: 1px 0; border-bottom: 1px solid #ddd; background-color: #ffffff; transition: background-color 0.3s ease;" data-id="' +
                                    name +
                                    '" class="rounded address single_comms"> ' +
                                    '<p class="small h6 rounded text-dark d-inline" style="font-size: 16px; margin: 0; display: flex; align-items: center;"><span style="margin-right: 8px; display: inline-flex; align-items: center;">' +
                                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" height="16" fill="black"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>' +
                                    "</span>" +
                                    name +
                                    "<small>, " +
                                    city +
                                    ", " +
                                    country +
                                    "</small> </p></div>"
                            );
                        }
                }
                //document.getElementById('result_list').style.overflowY="scroll";
            },
            error: function (error) {
                console.log(error);
            },
        });
    };
    const address = (place, lat2, lng2) => {
        document.getElementById("searchbox").value = place;
        document.getElementById("result_list").style.display = "none";
        setLat(lat2); // Update state for latitude
        setLng(lng2); // Update state for longitude
    };

    // NEW Mock function to simulate fetching suggestions
    // const handleLocationChange = (e) => {
    //   const value = e.target.value;
    //   setLocation(value);
    //   if (value.length > 2) {
    //     setSuggestions(["New York", "Los Angeles", "San Francisco", "Seattle"]); // Example data
    //   } else {
    //     setSuggestions([]);
    //   }
    // };

    // const handleSuggestionClick = (suggestion) => {
    //   setLocation(suggestion);
    //   setSuggestions([]);
    // };

    return (
        <div className="px-4 sm:px-0 w-full">
            <div className="bg-gray-200 border  w-full  rounded-xl">
                {/* Search Section */}
                <div className="flex flex-col sm:flex-row items-center h-auto sm:h-16 p-2 sm:p-0">
                    {/* Categories Dropdown */}
                    <div className="relative   flex items-center h-12 sm:h-full w-full sm:w-1/4 mb-2 sm:mb-0">
                        <select
                            ref={categoryRef}
                            value={categoryValue} // controlled value
                            onChange={handleCategoryChange} // handle change
                            className="appearance-none rounded-l-xl h-full focus:outline-none bg-white text-gray-500 w-full pl-3 pr-10"
                        >
                            <option className="text-gray-400" value="">
                                All Categories
                            </option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Arts/Culture">Arts/Culture</option>
                            <option value="Auto">Auto</option>
                            <option value="Domestic (Home Help etc)">
                                Domestic (Home Help etc)
                            </option>
                            <option value="Fashion">Fashion</option>
                            <option value="Finance/Accounting">
                                Finance/Accounting
                            </option>
                            <option value="Food">Food</option>
                            <option value="Legal">Legal</option>
                            <option value="Media/Internet">
                                Media/Internet
                            </option>
                            <option value="Other">Other</option>
                            <option value="Pets">Pets</option>
                            <option value="Real State">Real State</option>
                            <option value="Retail">Retail</option>
                            <option value="Security">Security</option>
                            <option value="Sports/Gaming">Sports/Gaming</option>
                            <option value="Technology/Communications">
                                Technology/Communications
                            </option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <FaChevronDown
                                className="text-gray-500"
                                size={16}
                            />
                        </div>
                    </div>

                    {/* Hidden inputs for latitude and longitude */}
                    <input
                        type="text"
                        name="lat"
                        id="lat"
                        hidden
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                    <input
                        type="text"
                        name="lng"
                        id="lng"
                        hidden
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                    />

                    {/* Separator Line (hidden on small screens) */}

                    {/* Location Input with Suggestions */}
                    <div className="relative w-full sm:w-1/4 h-12 sm:h-full mb-2 sm:mb-0">
                        <FaMapMarkerAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            onKeyUp={getPlaces}
                            id="searchbox"
                            type="text"
                            placeholder="Location"
                            ref={locationInputRef}
                            className=" h-full focus:outline-none w-full pl-8"
                            // value={location}
                            // onChange={handleLocationChange}
                        />

                        {/* Suggestions Dropdown */}
                        <div id="result_list" className="">
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 bg-white   w-full mt-1 max-h-40 overflow-y-auto">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    suggestion
                                                )
                                            }
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                        >
                                            <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Separator Line (hidden on small screens) */}

                    {/* What are you looking for Input */}
                    <div className="relative w-full sm:w-1/4 h-12 sm:h-full mb-2 sm:mb-0 flex-grow">
                        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="What Are You Looking For?"
                            className=" h-full focus:outline-none w-full pl-8"
                            ref={nameRef}
                            value={nameValue} // controlled value
                            onChange={handleNameChange}
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={onSearch}
                        className="bg-[#FDE047] text-black rounded-r-lg h-12 sm:h-full py-2 px-9 w-full sm:w-auto text-lg"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
