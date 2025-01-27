import { FaImage } from "react-icons/fa";
import { useParams } from "react-router-dom";
// import { useState } from "react";
import axiosClient from "../../axiosClient";
import { IoArrowBack } from "react-icons/io5"; // Import React icon
import { useNavigate } from "react-router-dom";
import InvestHero from "../Heros/InvestHero";
import { MdPhoto } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useStateContext } from "../../contexts/contextProvider";
import TujitumeLogo from "../../images/Tujitumelogo.svg";
import BackBtn from "./BackBtn";
import { useAlert } from "./AlertContext";
import Modal from "./Authmodal";
import React, { useState, useEffect } from "react";
const Investequip = () => {
    const { amount, id, percent } = useParams();
    const { token, setUser, setAuth, auth } = useStateContext();

    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        amount: atob(amount),
        listing_id: atob(id),
        percent: atob(percent),
        photos: null,
        legal_doc: null,
        serial: "",
        optional_doc: null,
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [fileNames, setFileNames] = useState({
        photos: "",
        legal_doc: "",
        optional_doc: "",
    });
    useEffect(() => {
        if (!token) {
            setIsAuthModalOpen(true);
        }
    }, [auth]);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];

        if (file) {
            const fileType = file.type;

            // Define valid image types for 'photos' field
            const validImageTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp",
            ];
            // Define valid document types for 'legal_doc' and 'optional_doc' fields
            const validDocTypes = [
                "application/pdf", // PDF
                "application/msword", // .doc (older Word documents)
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx (Word documents)
                "text/plain", // .txt (plain text files)
                "application/vnd.ms-excel", // .xls (Excel files)
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx (Excel files)
                "application/rtf", // .rtf (Rich Text Format)
                "application/vnd.oasis.opendocument.text", // .odt (OpenDocument text)
            ];

            let isValid = false;

            // Validate file type for 'photos' field
            if (field === "photos" && validImageTypes.includes(fileType)) {
                isValid = true;
            }
            // Validate file type for 'legal_doc' or 'optional_doc' fields
            else if (
                (field === "legal_doc" || field === "optional_doc") &&
                validDocTypes.includes(fileType)
            ) {
                isValid = true;
            }

            // Optional: Validate file size (e.g., max 5 MB)
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                showAlert("error", "File is too large. Max size is 5 MB.");
                document.getElementById(`${field}-input`).value = "";
                return;
            }

            if (isValid) {
                console.log(`${field} file selected:`, file);

                // Set the file and file name in the state
                setFormData((prevData) => ({
                    ...prevData,
                    [field]: file, // Store the file directly
                }));

                setFileNames((prev) => ({
                    ...prev,
                    [field]: file.name, // Update the file name state
                }));

                showAlert("info", `${file.name} selected successfully!`);
            } else {
                showAlert(
                    "error",
                    "Invalid file type. Please select the correct file."
                );
                document.getElementById(`${field}-input`).value = "";
            }
        } else {
            showAlert("error", "No file selected. Please choose a file.");
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Create FormData
        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]); // Append each key-value pair to FormData
        }

        console.log("FormData Object:", Object.fromEntries(form.entries())); // Log FormData for debugging

        try {
            setLoading(true); // Show loader

            // Send form data to the server
            const response = await axiosClient.post("bidCommitsEQP", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(response);

            // Handle server response
            if (response.data.status === 200) {
                $.confirm({
                    title: false,
                    content: `
                    <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                    <div>
                        Go to Dashboard to see investment status.
                    </div>
                `,
                    buttons: {
                        yes: function () {
                            navigate("/dashboard");
                        },
                        home: function () {
                            navigate("/");
                        },
                        cancel: function () {
                            $.alert("Canceled!");
                        },
                    },
                });
            } else {
                showAlert("failed", response.data.message); // Show failure alert
            }
        } catch (error) {
            const response = err.response;
            console.error("Error submitting the form:", error);
            showAlert("error", response.data.message); // Show error alert
        } finally {
            setLoading(false); // Hide loader

            // Reset only certain fields in the formData
            setFormData((prevData) => ({
                ...prevData,
                photos: null,
                legal_doc: null,
                serial: "",
                optional_doc: null,
            }));
        }
    };

    const isFormValid = () => {
        return (
            formData.photos &&
            formData.legal_doc &&
            formData.serial !== "" &&
            (formData.optional_doc || formData.optional_doc === null)
        );
    };

    return (
        <>
            <InvestHero />
            <BackBtn />
            <div className="px-4 sm:px-10 mb-60">
                <div className="text-center mb-10 mt-16">
                    <h1 className="text-3xl sm:text-5xl font-bold text-[#334155]">
                        Invest with Equipment
                    </h1>
                    <p className="text-gray-500 mt-4">
                        Here provide all the information about the equipment you
                        are investing <br /> with
                    </p>
                </div>

                {/* Adjusted wrapper div */}
                <div className="mt-8 mx-4 sm:mx-10 max-w-full border border-gray-300 rounded-lg mb-16">
                    <h3 className="bg-gray-100 flex p-4 font-semibold text-gray-700 border-b border-gray-200">
                        Equipment Information
                    </h3>
                    <form className="p-6" onSubmit={handleSubmit}>
                        {/* File Upload Section */}
                        {["photos", "legal_doc", "optional_doc"].map(
                            (docType) => (
                                <div
                                    className="flex flex-col sm:flex-row justify-between items-start mb-4"
                                    key={docType}
                                >
                                    <label className="text-gray-600 font-medium text-sm mb-2 sm:mb-0 flex items-start">
                                        {docType === "photos" ? (
                                            <>
                                                Upload good quality photo of
                                                the assets
                                                <span className="text-red-500 ml-1">
                                                    ex: jpg/png/gif etc. (less
                                                    than 2MB)
                                                </span>
                                            </>
                                        ) : docType === "legal_doc" ? (
                                            <>
                                                Provide legal documents that act
                                                as evidence of the ownership of
                                                the assets (original purchase
                                                receipt/title/certificate etc)
                                                <span className="text-red-500 ml-1">
                                                    ex: pdf/docx (less than 2MB)
                                                </span>
                                            </>
                                        ) : (
                                            "Any other assets records (optinal)"
                                        )}
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-start gap-2">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 mt-2 sm:mt-0 px-4 py-2 min-w-[200px] h-[48px] border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 overflow-hidden"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        `${docType}-input`
                                                    )
                                                    .click()
                                            }
                                        >
                                            <FaImage className="text-gray-500" />
                                            {/* Display the file name inside the button */}
                                            {formData[docType] ? (
                                                <span className="truncate max-w-full">
                                                    {fileNames[docType]}{" "}
                                                    {/* Show the uploaded file name */}
                                                </span>
                                            ) : docType === "photos" ? (
                                                "Upload Image"
                                            ) : (
                                                "Upload Document"
                                            )}
                                        </button>
                                        <input
                                            id={`${docType}-input`}
                                            type="file"
                                            onChange={(e) =>
                                                handleFileChange(e, docType)
                                            }
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )
                        )}

                        {/* Serial Number Section */}
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium text-sm mb-2 flex items-center">
                                Provide the asset's make, model, and serial
                                number
                                <span className="text-red-500 ml-1"></span>
                            </label>
                            <input
                                type="text"
                                name="serial"
                                value={formData.serial}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Enter information here"
                                required
                            />
                        </div>

                        {/* Submit Section */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className={`px-6 py-2 text-white rounded-md transition duration-300 flex items-center justify-center ${
                                    loading || !isFormValid()
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green hover:bg-green-600"
                                }`}
                                disabled={loading || !isFormValid()} // Disable button if form is invalid or loading
                            >
                                {loading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                ) : (
                                    "Place Bid"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Modal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default Investequip;
