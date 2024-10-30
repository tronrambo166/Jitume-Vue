import React, { useState, useEffect } from "react";
import { AiOutlineClose ,AiOutlineLoading3Quarters } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        created_at: "",
        updated_at: "",
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
                created_at: editItem.created_at || "",
                updated_at: editItem.updated_at || "",
                identification: editItem.identification || "",
                yeary_fin_statement: editItem.yeary_fin_statement || "",
                id_no: editItem.id_no || "",
                image: editItem.image || "",
            });
        }
    }, [editItem]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: files.length > 0 ? files[0].name : "",
        });
    };

     const handleSubmit = async (e) => {
         e.preventDefault();
         setLoading(true); // Start loading
         console.log("Form Data:", formData);
         const updatedItem = { ...editItem, ...formData };

         try {
             // Simulate API call
             await onSave(updatedItem);
             toast.success("Item updated successfully!"); // Show success toast
         } catch (error) {
             toast.error("Error updating item. Please try again."); // Show error toast
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
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <ToastContainer />
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg no-scrollbar">
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
                                {formData.image}
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

                        {/* Location */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="location"
                            >
                                Location
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Latitude */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="lat"
                            >
                                Latitude
                            </label>
                            <input
                                id="lat"
                                name="lat"
                                type="text"
                                value={formData.lat}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Longitude */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="lng"
                            >
                                Longitude
                            </label>
                            <input
                                id="lng"
                                name="lng"
                                type="text"
                                value={formData.lng}
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
                                className="block text-sm font-medium mb-1"
                                htmlFor="pin"
                            >
                                Pin
                            </label>
                            <input
                                id="pin"
                                name="pin"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <span className="text-gray-500">
                                {formData.pin || "No file chosen"}
                            </span>
                        </div>

                        {/* Identification */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="identification"
                            >
                                Identification
                            </label>
                            <input
                                id="identification"
                                name="identification"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <span>
                                {formData.identification || "No file chosen"}
                            </span>
                        </div>

                        {/* Document */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="document"
                            >
                                Document
                            </label>
                            <input
                                id="document"
                                name="document"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <span className="text-gray-500">
                                {formData.document || "No file chosen"}
                            </span>
                        </div>

                        {/* Video */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="video"
                            >
                                Video
                            </label>
                            <input
                                id="video"
                                name="video"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <span className="text-gray-500">
                                {formData.video || "No file chosen"}
                            </span>
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
                                className="block text-sm font-medium mb-1"
                                htmlFor="yeary_fin_statement"
                            >
                                Yearly Financial Statement
                            </label>
                            <input
                                id="yeary_fin_statement"
                                name="yeary_fin_statement"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <span className="text-gray-500">
                                {formData.yeary_fin_statement ||
                                    "No file chosen"}
                            </span>
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
                                className="block text-sm font-medium mb-1"
                                htmlFor="tax_pin"
                            >
                                Tax Pin
                            </label>
                            <input
                                id="tax_pin"
                                name="tax_pin"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <span className="text-gray-500">
                                {formData.tax_pin || "No file chosen"}
                            </span>
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
