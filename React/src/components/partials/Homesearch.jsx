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
import { Link } from "react-router-dom";
import { decode as base64_decode, encode as base64_encode } from "base-64";

const Homesearch = () => {
    const locationInputRef = useRef(null);
    const categoryRef = useRef(null);
    const nameRef = useRef(null);
    const latRef = useRef(null);
    const lngRef = useRef(null);

    const navigate = useNavigate();
    const [results, setResults] = useState("");
    const [rangeResults, setRangeResults] = useState("");
    const [rangeAmountResults, setRangeAmountResults] = useState("");

    const Search = (e) => {
        e.preventDefault();
        let ids = "";
        const payload = {
            location: locationInputRef.current.value,
            category: categoryRef.current.value,
            listing_name: nameRef.current.value,
            lat: $("#lat").val(),
            lng: $("#lng").val(),
        };
        //console.log(payload);
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
                        if (city == "")
                            $("#result_list").append(
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
                            $("#result_list").append(
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
                //document.getElementById('result_list').style.overflowY="scroll";
            },
            error: function (error) {
                console.log(error);
            },
        });
    };
    const address = (place, lat2, lng2) => {
        document.getElementById("searchbox").value = place;
        //$("#result_list").html('');
        document.getElementById("result_list").style.display = "none";
        const lat = document.getElementById("lat");
        const lng = document.getElementById("lng");
        lat.value = lat2;
        lng.value = lng2;
    };

    //KEVIN
    useEffect(() => {
        // begin setRange
        // this is from the range () in listingDetails.vue
    }, []);

    console.log(results);

    //KEVIN

    return (
        <div className="flex flex-col pt-16 lg:pt-24 justify-center px-4 lg:px-8">
        <h1 className="text-center text-black text-xl lg:text-2xl font-semibold">
            Your platform to invest in local businesses
        </h1>

        {/* Search section starts */}
        <div className="flex flex-col gap-4 md:flex-row justify-center pt-6 px-2 sm:px-6 md:px-4 items-center w-full max-w-3xl mx-auto">
            <input
                ref={nameRef}
                type="text"
                className="border py-2 text-md px-4 font-regular border-[#666666]/30 rounded-xl focus:outline-none w-full md:w-auto"
                placeholder="What are you looking for?"
            />
            <div className="relative w-full md:w-auto">
                <input
                    onKeyUp={getPlaces}
                    id="searchbox"
                    type="text"
                    placeholder="Location"
                    className="border border-[#666666]/30 w-full text-md rounded-xl py-2 px-4 focus:outline-none"
                    ref={locationInputRef}
                />
                <FontAwesomeIcon
                    icon={faLocationDot}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
                />
            </div>
            <div className="relative w-full md:w-auto">
                <select
                    className="border border-[#666666]/30 w-full text-md rounded-xl py-2 px-4 focus:outline-none appearance-none"
                    ref={categoryRef}
                >
                    <option className="text-gray-400" value="">
                        Select a category
                    </option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Arts/Culture">Arts/Culture</option>
                    <option value="Auto">Auto</option>
                    <option value="Domestic (Home Help etc)">Domestic (Home Help etc)</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Finance/Accounting">Finance/Accounting</option>
                    <option value="Food">Food</option>
                    <option value="Legal">Legal</option>
                    <option value="Media/Internet">Media/Internet</option>
                    <option value="Other">Other</option>
                    <option value="Pets">Pets</option>
                    <option value="Real State">Real State</option>
                    <option value="Retail">Retail</option>
                    <option value="Security">Security</option>
                    <option value="Sports/Gaming">Sports/Gaming</option>
                    <option value="Technology/Communications">Technology/Communications</option>
                </select>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black cursor-pointer pointer-events-none"
                />
            </div>
            <button
                onClick={Search}
                className="btn-primary w-full md:w-auto py-3 rounded-full px-4 focus:outline-none mt-4 md:mt-0"
            >
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
        <ul
            id="suggestion-list"
            className="absolute w-full max-w-xs bg-white border-t-0 rounded-b-md shadow-lg z-10 top-full"
        ></ul>
        <div
            id="result_list"
            className="absolute w-full max-w-xs bg-white border-gray-300 border-t-0 rounded-b-md shadow-lg z-10 top-full"
        ></div>
        <input type="text" name="lat" id="lat" hidden value="" />
        <input type="text" name="lng" id="lng" hidden value="" />
        {/* Search section ends */}

        <div className="flex flex-wrap gap-4 py-8 justify-center items-center w-full mx-auto">
            <button className="btn-primary w-48 rounded-lg py-2 text-sm px-4 text-white">
                Agriculture
            </button>
            <button className="bg-black hover:bg-gray-800 py-2 rounded-lg text-sm px-4 text-white">
                Renewable Energy
            </button>
        </div>
    </div>
    );
};

export default Homesearch;
