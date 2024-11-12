import React, { useState, useEffect } from "react";
import {
    AiOutlineCloudUpload,
    AiOutlineLoading3Quarters,
} from "react-icons/ai";

const ServEditModal = ({ isOpen, onClose, serviceId, onUpdate }) => {
    const [serviceData, setServiceData] = useState({
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
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (serviceId) {
            // Initialize service data if a serviceId is provided
            setServiceData({
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
        }
    }, [serviceId]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setServiceData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUpdating(true);
        setError(""); // Reset error message

        try {
            // Log form data to console
            console.log(serviceData);

            // Optionally, call the onUpdate callback (if provided)
             const response = axiosClient.post('business/up_service', serviceData);
             if(response.data.status == 200)
             toast.success(response.data.message); // Show success toast
             else
             toast.success(response.data.message);

             console.log(response.data);

            // Close the modal
            onClose();
        } catch (error) {
            console.error("Error submitting service:", error);
            setError("Failed to update service.");
        } finally {
            setUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white no-scrollbar p-6 rounded-lg shadow-lg max-w-3xl w-full overflow-y-auto h-[90vh]">
                <h2 className="text-xl font-semibold mb-6 text-center">
                    Edit Service
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Title*
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={serviceData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                            placeholder="Service Title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Price*
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={serviceData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                            placeholder="Price"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Service Category*
                        </label>
                        <select
                            name="category"
                            value={serviceData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Category1">Category 1</option>
                            <option value="Category2">Category 2</option>
                            <option value="Category3">Category 3</option>
                            {/* Add more categories here */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Location*
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={serviceData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                            placeholder="Enter a location..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Latitude (Optional)
                        </label>
                        <input
                            type="text"
                            name="lat"
                            value={serviceData.lat}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Longitude (Optional)
                        </label>
                        <input
                            type="text"
                            name="lng"
                            value={serviceData.lng}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Details*
                        </label>
                        <textarea
                            name="details"
                            value={serviceData.details}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                            placeholder="Provide details about your service"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Link
                        </label>
                        <input
                            type="text"
                            name="link"
                            value={serviceData.link}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Upload Link"
                        />
                    </div>

                    {[
                        { label: "Image", name: "image" },
                        { label: "Pin", name: "pin" },
                        { label: "Identification", name: "identification" },
                        { label: "Video", name: "video" },
                        { label: "Document", name: "document" },
                    ].map((fileInput) => (
                        <div key={fileInput.name}>
                            <label className="block text-sm font-medium text-gray-700">
                                {`Upload ${fileInput.label}`}
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    name={fileInput.name}
                                    onChange={handleChange}
                                    id={`${fileInput.name}-upload`}
                                    className="hidden"
                                />
                                <label
                                    htmlFor={`${fileInput.name}-upload`}
                                    className="flex items-center justify-between cursor-pointer w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    <span className="text-gray-700">
                                        {serviceData[fileInput.name]
                                            ? serviceData[fileInput.name].name
                                            : `Click to upload ${fileInput.label}`}
                                    </span>
                                    <AiOutlineCloudUpload className="text-gray-700" />
                                </label>
                            </div>
                        </div>
                    ))}

                    <div className="sm:col-span-2 flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            {updating ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServEditModal;
