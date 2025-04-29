import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../../axiosClient";
import Select from "react-select";
const OfferGrantModal = ({ onClose, refreshGrants }) => {
    // Refs for focus management
    const grantTitleRef = useRef(null);
    const modalRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        grantTitle: "",
        totalGrantAmount: "",
        fundingPerBusiness: "",
        eligibilityCriteria: "",
        requiredDocuments: [],
        applicationDeadline: "",
        grantFocus: "",
        startupStageFocus: [],
        impactObjectives: "",
        evaluationCriteria: "",
        grantBriefPDF: null,
        regions: [], // Add regions field as an array
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeField, setActiveField] = useState(null);

    // Light theme with green accents - keeping original theme values
    const theme = {
        primary: "#4CAF50", // Vibrant green
        secondary: "#388E3C", // Darker green
        accent: "#C8E6C9", // Light green
        text: "#333333", // Dark text
        lightText: "#666666", // Secondary text
        background: "#FFFFFF", // White background
        card: "#F8F8F8", // Light gray cards
        border: "#E0E0E0", // Light border
        error: "#F44336", // Error red
        glow: "0 0 0 2px rgba(76, 175, 80, 0.2)", // Subtle green glow
    };

    // Options data
    const documentOptions = [
        "Pitch Deck",
        "Business Registration",
        "Financial Statements",
        "Tax Compliance",
        "Team Profiles",
        "Market Research",
        "Business Plan",
        "Proof of Concept",
        "Customer Testimonials",
        "Patents/Trademarks",
    ];

    const focusOptions = [
        "Agriculture",
        "Arts Culture",
        "Auto",
        "Domestic",
        "Fashion",
        "Finance Accounting",
        "Food",
        "Legal",
        "Media-Internet",
        "Other",
        "Pets",
        "Real State",
        "Retail",
        "Security",
        "Sports Gaming",
        "Technology Communications",
    ];

    const stageOptions = [
        "Idea",
        "MVP",
        "Seed",
        "Growth",
        "Scale",
        "Pre-Seed",
        "Series A+",
    ];

    // Focus first input on mount
    useEffect(() => {
        grantTitleRef.current.focus();
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close modal when clicking outside
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    // Log all form changes
    // useEffect(() => {
    //   console.log('Form updated:', formData);
    // }, [formData]);

    // Handle form input changes with validation
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Prevent negative numbers
        if (
            (name === "totalGrantAmount" || name === "fundingPerBusiness") &&
            value < 0
        ) {
            return;
        }

        if (type === "checkbox") {
            const fieldName = name;
            const currentValues = Array.isArray(formData[fieldName])
                ? formData[fieldName]
                : [];

            const updatedValues = checked
                ? Array.from(new Set([...currentValues, value]))
                : currentValues.filter((item) => item !== value);

            setFormData((prev) => ({
                ...prev,
                [fieldName]: updatedValues,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle file upload with size validation (max 5MB)
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB", {
                style: { backgroundColor: theme.error },
            });
            return;
        }
        setFormData((prev) => ({ ...prev, grantBriefPDF: file }));
    };

    // Validate all form fields
    const validateForm = () => {
        const errors = {};
        const requiredFields = [
            "grantTitle",
            "totalGrantAmount",
            "fundingPerBusiness",
            "eligibilityCriteria",
            "applicationDeadline",
            "grantFocus",
            "impactObjectives",
            "evaluationCriteria",
            "grantBriefPDF",
        ];

        requiredFields.forEach((field) => {
            if (
                !formData[field] ||
                (Array.isArray(formData[field]) && formData[field].length === 0)
            ) {
                errors[field] = `${field.replace(
                    /([A-Z])/g,
                    " $1"
                )} is required`;
            }
        });

        if (formData.totalGrantAmount <= 0) {
            errors.totalGrantAmount = "Amount must be positive";
        }

        if (formData.fundingPerBusiness <= 0) {
            errors.fundingPerBusiness = "Amount must be positive";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit form data to API
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting form:", formData);

        if (!validateForm()) {
            toast.error("Please complete all required fields", {
                style: { backgroundColor: theme.error },
            });
            return;
        }

        setIsSubmitting(true);
        const loadingToastId = toast.loading("Creating grant offer...", {
            style: { backgroundColor: theme.primary },
        });

        try {
            const formDataToSend = new FormData();

            // Handle all fields including arrays and files
           Object.entries(formData).forEach(([key, value]) => {
               if (Array.isArray(value)) {
                   // For arrays, convert to JSON string
                   formDataToSend.append(key, JSON.stringify(value));
               } else if (value instanceof File) {
                   formDataToSend.append(key, value);
               } else {
                   formDataToSend.append(key, value);
               }
           });

            // API call
            const response = await axiosClient.post(
                "grant/create-grant",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response);

            if (response.status !== 200) {
                throw new Error(
                    response.data?.message || "Failed to create grant"
                );
            } else {
                toast.update(loadingToastId, {
                    render: "Grant created successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    style: { backgroundColor: theme.primary },
                });

                setShowSuccessModal(true);

                if (typeof refreshGrants === "function") {
                    await refreshGrants();
                } else {
                    console.warn("refreshGrants is not a function");
                }

                resetForm();
            }
        } catch (error) {
            console.error("Submission error:", error);
            let errorMessage = "Failed to create grant. Please try again.";
            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                errorMessage = "Network error - please check your connection";
            }

            toast.update(loadingToastId, {
                render: errorMessage,
                type: "error",
                isLoading: false,
                autoClose: 5000,
                style: { backgroundColor: theme.error },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

     const countries = [
         "Algeria",
         "Angola",
         "Benin",
         "Botswana",
         "Burkina Faso",
         "Burundi",
         "Cabo Verde",
         "Cameroon",
         "Central African Republic",
         "Chad",
         "Comoros",
         "Congo",
         // "Côte d'Ivoire",
         "Djibouti",
         "Democratic Republic of the Congo",
         "Egypt",
         "Equatorial Guinea",
         "Eritrea",
         "Eswatini",
         "Ethiopia",
         "Gabon",
         "Gambia",
         "Ghana",
         "Guinea",
         "Guinea-Bissau",
         "Kenya",
         "Lesotho",
         "Liberia",
         "Libya",
         "Madagascar",
         "Malawi",
         "Mali",
         "Mauritania",
         "Mauritius",
         "Morocco",
         "Mozambique",
         "Namibia",
         "Niger",
         "Nigeria",
         "Rwanda",
         "Sao Tome and Principe",
         "Senegal",
         "Seychelles",
         "Sierra Leone",
         "Somalia",
         "South Africa",
         "South Sudan",
         "Sudan",
         "Tanzania",
         "Togo",
         "Tunisia",
         "Uganda",
         "Zambia",
         "Zimbabwe",
     ];

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            grantTitle: "",
            totalGrantAmount: "",
            fundingPerBusiness: "",
            eligibilityCriteria: "",
            requiredDocuments: [],
            applicationDeadline: "",
            grantFocus: "",
            startupStageFocus: [],
            impactObjectives: "",
            evaluationCriteria: "",
            grantBriefPDF: null,
            regions: [], // Add regions here too
        });
        setValidationErrors({});
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100"
                style={{
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                }}
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-1">
                                Create New Grant
                            </h2>
                            <div className="h-1 w-16 bg-green-500 rounded-full"></div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Grant Title */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                Grant Title{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                ref={grantTitleRef}
                                type="text"
                                name="grantTitle"
                                value={formData.grantTitle}
                                onChange={handleChange}
                                onFocus={() => setActiveField("grantTitle")}
                                onBlur={() => setActiveField(null)}
                                className={`mt-1 block w-full rounded-xl bg-white border ${
                                    activeField === "grantTitle"
                                        ? "border-green-500 ring-1 ring-green-500"
                                        : "border-gray-200"
                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                                    validationErrors.grantTitle
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="Enter grant title"
                            />
                            {validationErrors.grantTitle && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {validationErrors.grantTitle}
                                </p>
                            )}
                        </div>

                        {/* Financial Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Total Grant Amount{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1 rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="totalGrantAmount"
                                        value={formData.totalGrantAmount}
                                        onChange={handleChange}
                                        onFocus={() =>
                                            setActiveField("totalGrantAmount")
                                        }
                                        onBlur={() => setActiveField(null)}
                                        min="0"
                                        step="1000"
                                        className={`block w-full rounded-xl bg-white border ${
                                            activeField === "totalGrantAmount"
                                                ? "border-green-500 ring-1 ring-green-500"
                                                : "border-gray-200"
                                        } pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none transition-all duration-200 ${
                                            validationErrors.totalGrantAmount
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {validationErrors.totalGrantAmount && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {validationErrors.totalGrantAmount}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Funding per Business{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-1 rounded-xl">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="fundingPerBusiness"
                                        value={formData.fundingPerBusiness}
                                        onChange={handleChange}
                                        onFocus={() =>
                                            setActiveField("fundingPerBusiness")
                                        }
                                        onBlur={() => setActiveField(null)}
                                        min="0"
                                        step="100"
                                        className={`block w-full rounded-xl bg-white border ${
                                            activeField === "fundingPerBusiness"
                                                ? "border-green-500 ring-1 ring-green-500"
                                                : "border-gray-200"
                                        } pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none transition-all duration-200 ${
                                            validationErrors.fundingPerBusiness
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {validationErrors.fundingPerBusiness && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {validationErrors.fundingPerBusiness}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Two columns for dates and focus */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Application Deadline */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Application Deadline{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="applicationDeadline"
                                    value={formData.applicationDeadline}
                                    onChange={handleChange}
                                    onFocus={() =>
                                        setActiveField("applicationDeadline")
                                    }
                                    onBlur={() => setActiveField(null)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className={`mt-1 block w-full rounded-xl bg-white border ${
                                        activeField === "applicationDeadline"
                                            ? "border-green-500 ring-1 ring-green-500"
                                            : "border-gray-200"
                                    } px-4 py-2.5 text-gray-900 focus:outline-none transition-all duration-200 ${
                                        validationErrors.applicationDeadline
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {validationErrors.applicationDeadline && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {validationErrors.applicationDeadline}
                                    </p>
                                )}
                            </div>

                            {/* Grant Focus */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Grant Focus{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="grantFocus"
                                    value={formData.grantFocus}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField("grantFocus")}
                                    onBlur={() => setActiveField(null)}
                                    className={`mt-1 block w-full rounded-xl bg-white border ${
                                        activeField === "grantFocus"
                                            ? "border-green-500 ring-1 ring-green-500"
                                            : "border-gray-200"
                                    } px-4 py-2.5 text-gray-900 focus:outline-none transition-all duration-200 ${
                                        validationErrors.grantFocus
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                >
                                    <option value="" className="text-gray-400">
                                        Select Focus Area
                                    </option>
                                    {focusOptions.map((option) => (
                                        <option
                                            key={option}
                                            value={option}
                                            className="text-gray-900"
                                        >
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.grantFocus && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {validationErrors.grantFocus}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Eligibility Criteria */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                Eligibility Criteria{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="eligibilityCriteria"
                                value={formData.eligibilityCriteria}
                                onChange={handleChange}
                                onFocus={() =>
                                    setActiveField("eligibilityCriteria")
                                }
                                onBlur={() => setActiveField(null)}
                                rows="3"
                                className={`mt-1 block w-full rounded-xl bg-white border ${
                                    activeField === "eligibilityCriteria"
                                        ? "border-green-500 ring-1 ring-green-500"
                                        : "border-gray-200"
                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                                    validationErrors.eligibilityCriteria
                                        ? "border-red-500"
                                        : ""
                                }`}
                                placeholder="List the eligibility criteria for applicants"
                            />
                            {validationErrors.eligibilityCriteria && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {validationErrors.eligibilityCriteria}
                                </p>
                            )}
                        </div>

                        {/* Required Documents */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5 flex justify-between">
                                <span>
                                    Required Documents{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <span className="text-green-600 text-xs">
                                    {formData.requiredDocuments.length} selected
                                </span>
                            </label>
                            <div
                                className={`mt-1 p-4 border rounded-xl bg-gray-50 ${
                                    validationErrors.requiredDocuments
                                        ? "border-red-500"
                                        : "border-gray-200"
                                }`}
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {documentOptions.map((doc) => (
                                        <label
                                            key={doc}
                                            className="flex items-center space-x-2 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                name="requiredDocuments"
                                                value={doc}
                                                checked={formData.requiredDocuments.includes(
                                                    doc
                                                )}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {doc}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {validationErrors.requiredDocuments && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {validationErrors.requiredDocuments}
                                </p>
                            )}
                        </div>

                        {/* Startup Stage Focus */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5 flex justify-between">
                                <span>
                                    Startup Stage Focus{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <span className="text-green-600 text-xs">
                                    {formData.startupStageFocus.length} selected
                                </span>
                            </label>
                            <div
                                className={`mt-1 flex flex-wrap gap-2 border p-3 rounded-xl ${
                                    validationErrors.startupStageFocus
                                        ? "border-red-500"
                                        : "border-gray-200"
                                }`}
                            >
                                {stageOptions.map((stage) => {
                                    const isSelected =
                                        formData.startupStageFocus.includes(
                                            stage
                                        );
                                    return (
                                        <label
                                            key={stage}
                                            className={`cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                                isSelected
                                                    ? "bg-green-100 text-green-800 border border-green-300"
                                                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name="startupStageFocus"
                                                value={stage}
                                                checked={isSelected}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            {stage}
                                        </label>
                                    );
                                })}
                            </div>
                            {validationErrors.startupStageFocus && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {validationErrors.startupStageFocus}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Impact Objectives */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Impact Objectives{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="impactObjectives"
                                    value={formData.impactObjectives}
                                    onChange={handleChange}
                                    onFocus={() =>
                                        setActiveField("impactObjectives")
                                    }
                                    onBlur={() => setActiveField(null)}
                                    rows="4"
                                    className={`mt-1 block w-full rounded-xl bg-white border ${
                                        activeField === "impactObjectives"
                                            ? "border-green-500 ring-1 ring-green-500"
                                            : "border-gray-200"
                                    } px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                                        validationErrors.impactObjectives
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    placeholder="Describe expected impact objectives"
                                />
                                {validationErrors.impactObjectives && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {validationErrors.impactObjectives}
                                    </p>
                                )}
                            </div>

                            {/* Evaluation Criteria */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Evaluation Criteria{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="evaluationCriteria"
                                    value={formData.evaluationCriteria}
                                    onChange={handleChange}
                                    onFocus={() =>
                                        setActiveField("evaluationCriteria")
                                    }
                                    onBlur={() => setActiveField(null)}
                                    rows="4"
                                    className={`mt-1 block w-full rounded-xl bg-white border ${
                                        activeField === "evaluationCriteria"
                                            ? "border-green-500 ring-1 ring-green-500"
                                            : "border-gray-200"
                                    } px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                                        validationErrors.evaluationCriteria
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    placeholder="Explain how applications will be evaluated"
                                />
                                {validationErrors.evaluationCriteria && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {validationErrors.evaluationCriteria}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                Target Countries{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            {/* Country selection pills */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {countries.map((country) => (
                                    <button
                                        key={country}
                                        type="button"
                                        onClick={() => {
                                            const currentCountries =
                                                formData.countries || [];
                                            const newCountries =
                                                currentCountries.includes(
                                                    country
                                                )
                                                    ? currentCountries.filter(
                                                          (c) => c !== country
                                                      )
                                                    : [
                                                          ...currentCountries,
                                                          country,
                                                      ];

                                            setFormData({
                                                ...formData,
                                                countries: newCountries,
                                            });
                                        }}
                                        className={`px-3 py-1 text-sm rounded-full border ${
                                            (formData.countries || []).includes(
                                                country
                                            )
                                                ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                                                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>

                            {/* Selected countries display */}
                            {(formData.countries?.length || 0) > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Selected countries:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.countries.map((country) => (
                                            <span
                                                key={country}
                                                className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full flex items-center"
                                            >
                                                {country}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            countries:
                                                                formData.countries.filter(
                                                                    (c) =>
                                                                        c !==
                                                                        country
                                                                ),
                                                        });
                                                    }}
                                                    className="ml-1.5 text-emerald-500 hover:text-emerald-700"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {validationErrors.countries && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {validationErrors.countries}
                                </p>
                            )}
                        </div>

                        {/* Grant Brief PDF */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                Upload Grant Brief PDF{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div
                                className={`mt-1 border rounded-xl transition-all duration-200 ${
                                    validationErrors.grantBriefPDF
                                        ? "border-red-500"
                                        : formData.grantBriefPDF
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center p-3">
                                    <label className="flex flex-1 cursor-pointer">
                                        <div className="flex items-center">
                                            <span className="inline-flex mr-3 items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600">
                                                {formData.grantBriefPDF ? (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                            <div className="flex-1">
                                                <span className="font-medium text-sm block text-gray-700">
                                                    {formData.grantBriefPDF
                                                        ? formData.grantBriefPDF
                                                              .name
                                                        : "Click to upload"}
                                                </span>
                                                {formData.grantBriefPDF ? (
                                                    <span className="text-xs text-green-600">
                                                        {(
                                                            formData
                                                                .grantBriefPDF
                                                                .size / 1024
                                                        ).toFixed(1)}{" "}
                                                        KB
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-500">
                                                        PDF, max 5MB
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            className="sr-only"
                                        />
                                    </label>

                                    {formData.grantBriefPDF && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    grantBriefPDF: null,
                                                }))
                                            }
                                            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            {validationErrors.grantBriefPDF && (
                                <p className="mt-1.5 text-sm text-red-500">
                                    {validationErrors.grantBriefPDF}
                                </p>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className="mt-8 flex justify-end pt-4 space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all duration-200 flex items-center justify-center min-w-32"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>Create Grant</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
                        <div className="p-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-10 w-10 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Grant Created Successfully!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your new grant offering has been published and
                                is now visible to applicants.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        onClose();
                                    }}
                                    className="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferGrantModal;
