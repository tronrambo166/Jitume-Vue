import { FaImage } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../../axiosClient";
import { IoArrowBack } from "react-icons/io5"; // Import React icon
import { useNavigate } from "react-router-dom";
import InvestHero from "../Heros/InvestHero";
import { MdPhoto } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BackBtn from "./BackBtn";
const Investequip = () => {
    const { amount, id, percent } = useParams();

    const [formData, setFormData] = useState({
        amount: atob(amount),
        listing_id: atob(id),
        percent: atob(percent),
        photos: null,
        legal_doc: null,
        serial: "",
        optional_doc: null,
    });
    const [loading, setLoading] = useState(false);
    const [fileNames, setFileNames] = useState({
        photos: "",
        legal_doc: "",
        optional_doc: "",
    });
    // Handle file changes
    const handleFileChange = (e, field) => {
        const file = e.target.files[0];

        if (file) {
            const fileType = file.type;

            // Define valid image types for 'photos' field
            const validImageTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg , image/webp",
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
                //   "application/zip", // .zip (Compressed files)
            ];

            let isValid = false;

            if (field === "photos" && validImageTypes.includes(fileType)) {
                isValid = true;
            } else if (
                (field === "legal_doc" || field === "optional_doc") &&
                validDocTypes.includes(fileType)
            ) {
                isValid = true;
            }

            if (isValid) {
                setFormData((prevData) => ({
                    ...prevData,
                    [field]: file,
                    [`${field}Name`]: file.name,
                }));
                toast.info(`${file.name} selected successfully!`);
            } else {
                toast.error(
                    "Invalid file type. Please select the correct file."
                );
                // Optionally, clear the input to prompt the user to choose a valid file
                document.getElementById(`${field}-input`).value = "";
            }
        } else {
            toast.error("No file selected. Please choose a file.");
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };
    const navigate = useNavigate();
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }

        // Convert FormData to a JSON object for logging
        const formDataObject = {};
        form.forEach((value, key) => {
            formDataObject[key] = value instanceof File ? value.name : value;
        });

        // Log the formDataObject directly
        console.log("FormData Object:", formDataObject);

        try {
            setLoading(true); // Set loading to true

            const response = await axiosClient.post("bidCommitsEQP", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Check and display all messages from the response
            if (response.data) {
                // Assuming 'response.data' could have success, error, or any custom messages
                if (response.data.success) {
                    toast.success(response.data.success); // Success toast
                }
                if (response.data.failed) {
                    toast.error(response.data.failed); // Failure toast
                }
                // If there's any custom message to show, display it
                if (response.data.message) {
                    toast.info(response.data.message); // Info toast for custom message
                }
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error("An error occurred while submitting the form."); // Error toast
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };
    // Check if all required fields are filled
    const isFormValid = () => {
        // Check if photos, legal_doc are filled and serial is not empty
        // optional_doc is not required, so we skip validation for it
        return (
            formData.photos &&
            formData.legal_doc &&
            formData.serial !== "" &&
            (formData.optional_doc || formData.optional_doc === null) // optional doc can be null
        );
    };

    return (
        <>
            <ToastContainer />
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
                                    className="flex flex-col sm:flex-row justify-between items-center mb-4"
                                    key={docType}
                                >
                                    <label className="text-gray-600 font-medium text-sm flex items-center">
                                        {docType === "photos" ? (
                                            <>
                                                Upload good quality photos of
                                                the assets
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            </>
                                        ) : docType === "legal_doc" ? (
                                            <>
                                                Provide legal documents that act
                                                as evidence of the ownership of
                                                the assets (original purchase
                                                receipt/title/certificate etc)
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            </>
                                        ) : (
                                            "Any other assets records (optional)"
                                        )}
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-center gap-2">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 mt-2 sm:mt-0 px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        `${docType}-input`
                                                    )
                                                    .click()
                                            }
                                        >
                                            <FaImage className="text-gray-500" />
                                            {docType === "photos"
                                                ? "Upload Image"
                                                : "Upload Document"}
                                            {docType === "optional_doc" && (
                                                <span className="text-gray-500">
                                                    {" "}
                                                    (optional)
                                                </span>
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
                                        {/* Display the file name */}
                                        {formData[`${docType}Name`] && (
                                            <span className="text-sm text-gray-500">
                                                {formData[`${docType}Name`]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Serial Number Section */}
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium text-sm mb-2 flex items-center">
                                Provide the asset's make, model, and serial
                                number
                                <span className="text-red-500 ml-1">*</span>
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
                                    "Save Info"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Investequip;
