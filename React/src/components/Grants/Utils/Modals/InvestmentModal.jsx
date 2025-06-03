import React, { useState, useEffect } from "react";
import axiosClient from "../../../../axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Clock,
    Paperclip,
    X,
    User,
    BarChart2,
    FileText,
    Flag,
    Check,
} from "lucide-react";
const InvestmentApplicationModal = ({ capitalId, onClose, onSuccess }) => {
     const [businessId, setBusinessId] = useState(null);
     const [businessOptions, setBusinessOptions] = useState([]);

  const [formData, setFormData] = useState({
      business_id: null,
      capital_id: capitalId,
      startup_name: "",
      contact_person_name: "",
      contact_person_email: "",
      sector: "",
      headquarters_location: "",
      stage: "",
      revenue_last_12_months: "",
      team_experience_avg_years: "",
      traction_kpis: "",
      pitch_deck_file: null,
      pitch_video_file: null,
      business_plan: null,
      social_impact_areas: "",
      cac_ltv: "",
      burn_rate: "",
      irr_projection: "",
      exit_strategy: "",
      milestones: [
          {
              title: "",
              amount: "",
              description: "",
              date: "",
              requiresVerification: false,
              deliverables: [],
          },
      ],
  });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const id = "all";
        axiosClient
            .get("/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf7E_-" + id)
            .then(({ data }) => {
                setBusinessOptions(data.business);
            })
            .catch((error) => {
                console.error("Error fetching business options:", error);
            });
    }, []);

    const handleBusinessChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setBusinessId(selectedId);
        setFormData((prev) => ({
            ...prev,
            business_id: selectedId,
        }));
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

    const impactAreas = [
        "Food Security",
        "Carbon Reduction",
        "Job Creation",
        "Water Conservation",
        "Education",
        "Healthcare",
        "Financial Inclusion",
    ];

     const sectors = [
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
    // Validate numeric fields to prevent negative values
    const validateNumericField = (name, value) => {
        if (value === "") return true;

        const numValue = Number(value);
        if (isNaN(numValue)) return false;

        // Specific validation for team_experience_avg_years - must be an integer
        if (name === "team_experience_avg_years") {
            if (!Number.isInteger(numValue) || numValue < 0 || numValue > 50) {
                return false;
            }
        } else if (name === "revenue_last_12_months" && numValue < 0) {
            return false;
        } else if (name === "cac_ltv" && numValue < 0) {
            return false;
        } else if (name === "burn_rate" && numValue < 0) {
            return false;
        } else if (
            name === "irr_projection" &&
            (numValue < -100 || numValue > 1000)
        ) {
            return false;
        }

        return true;
    };

    // Clear field error when user focuses on the field
    const handleFocus = (e) => {
        const { name } = e.target;
        setFieldErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for team_experience_avg_years to enforce integers
        if (name === "team_experience_avg_years") {
            // If value is empty, allow it
            if (value === "") {
                setFormData((prev) => ({ ...prev, [name]: value }));
                return;
            }

            // Only allow integer input
            const intValue = parseInt(value, 10);

            if (isNaN(intValue)) {
                setFieldErrors((prev) => ({
                    ...prev,
                    [name]: "Please enter a whole number",
                }));
                return;
            }

            if (intValue < 0 || intValue > 50) {
                setFieldErrors((prev) => ({
                    ...prev,
                    [name]: "Experience must be between 0-50 years",
                }));
                return;
            }

            // Set the integer value
            setFormData((prev) => ({ ...prev, [name]: intValue }));
            // Clear error
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
            return;
        }

        // Validate other numeric fields in real-time
        if (
            [
                "revenue_last_12_months",
                "cac_ltv",
                "burn_rate",
                "irr_projection",
            ].includes(name)
        ) {
            if (!validateNumericField(name, value)) {
                let errorMessage;

                if (name === "revenue_last_12_months")
                    errorMessage = "Revenue cannot be negative";
                else if (name === "cac_ltv")
                    errorMessage = "CAC/LTV ratio cannot be negative";
                else if (name === "burn_rate")
                    errorMessage = "Burn rate cannot be negative";
                else if (name === "irr_projection")
                    errorMessage = "IRR must be between -100% and 1000%";

                setFieldErrors((prev) => ({
                    ...prev,
                    [name]: errorMessage,
                }));
                return;
            } else {
                // Clear error
                setFieldErrors((prev) => ({ ...prev, [name]: "" }));
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // console.log("capitalId", capitalId);
    // console.log("businessId", businessId);

    const validateFile = (file, allowedTypes) => {
        if (!file) return true;

        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
            return {
                valid: false,
                message: `File must be one of: ${allowedTypes.join(", ")}`,
            };
        }

        if (file.size > 10 * 1024 * 1024) {
            return {
                valid: false,
                message: "File size must be less than 10MB",
            };
        }

        return { valid: true };
    };
    const addMilestone = () => {
        setFormData((prev) => ({
            ...prev,
            milestones: [
                ...prev.milestones,
                {
                    title: "",
                    amount: "",
                    description: "",
                    date: "",
                    requiresVerification: false,
                    deliverables: [],
                },
            ],
        }));
    };

    const removeMilestone = (index) => {
        setFormData((prev) => ({
            ...prev,
            milestones: prev.milestones.filter((_, i) => i !== index),
        }));
    };

    const updateMilestone = (index, field, value) => {
        setFormData((prev) => {
            const updatedMilestones = [...prev.milestones];
            updatedMilestones[index] = {
                ...updatedMilestones[index],
                [field]: value,
            };
            return {
                ...prev,
                milestones: updatedMilestones,
            };
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        // Clear file if input is emptied
        if (!file) {
            setFormData((prev) => ({ ...prev, [name]: null }));
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
            return;
        }

        let validationResult;
        if (name === "pitch_deck_file") {
            validationResult = validateFile(file, ["pdf", "docx"]);
        } else if (name === "business_plan") {
            validationResult = validateFile(file, [
                "pdf",
                "docx",
                "ppt",
                "pptx",
            ]);
        } else if (name === "pitch_video_file") {
            validationResult = validateFile(file, ["mp4", "mov", "avi", "wmv"]);
        }

        if (validationResult.valid) {
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        } else {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: validationResult.message,
            }));
            // Clear the file input
            e.target.value = "";
            toast.error(validationResult.message);
        }
    };

    const validateStep = (step) => {
        let isValid = true;
        let requiredFields = [];
        const errors = {};

        if (step === 1) {
            requiredFields = [
                "startup_name",
                "contact_person_name",
                "contact_person_email",
                "sector",
                "headquarters_location",
                "stage",
            ];

            // Email validation
            if (formData.contact_person_email) {
                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        formData.contact_person_email
                    )
                ) {
                    errors.contact_person_email =
                        "Please enter a valid email address";
                    isValid = false;
                }
            }
        } else if (step === 2) {
            requiredFields = [
                "revenue_last_12_months",
                "team_experience_avg_years",
                "traction_kpis",
                "exit_strategy",
            ];
        } else if (step === 3) {
            // Make pitch_deck_file required
            if (!formData.pitch_deck_file) {
                errors.pitch_deck_file = "Pitch Deck is required";
                isValid = false;
            }
        }
        if (step === 4) {
            requiredFields = [
                "funding_ask",
                "use_of_funds",
                "competitive_advantage",
            ];
        }

        // Check required fields
        const missingFields = requiredFields.filter(
            (field) => !formData[field]
        );
        if (missingFields.length > 0) {
            missingFields.forEach((field) => {
                errors[field] = "This field is required";
            });

            const fieldNames = missingFields.map((field) =>
                field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())
            );
            toast.error(`Please fill in all required fields`, {
                autoClose: 3000,
            });
            isValid = false;
        }

        setFieldErrors((prev) => ({
            ...prev,
            ...errors,
        }));

        return isValid;
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            return;
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!validateStep(currentStep)) {
        //     console.log("Validation failed for step:", currentStep);
        //     return;

        // }
        console.log("Submitting form data:", formData);

        setIsSubmitting(true);

        try {
            // Create FormData object
            const formDataToSend = new FormData();

            // First, log the complete form data to console
            console.log("Form data being submitted:", {
                ...formData,
                // Stringify milestones for better readability in console
                milestones: formData.milestones.map((m) => ({
                    ...m,
                    // Convert file objects to file names for logging
                    deliverables: m.deliverables.map((f) => f.name),
                })),
            });

            // Append all regular fields (non-file, non-array)
            Object.entries(formData).forEach(([key, value]) => {
                // Skip milestones for now (we'll handle them separately)
                if (key !== "milestones" && value !== null && value !== "") {
                    if (typeof value === "object" && !(value instanceof File)) {
                        // Stringify objects
                        formDataToSend.append(key, JSON.stringify(value));
                    } else {
                        formDataToSend.append(key, value);
                    }
                }
            });

            // Handle milestones data
            formData.milestones.forEach((milestone, index) => {
                // Append each milestone field with index prefix
                formDataToSend.append(
                    `milestones[${index}][title]`,
                    milestone.title
                );
                formDataToSend.append(
                    `milestones[${index}][amount]`,
                    milestone.amount
                );
                formDataToSend.append(
                    `milestones[${index}][description]`,
                    milestone.description
                );
                formDataToSend.append(
                    `milestones[${index}][date]`,
                    milestone.date
                );
                formDataToSend.append(
                    `milestones[${index}][requiresVerification]`,
                    milestone.requiresVerification
                );

                // Handle deliverables (files)
                milestone.deliverables.forEach((file, fileIndex) => {
                    formDataToSend.append(
                        `milestones[${index}][deliverables][${fileIndex}]`,
                        file
                    );
                });
            });

            // Log the FormData content before sending
            console.log("FormData content:");
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            const response = await axiosClient.post(
                "capital/investment-application",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("API Response:", response);
            toast.success("Application submitted successfully!");

            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Submission error:", err);
            const errorMessage =
                err.response?.data?.message ||
                "An error occurred. Please try again.";
            toast.error(errorMessage);

            // Handle validation errors from the server
            if (err.response?.data?.errors) {
                console.error(
                    "Server validation errors:",
                    err.response.data.errors
                );
                const serverErrors = {};
                Object.entries(err.response.data.errors).forEach(
                    ([key, messages]) => {
                        serverErrors[key] = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                    }
                );
                setFieldErrors((prev) => ({
                    ...prev,
                    ...serverErrors,
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[
                { step: 1, icon: <User className="w-5 h-5" /> },
                { step: 2, icon: <BarChart2 className="w-5 h-5" /> },
                { step: 3, icon: <FileText className="w-5 h-5" /> },
                { step: 4, icon: <Flag className="w-5 h-5" /> },
            ].map(({ step, icon }) => (
                <React.Fragment key={step}>
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${
                            currentStep === step
                                ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
                                : currentStep > step
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-500"
                        }`}
                    >
                        {currentStep > step ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            icon
                        )}
                    </div>
                    {step < 4 && (
                        <div
                            className={`h-1 w-16 mx-2 transition-all duration-300 ${
                                currentStep > step
                                    ? "bg-green-100"
                                    : "bg-gray-100"
                            }`}
                        ></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    // Helper function to render error feedback
    const renderFieldError = (fieldName) => {
        if (fieldErrors[fieldName]) {
            return (
                <p className="mt-1 text-sm text-red-600">
                    {fieldErrors[fieldName]}
                </p>
            );
        }
        return null;
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-4">
                                <label
                                    htmlFor="startup_name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Startup Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="startup_name"
                                    name="startup_name"
                                    value={formData.startup_name}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.startup_name
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="Enter startup name"
                                    required
                                />
                                {renderFieldError("startup_name")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="contact_person_name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contact Person Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="contact_person_name"
                                    name="contact_person_name"
                                    value={formData.contact_person_name}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.contact_person_name
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="Enter contact person name"
                                    required
                                />
                                {renderFieldError("contact_person_name")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="contact_person_email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contact Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="contact_person_email"
                                    name="contact_person_email"
                                    value={formData.contact_person_email}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.contact_person_email
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="email@example.com"
                                    required
                                />
                                {renderFieldError("contact_person_email")}
                            </div>

                            <div className="mb-6">
                                <div className="relative">
                                    <label
                                        htmlFor="business"
                                        className="block text-sm font-medium text-gray-700 mb-1.5 pl-1"
                                    >
                                        Business{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        id="business"
                                        name="business_id" // Changed to match formData field
                                        value={formData.business_id || ""} // Use formData.business_id
                                        onChange={handleBusinessChange}
                                        onFocus={handleFocus}
                                        className={`w-full px-4 py-2.5 border-2 ${
                                            fieldErrors.business_id // Update error field if needed
                                                ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                                : "border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        } rounded-lg focus:outline-none transition-all duration-200 appearance-none bg-white bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] bg-no-repeat bg-[length:1.5rem] bg-[right_0.5rem_center]`}
                                        required
                                    >
                                        <option value="" disabled hidden>
                                            Select Business
                                        </option>
                                        {businessOptions.map((business) => (
                                            <option
                                                key={business.id}
                                                value={business.id}
                                                className="py-2 hover:bg-green-50"
                                            >
                                                {business.name}
                                            </option>
                                        ))}
                                    </select>

                                    {renderFieldError("business")}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="sector"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Sector{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="sector"
                                    name="sector"
                                    value={formData.sector}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.sector
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    required
                                >
                                    <option value="">Select Sector</option>
                                    {sectors.map((sector) => (
                                        <option key={sector} value={sector}>
                                            {sector}
                                        </option>
                                    ))}
                                </select>
                                {renderFieldError("sector")}
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="headquarters_location"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Headquarters Location{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="headquarters_location"
                                    name="headquarters_location"
                                    value={formData.headquarters_location}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.headquarters_location
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2 bg-white`}
                                    required
                                >
                                    <option value="" disabled>
                                        Select a country
                                    </option>
                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                {renderFieldError("headquarters_location")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="stage"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Funding Stage{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="stage"
                                    name="stage"
                                    value={formData.stage}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.stage
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    required
                                >
                                    <option value="">
                                        Select Funding Stage
                                    </option>
                                    <option value="Pre-Seed">Pre-Seed</option>
                                    <option value="Seed">Seed</option>
                                    <option value="Series A">Series A</option>
                                    <option value="Series B">Series B</option>
                                    <option value="Series C+">Series C+</option>
                                </select>
                                {renderFieldError("stage")}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-4">
                                <label
                                    htmlFor="revenue_last_12_months"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Revenue (Last 12 Months){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="revenue_last_12_months"
                                    name="revenue_last_12_months"
                                    value={formData.revenue_last_12_months}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.revenue_last_12_months
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="Enter amount in USD"
                                    min="0"
                                    step="any"
                                    required
                                />
                                {renderFieldError("revenue_last_12_months")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="team_experience_avg_years"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Team Avg. Experience (Years){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="team_experience_avg_years"
                                    name="team_experience_avg_years"
                                    value={formData.team_experience_avg_years}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.team_experience_avg_years
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="Enter whole years (0-50)"
                                    min="0"
                                    max="50"
                                    step="1" // Changed to 1 to ensure integer values only
                                    required
                                />
                                {renderFieldError("team_experience_avg_years")}
                                <p className="mt-1 text-xs text-gray-500">
                                    Please enter whole numbers only (0-50)
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="traction_kpis"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Business Growth Metrics{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="traction_kpis"
                                name="traction_kpis"
                                value={formData.traction_kpis}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                className={`w-full px-4 py-2 border ${
                                    fieldErrors.traction_kpis
                                        ? "border-red-300 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-green-500"
                                } rounded-md focus:outline-none focus:ring-2`}
                                placeholder="Examples:
• Revenue: $200K MRR, 20% MoM growth
• Users: 5,000 active, 30% retention
• Engagement: 15 min daily usage
• Efficiency: CAC $150, LTV $900
• Milestones: Key partnerships secured"
                                rows="4"
                                required
                            />
                            {renderFieldError("traction_kpis")}
                            <div className="mt-1 text-xs text-gray-500">
                                <span className="font-medium">Tip:</span>{" "}
                                Highlight metrics that demonstrate
                                product-market fit and growth potential. Include
                                numbers, timeframes, and comparisons to industry
                                benchmarks where possible.
                            </div>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="exit_strategy"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Planned Business Exit{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="exit_strategy"
                                name="exit_strategy"
                                value={formData.exit_strategy}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                className={`w-full px-4 py-2 border ${
                                    fieldErrors.exit_strategy
                                        ? "border-red-300 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-green-500"
                                } rounded-md focus:outline-none focus:ring-2`}
                                placeholder="Example scenarios:
- IPO target within 5 years
- Acquisition by strategic buyer
- Merger with complementary business
- Secondary sale to private equity"
                                rows="3"
                                required
                            />
                            {renderFieldError("exit_strategy")}
                            <div className="mt-1 text-xs text-gray-500">
                                Describe your preferred exit path and timeline.
                                Investors want to understand your long-term
                                vision.
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-4">
                                <label
                                    htmlFor="pitch_deck_file"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Pitch Deck (PDF/DOCX){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="pitch_deck_file"
                                    name="pitch_deck_file"
                                    onChange={handleFileChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.pitch_deck_file
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    accept=".pdf,.docx"
                                    required
                                />
                                {formData.pitch_deck_file && (
                                    <p className="mt-1 text-sm text-green-600">
                                        Selected:{" "}
                                        {formData.pitch_deck_file.name}
                                    </p>
                                )}
                                {renderFieldError("pitch_deck_file")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="pitch_video_file"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Pitch Video (MP4/MOV/AVI)
                                </label>
                                <input
                                    type="file"
                                    id="pitch_video_file"
                                    name="pitch_video_file"
                                    onChange={handleFileChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.pitch_video_file
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    accept=".mp4,.mov,.avi,.wmv"
                                />
                                {formData.pitch_video_file && (
                                    <p className="mt-1 text-sm text-green-600">
                                        Selected:{" "}
                                        {formData.pitch_video_file.name}
                                    </p>
                                )}
                                {renderFieldError("pitch_video_file")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="business_plan"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Business Plan (PDF/DOCX/PPT)
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="file"
                                    id="business_plan"
                                    name="business_plan"
                                    onChange={handleFileChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.business_plan
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    accept=".pdf,.docx,.ppt,.pptx"
                                    required
                                />
                                {formData.business_plan && (
                                    <p className="mt-1 text-sm text-green-600">
                                        Selected: {formData.business_plan.name}
                                    </p>
                                )}
                                {renderFieldError("business_plan")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="social_impact_areas"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Social Impact Areas
                                </label>
                                <select
                                    id="social_impact_areas"
                                    name="social_impact_areas"
                                    value={formData.social_impact_areas}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.social_impact_areas
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2 bg-white`}
                                >
                                    <option value="" disabled>
                                        Select a social impact area
                                    </option>
                                    {impactAreas.map((area) => (
                                        <option key={area} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
                                {renderFieldError("social_impact_areas")}
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="cac_ltv"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Customer Profitability Ratio (LTV:CAC)
                                </label>
                                <input
                                    type="number"
                                    id="cac_ltv"
                                    name="cac_ltv"
                                    value={formData.cac_ltv}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.cac_ltv
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="e.g., 3.0 (LTV is 3× CAC)"
                                    min="0"
                                    step="0.1"
                                />
                                {renderFieldError("cac_ltv")}
                                <div className="mt-1 text-xs text-gray-500 flex items-start">
                                    <svg
                                        className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>
                                        <span className="font-medium">
                                            Healthy ratio is 3× or higher
                                        </span>{" "}
                                        (LTV should be at least 3× your CAC).
                                        Example: Spending $100 to acquire a
                                        customer worth $300+ over their
                                        lifetime.
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="burn_rate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Monthly Cash Burn ($)
                                </label>
                                <input
                                    type="number"
                                    id="burn_rate"
                                    name="burn_rate"
                                    value={formData.burn_rate}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.burn_rate
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="e.g., 50000 (for $50K/month)"
                                    min="0"
                                />
                                {renderFieldError("burn_rate")}
                                <div className="mt-1 text-xs text-gray-500 flex items-start">
                                    <svg
                                        className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>
                                        Burn rate is your monthly operating
                                        expenses. Example: $50K/month burn with
                                        $200K cash = 4 months runway.
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="irr_projection"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Projected Annual Return (IRR) %
                                </label>
                                <input
                                    type="number"
                                    id="irr_projection"
                                    name="irr_projection"
                                    value={formData.irr_projection}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`w-full px-4 py-2 border ${
                                        fieldErrors.irr_projection
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-green-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                    placeholder="e.g., 25 (for 25% annual return)"
                                    min="-100"
                                    max="1000"
                                    step="0.1"
                                />
                                {renderFieldError("irr_projection")}
                                <div className="mt-1 text-xs text-gray-500 flex items-start">
                                    <svg
                                        className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>
                                        IRR (Internal Rate of Return) estimates
                                        your annualized return on investment.
                                        Typical targets: 20-40% for VC, 10-15%
                                        for mature businesses.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                            <div className="bg-green-100 rounded-lg p-2">
                                <Clock className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-800 mb-1">
                                    Funding Milestones
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Define clear and verifiable milestones to
                                    demonstrate how you'll strategically utilize
                                    the grant funding across your project
                                    timeline. This helps investors track your
                                    progress and build trust in your execution
                                    plan.
                                </p>
                            </div>
                        </div>

                        {/* Milestones List */}
                        <div className="space-y-4">
                            {formData.milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <span className="text-green-600 font-medium">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-900">
                                                Milestone {index + 1}
                                            </h4>
                                        </div>
                                        {formData.milestones.length > 1 && (
                                            <button
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                onClick={() =>
                                                    removeMilestone(index)
                                                }
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor={`title-${index}`}
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Title*
                                            </label>
                                            <input
                                                type="text"
                                                id={`title-${index}`}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                                placeholder="E.g., Product Prototype Completion"
                                                value={milestone.title}
                                                onChange={(e) =>
                                                    updateMilestone(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor={`amount-${index}`}
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Funding Amount ($)*
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">
                                                        $
                                                    </span>
                                                </div>
                                                <input
                                                    type="number"
                                                    id={`amount-${index}`}
                                                    className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                                    placeholder="0.00"
                                                    value={milestone.amount}
                                                    onChange={(e) =>
                                                        updateMilestone(
                                                            index,
                                                            "amount",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label
                                            htmlFor={`desc-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Description*
                                        </label>
                                        <textarea
                                            id={`desc-${index}`}
                                            rows={3}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                            placeholder="What will be achieved in this milestone?"
                                            value={milestone.description}
                                            onChange={(e) =>
                                                updateMilestone(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor={`date-${index}`}
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Target Completion Date*
                                            </label>
                                            <input
                                                type="date"
                                                id={`date-${index}`}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                                value={milestone.date}
                                                onChange={(e) =>
                                                    updateMilestone(
                                                        index,
                                                        "date",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <div className="flex items-center h-10">
                                                <input
                                                    id={`verification-${index}`}
                                                    name={`verification-${index}`}
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    checked={
                                                        milestone.requiresVerification
                                                    }
                                                    onChange={(e) =>
                                                        updateMilestone(
                                                            index,
                                                            "requiresVerification",
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <label
                                                    htmlFor={`verification-${index}`}
                                                    className="ml-2 block text-sm text-gray-700"
                                                >
                                                    Requires third-party
                                                    verification
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deliverables
                                        </label>
                                        <div
                                            className={`mt-1 transition-all duration-200 ${
                                                milestone.deliverables.length >
                                                0
                                                    ? "border border-gray-200 rounded-lg bg-gray-50"
                                                    : "border-2 border-dashed border-gray-300 rounded-lg bg-white"
                                            }`}
                                        >
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="space-y-3">
                                                    {milestone.deliverables
                                                        .length === 0 ? (
                                                        <div className="text-center">
                                                            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                                                                <svg
                                                                    className="w-8 h-8"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="mt-3 flex justify-center text-sm text-gray-600">
                                                                <label
                                                                    htmlFor={`file-upload-${index}`}
                                                                    className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                                                >
                                                                    <span>
                                                                        Click to
                                                                        upload
                                                                    </span>
                                                                    <input
                                                                        id={`file-upload-${index}`}
                                                                        type="file"
                                                                        className="sr-only"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e
                                                                                    .target
                                                                                    .files &&
                                                                                e
                                                                                    .target
                                                                                    .files
                                                                                    .length >
                                                                                    0
                                                                            ) {
                                                                                updateMilestone(
                                                                                    index,
                                                                                    "deliverables",
                                                                                    [
                                                                                        e
                                                                                            .target
                                                                                            .files[0],
                                                                                    ]
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                                <p className="pl-1">
                                                                    or drag and
                                                                    drop
                                                                </p>
                                                            </div>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                PDF, DOC, XLS up
                                                                to 10MB
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                                {milestone.deliverables.map(
                                                                    (
                                                                        file,
                                                                        fileIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                fileIndex
                                                                            }
                                                                            className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300"
                                                                        >
                                                                            <div className="flex items-center min-w-0">
                                                                                <div className="flex-shrink-0 h-10 w-10 bg-green-50 rounded-md flex items-center justify-center text-green-600">
                                                                                    <Paperclip className="h-5 w-5" />
                                                                                </div>
                                                                                <div className="ml-3 truncate">
                                                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                                                        {
                                                                                            file.name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {(
                                                                                            file.size /
                                                                                            1024 /
                                                                                            1024
                                                                                        ).toFixed(
                                                                                            2
                                                                                        )}{" "}
                                                                                        MB
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    updateMilestone(
                                                                                        index,
                                                                                        "deliverables",
                                                                                        []
                                                                                    );
                                                                                }}
                                                                                className="ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                                                            >
                                                                                <X className="h-5 w-5" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                onClick={addMilestone}
                            >
                                <svg
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Add Another Milestone
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scaleIn">
                    <div className="p-8 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-bounce">
                            <svg
                                className="h-8 w-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            ></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Application Submitted!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Thank you for your submission. We'll review your
                            application and get back to you soon.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            {/* Outer scrollable container (for viewport scrolling) */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            Investment Application - {capitalId}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Inner scrollable content (for form scrolling) */}
                <div className="overflow-y-auto flex-1 p-6">
                    {/* Remove the inner form tag here */}
                    {renderStepIndicator()}
                    <div className="min-h-[40vh]">{renderStepContent()}</div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 border-t sticky bottom-0 bg-white z-10">
                    <div className="flex justify-between gap-4">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex-1 sm:flex-none"
                            >
                                Back
                            </button>
                        )}
                        <div className="flex-1" /> {/* Spacer */}
                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex-1 sm:flex-none"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button" // Change to type="button" to prevent form submission
                                onClick={handleSubmit} // Use onClick handler instead
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex-1 sm:flex-none ${
                                    isSubmitting
                                        ? "opacity-75 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⟳</span>
                                        Submitting...
                                    </span>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentApplicationModal;
