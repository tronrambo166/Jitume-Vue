import { FaImage } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../../axiosClient";
import { IoArrowBack } from "react-icons/io5"; // Import React icon
import { useNavigate } from "react-router-dom";
import InvestHero from "../Heros/InvestHero";
import { MdPhoto } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
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

    // Handle file changes
    const handleFileChange = (e, field) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: e.target.files[0],
        }));
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
            const response = await axiosClient.post("bidCommitsEQP", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.success) {
                alert(response.data.success);
            } else {
                alert(response.data.failed);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred while submitting the form.");
        }
    };

    return (
        <>
            {" "}
            <InvestHero />
            <div className="px-4 sm:px-10 mb-60">
                <div className="text-center mb-10 mt-16">
                    <h1 className="text-3xl sm:text-5xl  font-bold text-[#334155]">
                        Invest with Equipment
                    </h1>
                    <p className="text-gray-500 mt-4">
                        Here provide all the information about the equipment you
                        are investing <br></br>with
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
                            (docType, index) => (
                                <div
                                    className="flex flex-col sm:flex-row justify-between items-center mb-4"
                                    key={docType}
                                >
                                    <label className="text-gray-600 font-medium text-sm">
                                        {docType === "photos"
                                            ? "Upload good quality photos of the assets*"
                                            : docType === "legal_doc"
                                            ? "Provide legal documents that act as evidence of the ownership of the assets (original purchase receipt/title/certificate etc)*"
                                            : "Any other assets records (optional)"}
                                    </label>
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
                                        Upload Photos
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
                            )
                        )}

                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium text-sm mb-2">
                                Provide the asset's make, model, and serial
                                number*
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

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                            >
                                Save Info
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Investequip;
