import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import axiosClient from "../../../axiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import spinner icon

import { useAlert } from "../../partials/AlertContext";
const AddBusiness = () => {
    const [formData, setFormData] = useState({
        title: "",
        contact: "", // Number
        contact_mail: "", // Email
        y_turnover: "", // Dropdown
        id_no: "", // Director's Passport/ID No.
        tax_pin: "", // Individual/Company Tax PIN
        category: "",
        details: "",
        location: "",
        investment_needed: "", // Number
        share: "", // Number (<=100)
        reason: "",
        lat: "",
        lng: "",
        yeary_fin_statement: null,
        pin: null, // File
        identification: null, // File
        document: null, // File
        video: null, // File
        videoLink: "",
        investors_fee: "", // Number
    });

    const [messages, setMessages] = useState({ success: "", error: "" });
    const [isFormValid, setIsFormValid] = useState(false);
    const [showAmountInput, setShowAmountInput] = useState(false);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    useEffect(() => {
        const allRequiredFilled = [
            formData.title,
            formData.contact,
            formData.category,
            formData.details,
            formData.location,
            formData.y_turnover,
            formData.id_no,
            formData.tax_pin,
            formData.pin,
            formData.document,
            formData.identification,
        ].every((field) => field !== null && field !== "");

        setIsFormValid(allRequiredFilled);
    }, [formData]);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];

        if (file) {
            setFormData({ ...formData, [field]: file });

            // Show an info alert with the selected file name
            showAlert("info", `File selected: ${file.name}`);
        } else {
            showAlert("error", "No file selected. Please choose a file.");
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setShowAmountInput(e.target.checked);
    };
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Setting loc, lat, lng
        formData.location = $("#searchbox").val();
        formData.lat = $("#lat").val();
        formData.lng = $("#lng").val();

        const data = new FormData();

        // Append form data
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                data.append(key, value);
            } else {
                data.append(key, value);
            }
        });

        // Log FormData content as an object
        const formDataObject = Object.fromEntries(data.entries());
        console.log("Submitted Form Data:", formDataObject);

        try {
            setLoading(true); // Start loading

            const response = await axiosClient.post(
                "business/create-listing",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Ensure the correct content type for file uploads
                    },
                }
            );

            // Handle the response status and show appropriate alerts
            if (response.status === 200) {
                if (response.data.status === 200) {
                    showAlert(
                        "success",
                        response.data.message || "Listing created successfully!"
                    );
                } else if (response.data.status === 404) {
                    showAlert(
                        "error",
                        response.data.message || "Listing not found."
                    );
                } else {
                    showAlert(
                        "warning",
                        response.data.message || "Unexpected status received."
                    );
                }
            } else {
                showAlert(
                    "error",
                    `Unexpected response status: ${response.status}`
                );
            }
        } catch (error) {
            console.error(error);

            let errorMessage = "An error occurred. Please try again.";

            if (error.response) {
                // Handle known error responses from the backend
                if (error.response.status === 400) {
                    errorMessage =
                        error.response.data.message || "Invalid data provided.";
                } else if (error.response.status === 401) {
                    errorMessage = "Unauthorized. Please log in again.";
                } else if (error.response.status === 422) {
                    errorMessage =
                        error.response.data.message || "Validation error.";
                } else if (error.response.status === 500) {
                    errorMessage =
                        "Internal server error. Please try again later.";
                } else {
                    errorMessage =
                        error.response.data.message || "An error occurred.";
                }
            } else if (error.request) {
                // If no response is received from the server (network issues)
                errorMessage =
                    "Network error. Please check your internet connection.";
            } else {
                // Error setting up the request
                errorMessage = `Error: ${error.message}`;
            }

            showAlert("error", errorMessage); // Show error alert with appropriate message
        } finally {
            setLoading(false); // Stop loading after request completes
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
        <div className="p-4  min-h-screen">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border mb-8">
                <h2 className="text-xl font-bold mb-4 flex justify-center dark:text-white">
                    Add Business
                </h2>

                {!Con ? (
                    <div className="flex flex-col items-center justify-center ">
                        <p className="text-center bg-light  ">
                            You must onboard to Jitume Stripe platform to
                            receive business milestone payments.
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={connectToStripe}
                                className="btn-primary flex py-2 px-6 rounded-lg text-white focus:outline-none"
                            >
                                Connect to Stripe
                            </button>
                        </div>
                    </div>
                ) : (
                    <form
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        onSubmit={handleSubmit}
                    >
                        {/* Business Information Inputs */}
                        {[
                            {
                                label: "Business Title",
                                name: "title",
                                placeholder: "Business Title*",
                                type: "text",
                            },
                            {
                                label: "Contact",
                                name: "contact",
                                placeholder: "Contact*",
                                type: "number",
                            },

                            {
                                label: "Email",
                                name: "contact_mail",
                                placeholder: "Email (Optional)",
                                type: "email",
                            },

                            {
                                label: "Director's Passport/ID No.",
                                name: "id_no",
                                placeholder: "Director's Passport/ID No.*",
                                type: "number",
                            },
                            {
                                label: "Share",
                                name: "share",
                                placeholder: "Share (<= 100)*",
                                type: "number",
                                max: 100,
                            },
                            {
                                label: "Investment Needed",
                                name: "investment_needed",
                                placeholder: "Investment Needed",
                                type: "number",
                            },
                            {
                                label: "Individual/Company Tax PIN",
                                name: "tax_pin",
                                placeholder: "Individual/Company Tax PIN*",
                                type: "number",
                            },
                        ].map((input, idx) => (
                            <div className="flex flex-col" key={idx}>
                                <label className="text-xs font-medium dark:text-gray-200">
                                    {input.label}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={input.type}
                                    name={input.name}
                                    placeholder={input.placeholder}
                                    className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg w-full mt-1 dark:bg-gray-900 dark:text-white text-sm focus:ring focus:ring-dark-green outline-none transition-all duration-200"
                                    onChange={handleInputChange}
                                    required={
                                        input.label !== "Email" &&
                                        input.label !== "Share" &&
                                        input.label !== "Investment Needed"
                                    }
                                    max={input.max}
                                />
                            </div>
                        ))}

                        {/* Select Input */}
                        <div className="flex flex-col">
                            <label className="block mb-2 text-sm font-semibold">
                                Location*
                            </label>
                            <input
                                onKeyUp={getPlaces}
                                id="searchbox"
                                type="text"
                                name="location"
                                onChange={handleInputChange}
                                required
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                                placeholder="Enter a location..."
                            />

                            {/*suggestion-list box*/}
                            <ul
                                id="suggestion-list"
                                className="absolute w-[250px] bg-white  border-t-0 rounded-b-md shadow-lg z-10 top-full"
                            ></ul>
                            <div
                                id="result_list"
                                style={{ top: "727px", left: "809px" }}
                                className="absolute w-[250px] bg-white  border-gray-300 border-t-0 rounded-b-md shadow-lg z-10 top-full"
                            ></div>
                            {/*suggestion-list box*/}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col my-3">
                                <label className="text-xs font-medium dark:text-gray-200">
                                    Yearly Turnover*
                                </label>
                                <select
                                    name="y_turnover"
                                    className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg w-full mt-1 dark:bg-gray-900 dark:text-white text-sm focus:ring focus:ring-dark-green outline-none transition-all duration-200"
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option hidden>Yearly Turnover*</option>
                                    <option value="0-10000">$0-$10000</option>
                                    <option value="10000-100000">
                                        $10000-$100000
                                    </option>
                                    <option value="100000-250000">
                                        $100000-$250000
                                    </option>
                                    <option value="250000-500000">
                                        $250000-$500000
                                    </option>
                                    <option value="500000-">$500000+</option>
                                    {/* Add more ranges as needed */}
                                </select>
                                          
                            </div>

                            <label className="text-xs font-medium dark:text-gray-200">
                                Select Category*
                            </label>
                            <select
                                name="category"
                                className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg w-full mt-1 dark:bg-gray-900 dark:text-white text-sm focus:ring focus:ring-dark-green outline-none transition-all duration-200"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled hidden>
                                    Select Category*
                                </option>
                                <option value="Agriculture">Agriculture</option>
                                <option value="Arts/Culture">
                                    Arts/Culture
                                </option>
                                <option value="Auto">Auto</option>
                                <option value="Sports/Gaming">
                                    Sports/Gaming
                                </option>
                                <option value="Real State">Real State</option>
                                <option value="Food">Food</option>
                                <option value="Legal">Legal</option>
                                <option value="Security">Security</option>
                                <option value="Media/Internet">
                                    Media/Internet
                                </option>
                                <option value="Fashion">Fashion</option>
                                <option value="Technology/Communications">
                                    Technology/Communications
                                </option>
                                <option value="Renewable/Energy">
                                    Renewable Energy
                                </option>
                                <option value="Retail">Retail</option>
                                <option value="Finance/Accounting">
                                    Finance/Accounting
                                </option>
                                <option value="Pets">Pets</option>
                                <option value="Domestic (Home Help etc)">
                                    Domestic (Home Help etc)
                                </option>
                                <option value="Other">Other</option>
                                {/* Add more categories as needed */}
                            </select>
                        </div>

                        {/* Textarea Input */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium dark:text-gray-200">
                                Details*
                            </label>
                            <textarea
                                name="details"
                                placeholder="Details*"
                                className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg w-full mt-1 dark:bg-gray-900 dark:text-white text-sm focus:ring focus:ring-dark-green outline-none transition-all duration-200"
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* File Uploads */}
                        {[
                            { label: "Cover", field: "image" },
                            { label: "PIN Certificate", field: "pin" },
                            { label: "ID/Passport", field: "identification" },
                            {
                                label: "Financial Statements",
                                field: "yeary_fin_statement",
                            },
                            {
                                label: "Supporting Business Documents",
                                field: "document",
                            },
                            { label: "Video (if applicable)", field: "video" },
                        ].map((fileInput, idx) => (
                            <div className="flex flex-col mb-4" key={idx}>
                                {/* Label */}
                                <label className="text-xs font-medium dark:text-gray-200">
                                    {fileInput.label}
                                </label>

                                {/* Input Field */}
                                <div className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg flex items-center justify-between mt-1 dark:bg-gray-900 transition-all duration-200">
                                    <span className="dark:text-white text-sm">
                                        {formData[fileInput.field]
                                            ? formData[fileInput.field].name
                                            : fileInput.label}
                                    </span>
                                    <label
                                        htmlFor={`upload-${fileInput.field}`}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <FiUpload className="text-lg dark:text-gray-300" />
                                        <input
                                            id={`upload-${fileInput.field}`}
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e,
                                                    fileInput.field
                                                )
                                            }
                                        />
                                    </label>
                                </div>

                                {/* Informational Text */}
                                <p className="text-xs text-red-500 mt-1">
                                    {fileInput.field === "video"
                                        ? "Max file size: 5MB. If larger, provide a video URL."
                                        : "Max file size: 2MB."}
                                </p>
                            </div>
                        ))}

                        {/* Fee Input */}
                        <div className="flex flex-col col-span-2">
                            <label className="text-xs font-medium dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    name="feeCheckbox"
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                Set fee for investor to view your full business
                                data?
                            </label>
                            {showAmountInput && (
                                <input
                                    type="number"
                                    name="investors_fee"
                                    placeholder="Amount (Optional)"
                                    className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg w-full mt-1 dark:bg-gray-900 dark:text-white text-sm focus:ring focus:ring-dark-green outline-none transition-all duration-200"
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>

                        {/* Video Link */}
                        <div className="flex flex-col col-span-2">
                            <label className="text-xs font-medium dark:text-gray-200">
                                Video Link (if applicable)
                            </label>
                            <input
                                type="text"
                                name="videoLink"
                                placeholder="Video Link (if applicable)"
                                className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg w-full mt-1 dark:bg-gray-900 dark:text-white text-sm focus:ring focus:ring-dark-green outline-none transition-all duration-200"
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Reason Input */}
                        <div className="flex flex-col col-span-2">
                            <label className="text-xs font-medium dark:text-gray-200">
                                Reason for Requesting Investment
                            </label>
                            <textarea
                                name="reason"
                                placeholder="Reason for Requesting Investment (Optional)"
                                className="border border-gray-300 dark:border-gray-700 p-2 rounded-lg w-full mt-1 dark:bg-gray-900 dark:text-white text-sm focus:ring focus:ring-dark-green outline-none transition-all duration-200"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-span-2">
                            <button
                                type="submit"
                                disabled={!isFormValid || loading}
                                className={`w-48 py-2 mt-4 text-white rounded-lg flex justify-center items-center ${
                                    isFormValid
                                        ? "bg-dark-green hover:bg-dark-green-hover"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {loading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin text-sm mr-0" />
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <input name="lat" id="lat" hidden />
                <input name="lng" id="lng" hidden />

                {/* Success/Error Messages */}
                {messages.success && (
                    <p className="mt-4 text-green-500">{messages.success}</p>
                )}
                {messages.error && (
                    <p className="mt-4 text-red-500">{messages.error}</p>
                )}
            </div>
        </div>
    );
};

export default AddBusiness;
