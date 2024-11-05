import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // Import only necessary icons
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { decode as base64_decode, encode as base64_encode } from "base-64";

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
                                " <div onclick=\"address('" +
                                    name +
                                    "," +
                                    country +
                                    "', '" +
                                    lat +
                                    "', '" +
                                    lng +
                                    '\');" style="" data-id="' +
                                    name +
                                    '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="h6 small text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' +
                                    name +
                                    '</p> <p  class="d-inline text-dark"><small>, ' +
                                    country +
                                    "</small> </p> </div>"
                            );
                        else
                            $("#result_list2").append(
                                " <div onclick=\"address('" +
                                    name +
                                    "," +
                                    city +
                                    "," +
                                    country +
                                    "', '" +
                                    lat +
                                    "', '" +
                                    lng +
                                    '\');" style="" data-id="' +
                                    name +
                                    '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="small h6 text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' +
                                    name +
                                    '</p> <p  class="d-inline text-dark"><small>, ' +
                                    city +
                                    "," +
                                    country +
                                    "</small> </p> </div>"
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
        <div className="px-2 sm:px-0 w-full">
            {/* Added negative margin to move the container to the left */}
            <div className="w-full -ml-1">
                {" "}
                {/* Adjust -ml-2 for more/less spacing */}
                {/* Search Section */}
                <div className="flex flex-col sm:flex-row items-center p-1 sm:p-1.5 w-full">
                    {/* Categories Dropdown */}
                    <div className="relative flex items-center h-10 w-full sm:w-1/4 mb-1 sm:mb-0 bg-white rounded-l-lg">
                        <select
                        ref={categoryRef}
                        value={categoryValue} // controlled value
                        onChange={handleCategoryChange} // handle change
                         className="border-none bg-transparent focus:outline-none text-gray-500 text-xs sm:text-sm w-full pl-2 pr-2">
                            <option value="">All Categories</option>
                            <option value="category1">Category 1</option>
                            <option value="category2">Category 2</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>

                    {/* Hidden inputs for latitude and longitude */}
            <input type="text" name="lat" id="lat" hidden value=""  />
            <input type="text" name="lng" id="lng" hidden value=""  />


                    {/* Location Input with Suggestions */}
                    <div className="relative w-full sm:w-1/4 h-10 mb-1 sm:mb-0">
                        <FaMapMarkerAlt className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                          onKeyUp={getPlaces}
                          id="searchbox"
                          type="text"
                          placeholder="Location"
                          ref={locationInputRef}
                            type="text"
                            placeholder="Location"
                            className="border-none h-full focus:outline-none w-full pl-8 text-xs sm:text-sm"
                            
                        />
                        {/* Suggestions Dropdown */}
            <div
                id="result_list2" className="">
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg w-full mt-1 max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
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

                    {/* What are you looking for Input */}
                    <div className="relative w-full sm:w-1/4 h-10 mb-1 sm:mb-0 flex-grow">
                        <FaSearch className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        <input
                            ref={nameRef}
                            value={nameValue} // controlled value
                            onChange={handleNameChange}
                            type="text"
                            placeholder="What are you looking for?"
                            className="border-none h-full focus:outline-none w-full pl-8 text-xs sm:text-sm"
                        />
                    </div>

                    {/* Search Button */}
                    <button onClick={Search} className="bg-[#FDE047] text-black rounded-r-lg h-10 py-1 px-3 sm:px-4 w-full sm:w-auto text-xs sm:text-sm">
                        Search in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Search;
