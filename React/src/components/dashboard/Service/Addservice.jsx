import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
const AddService = ({ connected, userId }) => {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        location: "",
        lat: "",
        lng: "",
        details: "",
        image: null,
        pin: null,
        identification: null,
        video: null,
        document: null,
        link: "",
    });
    const [messages, setMessages] = useState({ success: "", error: "" });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    const [isButtonActive, setIsButtonActive] = useState(false);
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));

            // Use showAlert for file selection feedback
            showAlert("info", `File selected: ${files[0].name}`);
        }
    };

    // Check if all required fields are filled
    const checkFormValidity = () => {
        const isValid =
            formData.title &&
            formData.price &&
            formData.category &&
            formData.location &&
            formData.details;
        setIsButtonActive(isValid);
    };

    useEffect(() => {
        checkFormValidity();
    }, [formData]); // Re-run the validity check when formData changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpload = async (field) => {
        if (!formData[field]) return;
        const data = new FormData();
        data.append(field, formData[field]);

        // try {
        //     await axios.post(`/upload/${field}`, data, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         },
        //     });
        // } catch (error) {
        //     console.error(`Error uploading ${field}:`, error);
        // }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set location details from DOM elements
        formData.location = $("#searchbox").val();
        formData.lat = $("#lat").val();
        formData.lng = $("#lng").val();

        try {
            // Call individual upload handlers
            await Promise.all(
                ["image", "pin", "identification", "video", "document"].map(
                    handleUpload
                )
            );

            const data = new FormData();
            console.log(formData);

            // Append formData to FormData object
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            setLoading(true); // Show loading state

            const response = await axiosClient.post(
                `/business/create-service`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Handle response statuses
            if (response.status === 200) {
                if (response.data.status === 200) {
                    showAlert("success", "Service added successfully!");
                    showAlert(
                        "info",
                        "Please Add milestones for your service!"
                    );
                    navigate("/dashboard/addservicemilestone"); // Redirect to the milestone page
                } else {
                    showAlert(
                        "error",
                        response.data.message || "Something went wrong."
                    );
                }
            } else if (response.status === 404) {
                showAlert(
                    "error",
                    "Service not found. Please check your data."
                );
            } else if (response.status === 500) {
                showAlert("error", "Server error. Please try again later.");
            } else {
                showAlert("error", `Unexpected error: ${response.status}`);
            }
        } catch (error) {
            console.error(error);

            // Handle error responses
            if (error.response) {
                if (error.response.status === 400) {
                    showAlert(
                        "error",
                        error.response.data.message || "Invalid data provided."
                    );
                } else if (error.response.status === 401) {
                    showAlert("error", "Unauthorized. Please log in again.");
                } else if (error.response.status === 422) {
                    showAlert(
                        "error",
                        error.response.data.message || "Validation error."
                    );
                } else if (error.response.status === 500) {
                    showAlert("error", "Server error. Please try again later.");
                } else {
                    showAlert(
                        "error",
                        error.response.data.message || "An error occurred."
                    );
                }
            } else if (error.request) {
                showAlert(
                    "error",
                    "Network error. Please check your internet connection."
                );
            } else {
                showAlert(
                    "error",
                    "An error occurred while setting up the request."
                );
            }
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    const getPlaces = (e) => {
        e.preventDefault();
        $("#result_list").html("");
        const searchText = formData.location;

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

    //CONNCET

    const [Con, setCon] = useState("");
    const [id, setid] = useState("");
    useEffect(() => {
        const getAccount = (id) => {
            axiosClient
                .get("/business/account")
                .then(({ data }) => {
                    console.log(data);
                    setCon(data.connected);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getAccount();

        const getUser = () => {
            axiosClient
                .get("/checkAuth")
                .then(({ data }) => {
                    setid(data.user.id);
                    // Debugging id
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getUser();
    }, []);

    const connectToStripe = () => {
        window.location.href = "https://test.jitume.com/connect/" + id;
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Success Message */}
            {messages.success && (
                <div className="bg-blue-100 text-blue-700 border border-blue-300 rounded-lg px-4 py-3 mb-4 flex justify-between items-center">
                    <p className="font-semibold">{messages.success}</p>
                    <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() =>
                            setMessages({ ...messages, success: "" })
                        }
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Error Message */}
            {messages.error && (
                <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg px-4 py-3 mb-4 flex justify-between items-center">
                    <p className="font-semibold">{messages.error}</p>
                    <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setMessages({ ...messages, error: "" })}
                    >
                        &times;
                    </button>
                </div>
            )}

            {!Con ? (
                <div>
                    <p className="text-center bg-light p-2 ">
                        {" "}
                        You must onboard to Jitume Stripe platform to receive
                        business milestone payments.
                    </p>
                    <button
                        onClick={connectToStripe}
                        className="btn-primary py-2 px-6 rounded-lg text-white focus:outline-none"
                    >
                        Connect to Stripe
                    </button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-7xl mx-auto space-y-6"
                >
                    {/* Form Fields */}
                    <h3 className="text-2xl font-bold mb-4 py-4 text-gray-800">
                        Add Service
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Service Title*
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Service Title"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Price*
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Price"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Service Category*
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled hidden>
                                    Select a category
                                </option>
                                <option value="Business Planning">
                                    Business Planning
                                </option>
                                <option value="IT">IT</option>
                                <option value="Legal Project Management">
                                    Legal Project Management
                                </option>
                                <option value="Branding and Design">
                                    Branding and Design
                                </option>
                                <option value="Auto">Auto</option>
                                <option value="Finance, Accounting & Tax Marketing">
                                    Finance, Accounting & Tax Marketing
                                </option>
                                <option value="Tax Marketing">
                                    Tax Marketing
                                </option>
                                <option value="Public Relations">
                                    Public Relations
                                </option>
                                <option value="0">
                                    Project/Asset Management
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Location*
                            </label>
                            <input
                                onKeyUp={getPlaces}
                                id="searchbox"
                                type="text"
                                name="location"
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter a location..."
                            />
                            <input hidden name="lat" id="lat" />
                            <input hidden name="lng" id="lng" />

                            <ul
                                id="suggestion-list"
                                className="absolute w-[250px] bg-white border-t-0 rounded-b-md shadow-lg z-10 top-full"
                            ></ul>
                            <div
                                id="result_list"
                                style={{ top: "582px", left: "809px" }}
                                className="absolute w-[250px] bg-white border-gray-300 border-t-0 rounded-b-md shadow-lg z-10 top-full"
                            ></div>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 text-sm font-semibold">
                            Details*
                        </label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Provide details about your service"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                id="upload-image"
                            />
                            <label
                                htmlFor="upload-image"
                                className="flex items-center w-full border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-100"
                            >
                                <AiOutlineCloudUpload className="text-2xl mr-2" />
                                <span className="flex-1 text-left">
                                    Click to upload image
                                </span>
                            </label>
                            {formData.image && (
                                <p className="mt-2 text-gray-600">
                                    {formData.image.name}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Upload Identification
                            </label>
                            <input
                                type="file"
                                name="identification"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                id="upload-identification"
                            />
                            <label
                                htmlFor="upload-identification"
                                className="flex items-center w-full border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-100"
                            >
                                <AiOutlineCloudUpload className="text-2xl mr-2" />
                                <span className="flex-1 text-left">
                                    Click to upload identification
                                </span>
                            </label>
                            {formData.identification && (
                                <p className="mt-2 text-gray-600">
                                    {formData.identification.name}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Upload Document
                            </label>
                            <input
                                type="file"
                                name="document"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                id="upload-document"
                            />
                            <label
                                htmlFor="upload-document"
                                className="flex items-center w-full border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-100"
                            >
                                <AiOutlineCloudUpload className="text-2xl mr-2" />
                                <span className="flex-1 text-left">
                                    Click to upload document
                                </span>
                            </label>
                            {formData.document && (
                                <p className="mt-2 text-gray-600">
                                    {formData.document.name}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Upload Video
                            </label>
                            <input
                                type="file"
                                name="video"
                                onChange={handleFileChange}
                                accept="video/*"
                                className="hidden"
                                id="upload-video"
                            />
                            <label
                                htmlFor="upload-video"
                                className="flex items-center w-full border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-100"
                            >
                                <AiOutlineCloudUpload className="text-2xl mr-2" />
                                <span className="flex-1 text-left">
                                    Click to upload video
                                </span>
                            </label>
                            {formData.video && (
                                <p className="mt-2 text-gray-600">
                                    {formData.video.name}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Upload Pin
                            </label>
                            <input
                                type="file"
                                name="pin"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                id="upload-pin"
                            />
                            <label
                                htmlFor="upload-pin"
                                className="flex items-center w-full border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-100"
                            >
                                <AiOutlineCloudUpload className="text-2xl mr-2" />
                                <span className="flex-1 text-left">
                                    Click to upload pin
                                </span>
                            </label>
                            {formData.pin && (
                                <p className="mt-2 text-gray-600">
                                    {formData.pin.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-700 text-sm font-semibold">
                                Upload Link
                            </label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add link"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg text-white flex transition ${
                            loading
                                ? "bg-green/50 cursor-not-allowed"
                                : isButtonActive
                                ? "bg-green hover:bg-green-600"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={loading || !isButtonActive}
                    >
                        {loading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            "Add Service"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddService;
