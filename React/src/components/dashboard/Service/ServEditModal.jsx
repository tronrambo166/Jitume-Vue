import { useState, useEffect } from "react";
import {
    AiOutlineCloudUpload,
    AiOutlineLoading3Quarters,
    AiOutlineDown,
} from "react-icons/ai";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";

const ServEditModal = ({ isOpen, onClose, service, onUpdate }) => {
    const [formData, setFormData] = useState({
        id: null,
        name: "",
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
    const [categoryOpen, setCategoryOpen] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (service) {
            setFormData({
                id: service.id || "",
                name: service.name || "",
                price: service.price || "",
                category: service.category || "",
                location: service.location || "",
                lat: service.lat || "",
                lng: service.lng || "",
                details: service.details || "",
                image: service.image || "",
                pin: service.pin || "",
                identification: service.imidentificationage || "",
                video: service.video || "",
                document: service.document || "",
                link: service.link || "",
            });
        }
    }, [service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileUpload = (e) => {
        const { name, files } = e.target;

        if (files.length === 0) {
            showAlert("error", "No file selected.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: files[0],
        }));

        // Optional: Show success alert when a file is successfully selected
        showAlert("success", `${name} file selected successfully.`);
    };

    const handleSave = async () => {
        try {
            const response = await axiosClient.post(
                "business/up_service",
                formData
            );

            if (response.data.status === 200) {
                // Use showAlert to display success message
                showAlert("success", response.data.message);
            } else {
                // Use showAlert to display error message for non-200 status
                showAlert("error", response.data.message);
            }

            console.log(response.data);
            onUpdate(formData); // Call onUpdate function with formData
            onClose(); // Close the modal or form
        } catch (error) {
            console.error("Error saving data:", error);
            // Use showAlert to display error message on request failure
            showAlert("error", "An error occurred while saving the data.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white no-scrollbar w-full max-w-2xl mx-4 p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-6">Edit Service</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700">
                            Service Title
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter new title"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Price</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter new price"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700">Category</label>
                        <div className="relative">
                            <button
                                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 text-left bg-white flex items-center justify-between"
                                onClick={() => setCategoryOpen(!categoryOpen)} // Toggle dropdown
                            >
                                <span>
                                    {formData.category || "Select a category"}
                                </span>
                                <AiOutlineDown
                                    className={`text-gray-500 transform transition-transform duration-200 ${
                                        categoryOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {categoryOpen && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                                    <ul className="py-2">
                                        {/* Map through your category options here */}
                                        <li
                                            onClick={() =>
                                                handleCategoryChange(
                                                    "Category 1"
                                                )
                                            }
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            Category 1
                                        </li>
                                        <li
                                            onClick={() =>
                                                handleCategoryChange(
                                                    "Category 2"
                                                )
                                            }
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            Category 2
                                        </li>
                                        <li
                                            onClick={() =>
                                                handleCategoryChange(
                                                    "Category 3"
                                                )
                                            }
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            Category 3
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter new location"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700">Latitude</label>
                        <input
                            type="text"
                            name="lat"
                            value={formData.lat}
                            onChange={handleChange}
                            placeholder="Enter latitude"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Longitude</label>
                        <input
                            type="text"
                            name="lng"
                            value={formData.lng}
                            onChange={handleChange}
                            placeholder="Enter longitude"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Details</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Enter new details"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows="4"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {[
                        "image",
                        "pin",
                        "identification",
                        "video",
                        "document",
                    ].map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 capitalize">
                                {field}
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name={field}
                                    onChange={handleFileUpload}
                                    id={`file-upload-${field}`}
                                    className="hidden"
                                />
                                <label
                                    htmlFor={`file-upload-${field}`}
                                    className="flex items-center justify-between cursor-pointer w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    <span className="text-gray-700">
                                        {formData[field] && formData[field].name
                                            ? formData[field].name
                                            : `Click to upload ${
                                                  field
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  field.slice(1)
                                              }`}
                                    </span>
                                    <AiOutlineCloudUpload className="text-gray-700" />
                                </label>
                            </div>
                        </div>
                    ))}
                    <div>
                        <label className="block text-gray-700">Link</label>
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="Enter link"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServEditModal;
