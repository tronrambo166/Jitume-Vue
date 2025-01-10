import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axiosClient from "../../axiosClient";
//import Topservice from "./ServiceTopsec.jsx";
import Topsection from "../Landing-page/Topsection";
import Footer from "../Landing-page/Footer";
import Servicecards from "./Service-cards";
import banner from "../../images/banner.png";
import Localservicesection from "./Localservicesection";
import { Link } from "react-router-dom";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import NoisyImg from "../../assets/sev/asante.png"; // Ensure the path is correct
import SearcH from "./components/Search";
import InfiniteScrollCategories from "./components/InfiniteScrollCategories";
import Deadlybg from "../../assets/sev/Group2.webp";
import ServNav from "../Landing-page/Navbar";
import ScrollToTop from "../pages/ScrollToTop";
const Servicepage = () => {
    // const handleInputChange = (event) => {
    //     // Handle input changes
    // };

    // const locationInputRef = useRef(null);
    // const categoryRef = useRef(null);
    // const nameRef = useRef(null);
    // const latRef = useRef(null);
    // const lngRef = useRef(null);

    // const navigate = useNavigate();
    // const [results, setResults] = useState("");
    // const [rangeResults, setRangeResults] = useState("");

    // const Search = (e) => {
    //     e.preventDefault();
    //     let ids = "";
    //     const payload = {
    //         search: locationInputRef.current.value,
    //         category: categoryRef.current.value,
    //         listing_name: nameRef.current.value,
    //         lat: $("#lat").val(),
    //         lng: $("#lng").val(),
    //     };
    //     console.log(payload);
    //     axiosClient
    //         .post("/searchService", payload)
    //         .then(({ data }) => {
    //             console.log(data);
    //             Object.entries(data.results).forEach((entry) => {
    //                 const [index, row] = entry;
    //                 ids = ids + row.id + ",";
    //             });
    //             console.log(ids);
    //             if (!ids) ids = 0;

    //             sessionStorage.setItem("queryLat", payload.lat);
    //             sessionStorage.setItem("queryLng", payload.lng);
    //             navigate(
    //                 "/serviceResults/" + base64_encode(ids) + "/" + data.loc
    //             );
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             const response = err.response;
    //             if (response && response.status === 422) {
    //                 console.log(response.data.errors);
    //             }
    //             console.log(err);
    //         });
    // };

    // const getPlaces = (e) => {
    //     e.preventDefault();
    //     $("#result_list2").html("");
    //     const searchText = locationInputRef.current.value;

    //     $.ajax({
    //         url:
    //             "https://photon.komoot.io/api/?q=" +
    //             encodeURIComponent(searchText),
    //         method: "get",
    //         dataType: "json",
    //         success: function (response) {
    //             var i;
    //             console.log(response.features);

    //             for (i = 0; i < 10; i++) {
    //                 //console.log(response.features[i].name);
    //                 var name = response.features[i].properties.name;
    //                 var city = response.features[i].properties.city;
    //                 if (city == null || city == "undefined") city = "";
    //                 var country = response.features[i].properties.country;
    //                 var lng = response.features[i].geometry.coordinates[0];
    //                 var lat = response.features[i].geometry.coordinates[1];

    //                 $("#result_list2").show();
    //                 if (i < 10)
    //                     if (city == "")
    //                         $("#result_list2").append(
    //                             " <div onclick=\"address('" +
    //                                 name +
    //                                 "," +
    //                                 country +
    //                                 "', '" +
    //                                 lat +
    //                                 "', '" +
    //                                 lng +
    //                                 '\');" style="" data-id="' +
    //                                 name +
    //                                 '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="h6 small text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' +
    //                                 name +
    //                                 '</p> <p  class="d-inline text-dark"><small>, ' +
    //                                 country +
    //                                 "</small> </p> </div>"
    //                         );
    //                     else
    //                         $("#result_list2").append(
    //                             " <div onclick=\"address('" +
    //                                 name +
    //                                 "," +
    //                                 city +
    //                                 "," +
    //                                 country +
    //                                 "', '" +
    //                                 lat +
    //                                 "', '" +
    //                                 lng +
    //                                 '\');" style="" data-id="' +
    //                                 name +
    //                                 '" class="address  py-1 px-1 my-0 border-top bg-white single_comms">  <p class="small h6 text-dark d-inline" ><i class="fa fa-map-marker mr-1 text-dark" aria-hidden="true"></i> ' +
    //                                 name +
    //                                 '</p> <p  class="d-inline text-dark"><small>, ' +
    //                                 city +
    //                                 "," +
    //                                 country +
    //                                 "</small> </p> </div>"
    //                         );
    //             }
    //             //document.getElementById('result_list2').style.overflowY="scroll";
    //         },
    //         error: function (error) {
    //             console.log(error);
    //         },
    //     });
    // };

    return (
        <div>
            <div className="relative bg-gradient-to-r  from-[#00290f74] to-[#00270e]">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden  z-0">
                    <img
                        src={Deadlybg}
                        alt="Background"
                        className="object-cover w-full h-full"
                        style={{ transform: "translateX(8%)" }}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#0e2b18] via-[#00290fe9] to-transparent"></div>
                </div>

                {/* Noisy Image with blur effect */}
                <div className="absolute inset-0 w-full  h-full overflow-hidden z-10">
                    <img
                        src={NoisyImg}
                        alt="Noisy Image"
                        className="object-cover w-full h-full opacity-100"
                        loading="lazy"
                    />
                    {/* Blur overlay gradient */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#001a0fd1] via-[#01362073] to-[#001A0F00]">
                        <div className="w-full h-full filter blur-lg"></div>
                    </div>
                </div>

                {/* Navbar - adjusted to raise it higher */}
                <div className="relative z-30 mb-8">
                    {" "}
                    {/* You can adjust the margin here */}
                    <ServNav />
                </div>

                {/* Content Section */}
                <div className="relative z-20 px-4 sm:px-6 lg:px-8 ">
                    <div className="text-white text-left max-w-md">
                        <h1 className="text-4xl sm:text-5xl lg:text-5xl  font-bold mb-6">
                            Find The Right Services For You
                        </h1>
                        <p className="text-base sm:text-base mb-8">
                            Tujitume is a simple and transparent investment
                            platform designed for experienced and aspiring
                            socially responsible investors.
                        </p>
                    </div>

                    {/* Search Component */}
                    <div className="w-full flex items-start mb-10 lg:mb-0">
                        <div className="w-full lg:w-1/2">
                            <SearcH />
                        </div>
                    </div>

                    {/* Categories Component */}
                    <div className="w-full pb-20 flex lg:w-1/2">
                        <InfiniteScrollCategories />
                    </div>
                </div>
            </div>
            <Localservicesection />
            <Servicecards />
            <ScrollToTop />
        </div>
    );
};

export default Servicepage;
