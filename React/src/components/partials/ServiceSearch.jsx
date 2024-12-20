import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // Import only necessary icons
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import axiosClient from "../../axiosClient";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { FaChevronDown } from "react-icons/fa";
const Search = () => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const locationInputRef = useRef(null);
    const categoryRef = useRef(null);
    const nameRef = useRef(null);
    const latRef = useRef(null);
    const lngRef = useRef(null);
    const navigate = useNavigate();
    const [nameValue, setNameValue] = useState("");
    const [categoryValue, setCategoryValue] = useState("");
    const [locationValue, setLocationValue] = useState("");

    const Search = (e) => {
        e.preventDefault();
        let ids = "";
        const payload = {
            search: locationInputRef.current.value,
            category: categoryRef.current.value,
            listing_name: nameRef.current.value,
            lat: $("#lat").val(),
            lng: $("#lng").val(),
        };
        console.log(payload);
        axiosClient
            .post("/searchService", payload)
            .then(({ data }) => {
                console.log(data);
                Object.entries(data.results).forEach((entry) => {
                    const [index, row] = entry;
                    ids = ids + row.id + ",";
                });
                console.log(ids);
                if (!ids) ids = 0;

                sessionStorage.setItem("queryLat", payload.lat);
                sessionStorage.setItem("queryLng", payload.lng);
                navigate(
                    "/serviceResults/" + base64_encode(ids) + "/" + data.loc
                );
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
         const dropdown = document.getElementById("result_list2");
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
        $("#result_list2").html("");
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

                    $("#result_list2").show();
                    if (i < 10)
                        if (city == "")
                            $("#result_list2").append(
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
                                    '\');" style="cursor: pointer; padding: 6px 10px; margin: 3px 0; border-bottom: 1px solid #ddd; background-color: #ffffff; transition: background-color 0.3s ease;" data-id="' +
                                    name +
                                    '" class="address single_comms"> ' +
                                    '<p class="small h6 text-dark d-inline" style="font-size: 12px; margin: 0; display: flex; align-items: center;"><span style="margin-right: 6px; display: inline-flex; align-items: center;">' +
                                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="14" height="14" fill="black"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>' +
                                    "</span>" +
                                    name +
                                    "<small style='font-size: 10px;'>, " +
                                    city +
                                    ", " +
                                    country +
                                    "</small> </p></div>"
                            );
                        else
                            $("#result_list2").append(
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
                                    '\');" style="cursor: pointer; padding: 6px 10px; margin: 3px 0; border-bottom: 1px solid #ddd; background-color: #ffffff; transition: background-color 0.3s ease;" data-id="' +
                                    name +
                                    '" class="address single_comms"> ' +
                                    '<p class="small h6 text-dark d-inline" style="font-size: 12px; margin: 0; display: flex; align-items: center;"><span style="margin-right: 6px; display: inline-flex; align-items: center;">' +
                                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="14" height="14" fill="black"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>' +
                                    "</span>" +
                                    name +
                                    "<small style='font-size: 10px;'>, " +
                                    city +
                                    ", " +
                                    country +
                                    "</small> </p></div>"
                            );
                }
                //document.getElementById('result_list2').style.overflowY="scroll";
            },
            error: function (error) {
                console.log(error);
            },
        });
    };

    // Mock function to simulate fetching suggestions
    // const handleLocationChange = (e) => {
    //     const value = e.target.value;
    //     setLocation(value);

    //     // You can replace this with a real API call for location suggestions
    //     if (value.length > 2) {
    //         setSuggestions([
    //             "New York",
    //             "Los Angeles",
    //             "San Francisco",
    //             "Nairobi",
    //         ]); // Example data
    //     } else {
    //         setSuggestions([]);
    //     }
    // };

    // const handleSuggestionClick = (suggestion) => {
    //     setLocation(suggestion);
    //     setSuggestions([]);
    // };

    return (
        <div className="px-4 sm:px-0 w-full">
            <div className=" border  w-full  rounded-xl">
                <div className="flex flex-col sm:flex-row items-center h-auto sm:h-16 w-full">
                    {/* Select Category */}
                    <div className="relative flex items-center h-full w-full sm:w-1/4 mb-1 sm:mb-0 rounded-l-lg">
                        <select
                            ref={categoryRef}
                            value={categoryValue} // controlled value
                            onChange={handleCategoryChange} // handle change
                            className="bg-transparent focus:outline-none text-gray-500 text-xs sm:text-sm w-full pl-2 pr-10"
                        >
                            <option value="">All Categories</option>
                            <option value="Business Planning">
                                Business Planning
                            </option>
                            <option value="IT">IT</option>
                            <option value="Legal">Legal</option>
                            <option value="Project Management">
                                Project Management
                            </option>
                            <option value="Branding and Design">
                                Branding and Design
                            </option>
                            <option value="Finance, Accounting & Tax">
                                Finance, Accounting & Tax
                            </option>
                            <option value="Marketing">Marketing</option>
                            <option value="Public Relations">
                                Public Relations
                            </option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none sm:block hidden">
                            <FaChevronDown
                                className="text-gray-500"
                                size={16}
                            />
                        </div>
                    </div>

                    {/* Location Input */}
                    <div className="relative w-full sm:w-1/4 h-12 sm:h-full   mb-1 sm:mb-0">
                        <FaMapMarkerAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            onKeyUp={getPlaces}
                            id="searchbox"
                            type="text"
                            placeholder="Location"
                            ref={locationInputRef}
                            className="bg-transparent text-gray-500 h-full w-full pl-8 focus:outline-none"
                        />
                        <div
                            id="result_list2"
                            className="absolute w-full bg-white  rounded-b-md shadow-lg z-10 top-full"
                        >
                            {suggestions.length > 0 && (
                                <ul className="bg-white  w-full mt-1 max-h-40 overflow-y-auto">
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
                                            <span className="text-gray-800">
                                                {suggestion}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* What are you looking for Input */}
                    <div className="relative w-full sm:w-1/2 h-12 sm:h-full  mb-1 sm:mb-0">
                        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            ref={nameRef}
                            value={nameValue}
                            onChange={handleNameChange}
                            type="text"
                            placeholder="What Are You Looking For?"
                            className="bg-transparent text-gray-500 h-full w-full pl-8 focus:outline-none"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={Search}
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
