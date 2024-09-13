import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
const EditModal = ({
    showModal,
    setShowModal,
    editItem,
    setEditItem,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        workingTest: "",
        contact: "",
        fee: "",
        category: "",
        details: "",
        turnover: "",
        investmentNeeded: "",
        share: "",
        contactMail: "",
        cover: "",
        location: "",
        companyPin: "",
        directorsId: "",
        financialStatements: "",
        supportingDocs: "",
        supportiveVideo: "",
        videoLink: "",
        fundingReason: "",
    });

    useEffect(() => {
        if (editItem) {
            setFormData({
                title: editItem.title || "",
                workingTest: editItem.workingTest || "",
                contact: editItem.contact || "",
                fee: editItem.fee || "",
                category: editItem.category || "",
                details: editItem.details || "",
                turnover: editItem.turnover || "",
                investmentNeeded: editItem.investmentNeeded || "",
                share: editItem.share || "",
                contactMail: editItem.contactMail || "",
                cover: editItem.cover || "",
                location: editItem.location || "",
                companyPin: editItem.companyPin || "",
                directorsId: editItem.directorsId || "",
                financialStatements: editItem.financialStatements || "",
                supportingDocs: editItem.supportingDocs || "",
                supportiveVideo: editItem.supportiveVideo || "",
                videoLink: editItem.videoLink || "",
                fundingReason: editItem.fundingReason || "",
            });
        }
    }, [editItem]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        const updatedItem = { ...editItem, ...formData };
        onSave(updatedItem);
    };

    if (!showModal) return null;

    if (!showModal) return null;

const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
        setShowModal(false);
    }
};

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50" onClick={handleOverlayClick}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg no-scrollbar">
                <div className="flex  py-4 justify-between items-center">
                <h2 className="text-xl text-green font-semibold ">
                    Edit Business Details
                </h2>
                <button 
                className=" " 
                onClick={() => setShowModal(false)}
            >
                <AiOutlineClose size={24} />
            </button>
            </div>

                <div className="overflow-y-auto max-h-[calc(100vh-10rem)] no-scrollbar">
                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="title"
                            >
                                Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Working Test */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="workingTest"
                            >
                                Working Test
                            </label>
                            <input
                                id="workingTest"
                                name="workingTest"
                                type="text"
                                value={formData.workingTest}
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

                        {/* Fee */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="fee"
                            >
                                Fee
                            </label>
                            <input
                                id="fee"
                                name="fee"
                                type="number"
                                value={formData.fee}
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

                        {/* Turnover */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="turnover"
                            >
                                Turnover
                            </label>
                            <input
                                id="turnover"
                                name="turnover"
                                type="text"
                                value={formData.turnover}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Investment Needed */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="investmentNeeded"
                            >
                                Investment Needed
                            </label>
                            <input
                                id="investmentNeeded"
                                name="investmentNeeded"
                                type="number"
                                value={formData.investmentNeeded}
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

                        {/* Contact Mail */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="contactMail"
                            >
                                Contact Mail
                            </label>
                            <input
                                id="contactMail"
                                name="contactMail"
                                type="email"
                                value={formData.contactMail}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Cover */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="cover"
                            >
                                Cover
                            </label>
                            <input
                                id="cover"
                                name="cover"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <span>{formData.cover || "No file chosen"}</span>
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

                        {/* Mandatory Documents */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Upload mandatory documents below to feature on
                                the platform
                            </label>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="companyPin"
                                >
                                    Change Company/Individual Pin
                                </label>
                                <input
                                    id="companyPin"
                                    name="companyPin"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <span>
                                    {formData.companyPin || "No file chosen"}
                                </span>
                            </div>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="directorsId"
                                >
                                    Change Directors Identification
                                    (Id/Passport)
                                </label>
                                <input
                                    id="directorsId"
                                    name="directorsId"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <span>
                                    {formData.directorsId || "No file chosen"}
                                </span>
                            </div>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="financialStatements"
                                >
                                    Upload 12 Months Financial Statements
                                    (Bank/Mpesa etc)
                                </label>
                                <input
                                    id="financialStatements"
                                    name="financialStatements"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <span>
                                    {formData.financialStatements ||
                                        "No file chosen"}
                                </span>
                            </div>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="supportingDocs"
                                >
                                    Change Supporting Business Documentation
                                </label>
                                <input
                                    id="supportingDocs"
                                    name="supportingDocs"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <span>
                                    {formData.supportingDocs ||
                                        "No file chosen"}
                                </span>
                            </div>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="supportiveVideo"
                                >
                                    Change supportive video
                                </label>
                                <input
                                    id="supportiveVideo"
                                    name="supportiveVideo"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <span>
                                    {formData.supportiveVideo ||
                                        "No file chosen"}
                                </span>
                            </div>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="videoLink"
                                >
                                    OR Video Link
                                </label>
                                <input
                                    id="videoLink"
                                    name="videoLink"
                                    type="url"
                                    value={formData.videoLink}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Business Reason for Funding */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="fundingReason"
                            >
                                Business Reason for Funding
                            </label>
                            <textarea
                                id="fundingReason"
                                name="fundingReason"
                                value={formData.fundingReason}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className="flex justify-start space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500  hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary text-white px-6 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
