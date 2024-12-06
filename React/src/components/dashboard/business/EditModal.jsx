import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";
const EditModal = ({
    showModal,
    setShowModal,
    editItem,
    setEditItem,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        contact: "",
        investment_needed: "",
        share: "",
        contact_mail: "",
        details: "",
        location: "",
        lat: "",
        lng: "",
        y_turnover: "",
        reason: "",
        rating: 0,
        rating_count: 0,
        active: 0,
        video: "",
        document: "",
        pin: "",
        tax_pin: "",
        investors_fee: "",
        id: "",
        user_id: "",
        //created_at: "",
        //updated_at: "",
        identification: "",
        yeary_fin_statement: "",
        id_no: "",
        image: "",
    });

    useEffect(() => {
        if (editItem) {
            setFormData({
                name: editItem.name || "",
                category: editItem.category || "",
                contact: editItem.contact || "",
                investment_needed: editItem.investment_needed || "",
                share: editItem.share || "",
                contact_mail: editItem.contact_mail || "",
                details: editItem.details || "",
                location: editItem.location || "",
                lat: editItem.lat || "",
                lng: editItem.lng || "",
                y_turnover: editItem.y_turnover || "",
                reason: editItem.reason || "",
                rating: editItem.rating || 0,
                rating_count: editItem.rating_count || 0,
                active: editItem.active || 0,
                video: editItem.video || "",
                document: editItem.document || "",
                pin: editItem.pin || "",
                tax_pin: editItem.tax_pin || "",
                investors_fee: editItem.investors_fee || "",
                id: editItem.id || "",
                user_id: editItem.user_id || "",
                //created_at: editItem.created_at || "",
                //updated_at: editItem.updated_at || "",
                identification: editItem.identification || "",
                yeary_fin_statement: editItem.yeary_fin_statement || "",
                id_no: editItem.id_no || "",
                image: editItem.image || "",
            });
        }
    }, [editItem]);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        // Check if no file is selected
        if (files.length === 0) {
            showAlert("error", "No file selected.");
            return;
        }

        // Log file data for better debugging
        console.log(`[File Change] ${name}:`, files[0]);

        // Store the file in the formData state
        if (files && files[0]) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
        }

        // Optionally, show success alert after file selection
        showAlert("success", `${name} file selected successfully.`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        // Log the form data to ensure image is included
        console.log("Form Data before submitting:", formData);

        // Prepare the data for submission
        const updatedItem = { ...editItem, ...formData };

        // Create a FormData object for file upload
        const formDataToSend = new FormData();
        for (let key in updatedItem) {
            formDataToSend.append(key, updatedItem[key]);
        }
        console.log("Form Data :", formDataToSend);

        try {
            // Simulate API call - Sending formData using POST
            const response = await axiosClient.post(
                "business/up_listing",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Ensure the header is set correctly
                    },
                }
            );

            // Log the response data
            console.log("API Response:", response.data);

            if (response.data.status === 200) {
               
                showAlert("success", response.data.message); // Show success alert
            } else {
                
                showAlert("warning", response.data.message); // Show warning alert for non-200 status
            }

            console.log(response.data);
        } catch (error) {
            console.log(error);
           
            showAlert("error", error.message || "An error occurred."); // Show error alert
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (!showModal) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowModal(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            {/* ID */}
            {/* <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="id"
                            >
                                ID
                            </label>
                            <input
                                id="id"
                                name="id"
                                type="text"
                                value={formData.id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div> */}

            {/* User ID */}
            {/* <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="user_id"
                            >
                                User ID
                            </label>
                            <input
                                id="user_id"
                                name="user_id"
                                type="text"
                                value={formData.user_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div> */}

            {/* Created At */}
            {/* <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="created_at"
                            >
                                Created At
                            </label>
                            <input
                                id="created_at"
                                name="created_at"
                                type="text"
                                value={formData.created_at}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                disabled
                            />
                        </div> */}

            {/* Updated At */}
            {/* <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="updated_at"
                            >
                                Updated At
                            </label>
                            <input
                                id="updated_at"
                                name="updated_at"
                                type="text"
                                value={formData.updated_at}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                                disabled
                            />
                        </div> */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl sm:max-w-lg no-scrollbar">
                <div className="flex py-4 justify-between items-center">
                    <h2 className="text-xl text-green font-semibold">
                        Edit Business Details
                    </h2>
                    <button className=" " onClick={() => setShowModal(false)}>
                        <AiOutlineClose size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-10rem)] no-scrollbar">
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="category"
                            >
                                Category
                            </label>
                            <input
                                id="category"
                                name="category"
                                type="text"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Image */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="image"
                            >
                                Image
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*" // Only allow image files
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-required="true" // Indicates that this field is required
                            />
                            <span className="text-sm text-gray-500">
                                {formData.image
                                    ? formData.image.name
                                    : "No file selected"}
                                         
                            </span>
                        </div>

                        {/* Details */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="details"
                            >
                                Details
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Contact */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="contact"
                            >
                                Contact
                            </label>
                            <input
                                id="contact"
                                name="contact"
                                type="text"
                                value={formData.contact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Contact Mail */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="contact_mail"
                            >
                                Contact Mail
                            </label>
                            <input
                                id="contact_mail"
                                name="contact_mail"
                                type="email"
                                value={formData.contact_mail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Investment Needed */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="investment_needed"
                            >
                                Investment Needed
                            </label>
                            <input
                                id="investment_needed"
                                name="investment_needed"
                                type="number"
                                value={formData.investment_needed}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Share */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="share"
                            >
                                Share
                            </label>
                            <input
                                id="share"
                                name="share"
                                type="number"
                                value={formData.share}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Turnover */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="y_turnover"
                            >
                                Turnover
                            </label>
                            <input
                                id="y_turnover"
                                name="y_turnover"
                                type="text"
                                value={formData.y_turnover}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Pin */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1 text-gray-700"
                                htmlFor="pin"
                            >
                                Pin
                            </label>
                            <input
                                id="pin"
                                name="pin"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded text-gray-700 focus:ring focus:ring-blue-300"
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {formData.pin
                                    ? `Selected file: ${formData.pin.name}`
                                    : "No file chosen"}
                            </div>
                        </div>

                        {/* Identification */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1 text-gray-700"
                                htmlFor="identification"
                            >
                                Identification
                            </label>
                            <input
                                id="identification"
                                name="identification"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded text-gray-700 focus:ring focus:ring-blue-300"
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {formData.identification
                                    ? `Selected file: ${formData.identification.name}`
                                    : "No file chosen"}
                            </div>
                        </div>

                        {/* Document */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1 text-gray-700"
                                htmlFor="document"
                            >
                                Document
                            </label>
                            <input
                                id="document"
                                name="document"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded text-gray-700 focus:ring focus:ring-blue-300"
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {formData.document
                                    ? `Selected file: ${formData.document.name}`
                                    : "No file chosen"}
                            </div>
                        </div>

                        {/* Video */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1 text-gray-700"
                                htmlFor="video"
                            >
                                Video
                            </label>
                            <input
                                id="video"
                                name="video"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded text-gray-700 focus:ring focus:ring-blue-300"
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {formData.video
                                    ? `Selected file: ${formData.video.name}`
                                    : "No file chosen"}
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="reason"
                            >
                                Reason
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Investors Fee */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="investors_fee"
                            >
                                Investors Fee
                            </label>
                            <input
                                id="investors_fee"
                                name="investors_fee"
                                type="number"
                                value={formData.investors_fee}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Yearly Financial Statement */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1 text-gray-700"
                                htmlFor="yeary_fin_statement"
                            >
                                Yearly Financial Statement
                            </label>
                            <input
                                id="yeary_fin_statement"
                                name="yeary_fin_statement"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded text-gray-700 focus:ring focus:ring-blue-300"
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {formData.yeary_fin_statement
                                    ? `Selected file: ${formData.yeary_fin_statement.name}`
                                    : "No file chosen"}
                            </div>
                        </div>

                        {/* ID Number */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="id_no"
                            >
                                ID Number
                            </label>
                            <input
                                id="id_no"
                                name="id_no"
                                type="text"
                                value={formData.id_no}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Tax Pin */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1 text-gray-700"
                                htmlFor="tax_pin"
                            >
                                Tax Pin
                            </label>
                            <input
                                id="tax_pin"
                                name="tax_pin"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded text-gray-700 focus:ring focus:ring-blue-300"
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {formData.tax_pin
                                    ? `Selected file: ${formData.tax_pin.name}`
                                    : "No file chosen"}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="rating"
                            >
                                Rating
                            </label>
                            <input
                                id="rating"
                                name="rating"
                                type="number"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Rating Count */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="rating_count"
                            >
                                Rating Count
                            </label>
                            <input
                                id="rating_count"
                                name="rating_count"
                                type="number"
                                value={formData.rating_count}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Active */}
                        <div className="mb-4 flex items-center">
                            <label
                                className="text-sm font-medium mr-3"
                                htmlFor="active"
                            >
                                Active
                            </label>
                            <input
                                id="active"
                                name="active"
                                type="checkbox"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-green focus:green border-gray-300 rounded"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                className="bg-green hover:bg-dark-green text-white font-semibold py-2 px-4 w-40 p-3  focus:outline-none focus:shadow-outline rounded-full"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin" />
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default EditModal;
