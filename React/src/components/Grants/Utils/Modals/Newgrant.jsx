import React, { useState, useEffect, useRef } from "react";
import {
    X,
    Milestone,
    Upload,
    Check,
    Calendar,
    Shield,
    Award,
    ArrowRight,
    ChevronDown,
    Sparkles,
    Zap,
    Globe,
    Clock,
    FileCheck,
    AlertTriangle,
    Paperclip,
    Plus,
} from "lucide-react";
import axiosClient from "../../../../axiosClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
export default function GrantApplicationModal({ onClose, grantId }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    const [matchPreview, setMatchPreview] = useState(null);
    const [formData, setFormData] = useState({
        startupName: "",
        contactPerson: "",
        contactEmail: "",
        sector: "",
        location: "",
        stage: "",
        revenue: "",
        teamExperience: "",
        traction: "",
        impactAreas: [],
        isGenderLed: false,
        isYouthLed: false,
        isRuralBased: false,
        usesLocalSourcing: false,
        documents: {
            pitchDeck: null,
            businessPlan: null,
            pitchVideo: null,
        },
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
        isComplete: false,
    });

    const checkIfComplete = () => {
        // Check if all required fields are filled
        const requiredFields = [
            "startupName",
            "contactPerson",
            "contactEmail",
            "sector",
            "location",
            "stage",
            "revenue",
            "teamExperience",
            "traction",
            "impactAreas",
            "isGenderLed",
            "isYouthLed",
            "isRuralBased",
            "usesLocalSourcing",
        ];

        const areFieldsComplete = requiredFields.every((field) => {
            if (Array.isArray(formData[field])) {
                // If it's an array (like impactAreas), it shouldn't be empty
                return formData[field].length > 0;
            }
            if (typeof formData[field] === "boolean") {
                // If it's a boolean (like isGenderLed), just check the value
                return formData[field] !== null;
            }
            return formData[field] !== ""; // Check for non-empty strings
        });

        // Check if at least one document is provided
        const areDocumentsComplete = [
            "pitchDeck",
            "businessPlan",
            "pitchVideo",
        ].some((doc) => formData.documents[doc]);

        // Update the isComplete flag based on the above checks
        setFormData((prevState) => ({
            ...prevState,
            isComplete: areFieldsComplete && areDocumentsComplete,
        }));
    };

    // Run check whenever formData changes
    // useEffect(() => {
    //   checkIfComplete();
    // }, [formData]);

    const modalRef = useRef();

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Form handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImpactAreaChange = (area) => {
        setFormData((prev) => ({
            ...prev,
            impactAreas: prev.impactAreas.includes(area)
                ? prev.impactAreas.filter((a) => a !== area)
                : [...prev.impactAreas, area],
        }));
    };

    // Submission handler
    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        setSubmissionError(null);
        setSubmissionSuccess(false);

        try {
            // 1. Log complete form state
            console.group("[FORM STATE]");
            console.log(
                "Complete form data:",
                JSON.parse(JSON.stringify(formData))
            );
            console.groupEnd();

            const formDataToSend = new FormData();

            // 2. Prepare request data
            const requestData = {
                grant_id: grantId,
                startup_name: formData.startupName,
                contact_name: formData.contactPerson,
                contact_email: formData.contactEmail,
                sector: formData.sector,
                headquarters_location: formData.location,
                stage: formData.stage,
                revenue_last_12_months: formData.revenue,
                team_experience_avg_years: formData.teamExperience,
                traction_kpis: formData.traction,
                social_impact_areas: formData.impactAreas.join(","),
                is_gender_led: formData.isGenderLed,
                is_youth_led: formData.isYouthLed,
                is_rural_based: formData.isRuralBased,
                uses_local_sourcing: formData.usesLocalSourcing,
            };

            console.group("[REQUEST DATA]");
            console.table(requestData);
            console.groupEnd();

            // 3. Append all fields
            console.group("[APPENDING FIELDS]");
            Object.entries(requestData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
                console.log(`Added field: ${key} = ${value}`);
            });
            console.groupEnd();

            // 4. Append files
            console.group("[FILE ATTACHMENTS]");
            Object.entries(formData.documents).forEach(([key, file]) => {
                if (file) {
                    formDataToSend.append(`${key}_file`, file);
                    console.log(
                        `Added file: ${key}_file = ${file.name} (${file.size} bytes)`
                    );
                } else {
                    console.log(`No file attached for: ${key}_file`);
                }
            });
            console.groupEnd();

            // 5. Append milestones
            console.group("[MILESTONES]");
            formData.milestones.forEach((milestone, index) => {
                console.group(`Milestone ${index + 1}`);

                const fields = {
                    title: milestone.title,
                    amount: milestone.amount,
                    description: milestone.description,
                    date: milestone.date,
                    requires_verification: milestone.requiresVerification,
                };

                Object.entries(fields).forEach(([field, value]) => {
                    formDataToSend.append(
                        `milestones[${index}][${field}]`,
                        value
                    );
                    console.log(
                        `Added milestone field: milestones[${index}][${field}] = ${value}`
                    );
                });

                if (milestone.deliverables?.length > 0) {
                    milestone.deliverables.forEach((file, fileIndex) => {
                        formDataToSend.append(
                            `milestones[${index}][deliverables][${fileIndex}]`,
                            file
                        );
                        console.log(
                            `Added deliverable: milestones[${index}][deliverables][${fileIndex}] = ${file.name}`
                        );
                    });
                } else {
                    console.log("No deliverables for this milestone");
                }

                console.groupEnd();
            });
            console.groupEnd();

            // 6. Verify FormData before sending
            console.group("[FINAL PAYLOAD]");
            for (let [key, value] of formDataToSend.entries()) {
                if (value instanceof File || value instanceof Blob) {
                    console.log(
                        `${key}: FILE (${value.name || "blob"}, ${
                            value.size
                        } bytes)`
                    );
                } else {
                    console.log(`${key}: ${value}`);
                }
            }
            console.groupEnd();

            // 7. Make API call with timeout
            console.log("Attempting to submit to backend...");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await axiosClient.post(
                "grant/grant-application",
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    signal: controller.signal,
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        console.log(`Upload progress: ${percentCompleted}%`);
                    },
                }
            );

            clearTimeout(timeoutId);

            // 8. Verify backend response
            if (!response.data) {
                throw new Error("Received empty response from server");
            }

            console.group("[BACKEND RESPONSE]");
            console.log("Status:", response.status);
            console.log("Response data:", response.data);
            console.groupEnd();

            if (response.status !== 200 && response.status !== 201) {
                throw new Error(
                    `Server responded with status ${response.status}`
                );
            }

            setSubmissionSuccess(true);
            console.log("SUCCESS: Data was successfully posted to backend");

            toast.success(
                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Application submitted successfully!</span>
                </div>,
                {
                    position: "bottom-right",
                    autoClose: 1700,
                    hideProgressBar: true,
                    closeButton: false,
                    className:
                        "!bg-white !text-gray-700 !shadow-sm !rounded-lg !border !border-gray-100 !px-3 !py-2",
                    onClose: onClose,
                }
            );
        } catch (error) {
            console.group("[SUBMISSION ERROR]");

            let errorMessage = "Submission failed";

            if (error.name === "AbortError") {
                errorMessage = "Request timed out after 30 seconds";
                console.error("Request timeout occurred");
            } else if (error.response) {
                console.error("Server response status:", error.response.status);
                console.error("Server response data:", error.response.data);

                errorMessage =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    `Server error: ${error.response.status}`;
            } else if (error.request) {
                console.error("No response received from server");
                errorMessage = "Could not connect to server";
            } else {
                console.error("Request error:", error.message);
                errorMessage = error.message || "Request failed";
            }

            console.groupEnd();

            setSubmissionError(errorMessage);
            toast.error(
                <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <span>{errorMessage}</span>
                </div>,
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeButton: false,
                    className:
                        "!bg-white !text-gray-700 !shadow-sm !rounded-lg !border !border-red-100 !px-3 !py-2",
                }
            );
        } finally {
            setIsSubmitting(false);
            console.log("Submission process completed");
        }
    };

    useEffect(() => {
        let score = 0;
        if (formData.sector && formData.location && formData.stage) {
            score += 60;
            if (formData.revenue) score += 5;
            if (formData.teamExperience) score += 5;
            if (formData.traction) score += 5;
            if (formData.impactAreas.length > 0) score += 5;
            if (formData.isGenderLed) score += 5;
            if (formData.isYouthLed) score += 5;
            if (formData.isRuralBased) score += 5;
            if (formData.usesLocalSourcing) score += 5;
        }
        score = Math.min(score, 100);
        let matchLevel = "Needs Revision";
        if (score >= 80) matchLevel = "Ideal Match";
        else if (score >= 60) matchLevel = "Strong Match";
        setMatchPreview({ score, matchLevel });
    }, [formData]);

    // Custom Toast component for consistent styling
    const ValidationToast = ({ message }) => (
        <div className="flex items-start">
            <AlertTriangle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-medium">Validation Required</p>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );

    const nextStep = () => {
        let canProceed = true;

          if (step === 1) {
            const requiredFields = ['startupName', 'contactPerson', 'contactEmail', 'sector', 'location'];
            canProceed = requiredFields.every(field => formData[field]?.trim() !== '');
            if (!canProceed) {
              toast(
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Complete all fields to continue</span>
                </div>,
                {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeButton: false,
                  className: "!bg-gray-700 !text-gray-200 !shadow-sm !rounded-lg !border !border-gray-100 !px-3 !py-2",
                }
              );
              return;
            }
          } else if (step === 2) {
            const requiredFields = ['stage', 'revenue', 'teamExperience', 'traction'];
            canProceed = requiredFields.every(field => formData[field]?.trim() !== '');
            if (!canProceed) {
              toast.warning(
                <ValidationToast message="Please fill all required fields in Step 2 before proceeding" />,
                {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  className: '!bg-white !text-gray-800 !shadow-lg !border !border-yellow-200',
                }
              );
              return;
            }
          } else if (step === 3) {
            canProceed = formData.impactAreas?.length > 0;
            if (!canProceed) {
              toast.warning(
                <ValidationToast message="Please select at least one impact area before proceeding" />,
                {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  className: '!bg-white !text-gray-800 !shadow-lg !border !border-yellow-200',
                }
              );
              return;
            }
          } else if (step === 4) {
            // Optional: Add step 4 validation here
            // Example:
            // canProceed = formData.confirmation === true;
          }

        if (canProceed) {
            setStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
    const sectors = ["Agriculture", "Renewable Energy", "Tech"];
    const stages = ["Idea", "MVP", "Seed", "Growth"];
    const impactAreas = [
        "Food Security",
        "Carbon Reduction",
        "Job Creation",
        "Water Conservation",
        "Education",
        "Healthcare",
        "Financial Inclusion",
    ];
    const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"];

    const getStepColor = (currentStep) =>
        step >= currentStep ? "bg-green-500" : "bg-gray-200";
    const getMatchScoreColor = () => {
        if (!matchPreview) return "bg-gray-200";
        if (matchPreview.score >= 80) return "bg-green-500";
        if (matchPreview.score >= 60) return "bg-yellow-500";
        return "bg-red-400";
    };

    // Handle file upload

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [field]: file,
                },
            }));
        }
    };

    const [milestones] = useState([
        {
            title: "",
            amount: "",
            description: "",
            date: "",
            requiresVerification: false,
            deliverables: [],
        },
    ]);

    const addMilestone = () => {
        setFormData({
            ...formData,
            milestones: [
                ...formData.milestones,
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
    };

    const removeMilestone = (index) => {
        if (formData.milestones.length > 1) {
            setFormData({
                ...formData,
                milestones: formData.milestones.filter((_, i) => i !== index),
            });
        }
    };

    const updateMilestone = (index, field, value) => {
        const updatedMilestones = [...formData.milestones];
        updatedMilestones[index][field] = value;
        setFormData({
            ...formData,
            milestones: updatedMilestones,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName="!bg-white !text-gray-800 !shadow-lg !border !border-yellow-200"
                bodyClassName="p-3"
                progressClassName="!bg-yellow-500"
            />
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl border border-gray-100 flex flex-col max-h-[90vh]"
                ref={modalRef}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-teal-400"></div>

                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-green-500 to-teal-400 text-white p-3 rounded-xl shadow-lg shadow-green-200 mr-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                Grant Application
                                <span className="ml-3 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center">
                                    <Sparkles className="w-3 h-3 mr-1" /> Smart
                                    Matching
                                </span>
                            </h2>
                        </div>
                    </div>
                    <button
                        className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 pt-4 pb-2">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                {[1, 2, 3, 4].map((stepNum) => (
                                    <React.Fragment key={stepNum}>
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full ${getStepColor(
                                                    stepNum
                                                )} flex items-center justify-center text-white shadow-lg ${
                                                    step >= stepNum
                                                        ? "shadow-green-200"
                                                        : ""
                                                }`}
                                            >
                                                {stepNum === 1 && (
                                                    <Shield className="w-5 h-5" />
                                                )}
                                                {stepNum === 2 && (
                                                    <Award className="w-5 h-5" />
                                                )}
                                                {stepNum === 3 && (
                                                    <FileCheck className="w-5 h-5" />
                                                )}
                                                {stepNum === 4 && (
                                                    <Milestone className="w-5 h-5" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Line between steps */}
                                        {stepNum < 4 && (
                                            <div
                                                className={`h-1 flex-1 mx-2 ${getStepColor(
                                                    stepNum + 1
                                                )}`}
                                            ></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Startup Name{" "}
                                                <span className="text-green-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="startupName"
                                                value={formData.startupName}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Enter your startup name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contact Person{" "}
                                                <span className="text-green-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="contactPerson"
                                                value={formData.contactPerson}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Full name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Email{" "}
                                            <span className="text-green-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sector{" "}
                                                <span className="text-green-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="sector"
                                                    value={formData.sector}
                                                    onChange={handleChange}
                                                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Sector
                                                    </option>
                                                    {sectors.map((sector) => (
                                                        <option
                                                            key={sector}
                                                            value={sector}
                                                        >
                                                            {sector}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stage{" "}
                                                <span className="text-green-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="stage"
                                                    value={formData.stage}
                                                    onChange={handleChange}
                                                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Stage
                                                    </option>
                                                    {stages.map((stage) => (
                                                        <option
                                                            key={stage}
                                                            value={stage}
                                                        >
                                                            {stage}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Headquarters Location{" "}
                                                <span className="text-green-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Location
                                                    </option>
                                                    {countries.map(
                                                        (country) => (
                                                            <option
                                                                key={country}
                                                                value={country}
                                                            >
                                                                {country}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Revenue (Last 12 Months)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3.5 text-gray-500">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    name="revenue"
                                                    value={formData.revenue}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Team Experience (Avg. Years)
                                            </label>
                                            <input
                                                type="number"
                                                name="teamExperience"
                                                value={formData.teamExperience}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="0"
                                                min="0"
                                                max="50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Traction / KPIs
                                            </label>
                                            <textarea
                                                name="traction"
                                                value={formData.traction}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                placeholder="Key metrics that show your progress"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Social/Environmental Impact Areas
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {impactAreas.map((area) => (
                                                <label
                                                    key={area}
                                                    className={`flex items-center p-3 rounded-lg border ${
                                                        formData.impactAreas.includes(
                                                            area
                                                        )
                                                            ? "border-green-500 bg-green-50"
                                                            : "border-gray-200 hover:bg-gray-50"
                                                    } transition-colors cursor-pointer`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.impactAreas.includes(
                                                            area
                                                        )}
                                                        onChange={() =>
                                                            handleImpactAreaChange(
                                                                area
                                                            )
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                                                            formData.impactAreas.includes(
                                                                area
                                                            )
                                                                ? "bg-green-500"
                                                                : "border border-gray-300"
                                                        }`}
                                                    >
                                                        {formData.impactAreas.includes(
                                                            area
                                                        ) && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-gray-800">
                                                        {area}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <div className="flex items-center mb-4">
                                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                                                <Sparkles className="w-5 h-5 text-green-600" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                Bonus Considerations
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label
                                                className={`flex items-center space-x-3 p-3 rounded-lg ${
                                                    formData.isGenderLed
                                                        ? "bg-green-50 border border-green-100"
                                                        : "hover:bg-gray-100"
                                                } transition-colors cursor-pointer`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="isGenderLed"
                                                    checked={
                                                        formData.isGenderLed
                                                    }
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                                                />
                                                <div>
                                                    <span className="text-gray-700 font-medium">
                                                        Gender-led Business
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Business is led by women
                                                    </p>
                                                </div>
                                            </label>

                                            <label
                                                className={`flex items-center space-x-3 p-3 rounded-lg ${
                                                    formData.isYouthLed
                                                        ? "bg-green-50 border border-green-100"
                                                        : "hover:bg-gray-100"
                                                } transition-colors cursor-pointer`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="isYouthLed"
                                                    checked={
                                                        formData.isYouthLed
                                                    }
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                                                />
                                                <div>
                                                    <span className="text-gray-700 font-medium">
                                                        Youth-led Business
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Founders are 35 years or
                                                        below
                                                    </p>
                                                </div>
                                            </label>

                                            <label
                                                className={`flex items-center space-x-3 p-3 rounded-lg ${
                                                    formData.isRuralBased
                                                        ? "bg-green-50 border border-green-100"
                                                        : "hover:bg-gray-100"
                                                } transition-colors cursor-pointer`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="isRuralBased"
                                                    checked={
                                                        formData.isRuralBased
                                                    }
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                                                />
                                                <div>
                                                    <span className="text-gray-700 font-medium">
                                                        Rural-based Operation
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Business operates in
                                                        rural/underserved areas
                                                    </p>
                                                </div>
                                            </label>

                                            <label
                                                className={`flex items-center space-x-3 p-3 rounded-lg ${
                                                    formData.usesLocalSourcing
                                                        ? "bg-green-50 border border-green-100"
                                                        : "hover:bg-gray-100"
                                                } transition-colors cursor-pointer`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="usesLocalSourcing"
                                                    checked={
                                                        formData.usesLocalSourcing
                                                    }
                                                    onChange={handleChange}
                                                    className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                                                />
                                                <div>
                                                    <span className="text-gray-700 font-medium">
                                                        Local Sourcing
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Uses locally sourced
                                                        materials or labor
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-green-50 rounded-xl p-5 border border-green-100 mb-6">
                                        <div className="flex items-start">
                                            <div className="bg-green-100 rounded-lg p-2 mr-4">
                                                <Upload className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                {/* <h3 className="text-lg font-medium text-gray-800 mb-1">
                                                  Complete Your Application
                                              </h3> */}
                                                <p className="text-gray-600">
                                                    Upload the required
                                                    documents to finalize your
                                                    grant application.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Pitch Deck Upload */}
                                        <div className="border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition-colors text-center">
                                            <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                                Upload Pitch Deck{" "}
                                                <span className="text-green-500">
                                                    *
                                                </span>
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                PDF, PPT or PPTX (Max 10MB)
                                            </p>
                                            <input
                                                type="file"
                                                id="pitchDeck"
                                                accept=".pdf,.ppt,.pptx"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "pitchDeck"
                                                    )
                                                }
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="pitchDeck"
                                                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-5 py-2 rounded-lg transition-colors inline-flex items-center shadow-sm cursor-pointer"
                                            >
                                                <span>
                                                    {formData.documents
                                                        .pitchDeck
                                                        ? formData.documents
                                                              .pitchDeck.name
                                                        : "Select File"}
                                                </span>
                                            </label>
                                            {formData.documents.pitchDeck && (
                                                <p className="mt-2 text-sm text-green-600">
                                                    File selected:{" "}
                                                    {
                                                        formData.documents
                                                            .pitchDeck.name
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Business Plan Upload */}
                                            <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors text-center">
                                                <h3 className="text-lg font-medium text-gray-800 mb-2">
                                                    Business Plan{" "}
                                                    <span className="text-green-500">
                                                        *
                                                    </span>
                                                </h3>
                                                <p className="text-gray-500 mb-4">
                                                    PDF, DOC or DOCX (Max 5MB)
                                                </p>
                                                <input
                                                    type="file"
                                                    id="businessPlan"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            "businessPlan"
                                                        )
                                                    }
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="businessPlan"
                                                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center shadow-sm cursor-pointer"
                                                >
                                                    <span>
                                                        {formData.documents
                                                            .businessPlan
                                                            ? formData.documents
                                                                  .businessPlan
                                                                  .name
                                                            : "Select File"}
                                                    </span>
                                                </label>
                                                {formData.documents
                                                    .businessPlan && (
                                                    <p className="mt-2 text-sm text-green-600">
                                                        File selected:{" "}
                                                        {
                                                            formData.documents
                                                                .businessPlan
                                                                .name
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {/* Pitch Video Upload */}
                                            <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors text-center">
                                                <h3 className="text-lg font-medium text-gray-800 mb-2">
                                                    Pitch Video
                                                </h3>
                                                <p className="text-gray-500 mb-4">
                                                    MP4 or YouTube/Vimeo link
                                                </p>
                                                <input
                                                    type="file"
                                                    id="pitchVideo"
                                                    accept=".mp4,video/*"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            "pitchVideo"
                                                        )
                                                    }
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="pitchVideo"
                                                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center shadow-sm cursor-pointer"
                                                >
                                                    <span>
                                                        {formData.documents
                                                            .pitchVideo
                                                            ? formData.documents
                                                                  .pitchVideo
                                                                  .name
                                                            : "Upload or Link"}
                                                    </span>
                                                </label>
                                                {formData.documents
                                                    .pitchVideo && (
                                                    <p className="mt-2 text-sm text-green-600">
                                                        File selected:{" "}
                                                        {
                                                            formData.documents
                                                                .pitchVideo.name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {step === 4 && (
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
                                                Define clear and verifiable
                                                milestones to demonstrate how
                                                you'll strategically utilize the
                                                grant funding across your
                                                project timeline. This helps
                                                investors track your progress
                                                and build trust in your
                                                execution plan.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Milestones List */}
                                    <div className="space-y-4">
                                        {formData.milestones.map(
                                            (
                                                milestone,
                                                index // Changed from milestones to formData.milestones
                                            ) => (
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
                                                                Milestone{" "}
                                                                {index + 1}
                                                            </h4>
                                                        </div>
                                                        {formData.milestones
                                                            .length > 1 && ( // Changed from milestones to formData.milestones
                                                            <button
                                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                                onClick={() =>
                                                                    removeMilestone(
                                                                        index
                                                                    )
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
                                                                value={
                                                                    milestone.title
                                                                }
                                                                onChange={(e) =>
                                                                    updateMilestone(
                                                                        index,
                                                                        "title",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <label
                                                                htmlFor={`amount-${index}`}
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                            >
                                                                Funding Amount
                                                                ($)*
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
                                                                    value={
                                                                        milestone.amount
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateMilestone(
                                                                            index,
                                                                            "amount",
                                                                            e
                                                                                .target
                                                                                .value
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
                                                            value={
                                                                milestone.description
                                                            }
                                                            onChange={(e) =>
                                                                updateMilestone(
                                                                    index,
                                                                    "description",
                                                                    e.target
                                                                        .value
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
                                                                Target
                                                                Completion Date*
                                                            </label>
                                                            <input
                                                                type="date"
                                                                id={`date-${index}`}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                                                value={
                                                                    milestone.date
                                                                }
                                                                onChange={(e) =>
                                                                    updateMilestone(
                                                                        index,
                                                                        "date",
                                                                        e.target
                                                                            .value
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
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateMilestone(
                                                                            index,
                                                                            "requiresVerification",
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={`verification-${index}`}
                                                                    className="ml-2 block text-sm text-gray-700"
                                                                >
                                                                    Requires
                                                                    third-party
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
                                                                milestone
                                                                    .deliverables
                                                                    .length > 0
                                                                    ? "border border-gray-200 rounded-lg bg-gray-50"
                                                                    : "border-2 border-dashed border-gray-300 rounded-lg bg-white"
                                                            }`}
                                                        >
                                                            <div className="px-4 py-5 sm:p-6">
                                                                <div className="space-y-3">
                                                                    {/* Empty state */}
                                                                    {milestone
                                                                        .deliverables
                                                                        .length ===
                                                                    0 ? (
                                                                        <div className="text-center">
                                                                            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                                                                                <svg
                                                                                    className="w-8 h-8"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                    xmlns="http://www.w3.org/2000/svg"
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
                                                                                        Click
                                                                                        to
                                                                                        upload
                                                                                    </span>
                                                                                    <input
                                                                                        id={`file-upload-${index}`}
                                                                                        name={`file-upload-${index}`}
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
                                                                                                // Only take the first file instead of all files
                                                                                                const newFile =
                                                                                                    e
                                                                                                        .target
                                                                                                        .files[0];
                                                                                                updateMilestone(
                                                                                                    index,
                                                                                                    "deliverables",
                                                                                                    [
                                                                                                        newFile,
                                                                                                    ] // Wrap in array if your system expects an array
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </label>
                                                                                <p className="pl-1">
                                                                                    or
                                                                                    drag
                                                                                    and
                                                                                    drop
                                                                                </p>
                                                                            </div>
                                                                            <p className="mt-1 text-xs text-gray-500">
                                                                                PDF,
                                                                                DOC,
                                                                                XLS
                                                                                up
                                                                                to
                                                                                10MB
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        // Files list
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
                                                                                                    const updatedDeliverables =
                                                                                                        milestone.deliverables.filter(
                                                                                                            (
                                                                                                                _,
                                                                                                                i
                                                                                                            ) =>
                                                                                                                i !==
                                                                                                                fileIndex
                                                                                                        );
                                                                                                    updateMilestone(
                                                                                                        index,
                                                                                                        "deliverables",
                                                                                                        updatedDeliverables
                                                                                                    );
                                                                                                }}
                                                                                                className="ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                                                                                aria-label="Remove file"
                                                                                            >
                                                                                                <X className="h-5 w-5" />
                                                                                            </button>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>

                                                                            {/* Commented out the "Add More Files" option - single file upload only */}
                                                                            {/*
  <div className="flex">
    <label
      htmlFor={`file-upload-${index}`}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
    >
      <Plus className="-ml-0.5 mr-2 h-4 w-4" />
      Add More Files
      <input
        id={`file-upload-${index}`}
        type="file"
        className="sr-only"
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const newDeliverables = [
              ...milestone.deliverables,
              ...newFiles,
            ];
            updateMilestone(index, "deliverables", newDeliverables);
          }
        }}
      />
    </label>
  </div>
  */}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            onClick={addMilestone}
                                        >
                                            <svg
                                                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
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
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
                            {step > 1 ? (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm border border-gray-200 transition-all duration-200"
                                >
                                    Back
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-green-200 flex items-center font-medium"
                                >
                                    Next Step{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting || submissionSuccess}
                                    className={`bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg transition-all shadow-lg shadow-green-200 flex items-center font-medium ${
                                        isSubmitting
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    } ${
                                        submissionSuccess
                                            ? "from-green-600 to-green-600 hover:from-green-600 hover:to-green-600"
                                            : ""
                                    }`}
                                >
                                    {isSubmitting ? (
                                        "Submitting..."
                                    ) : submissionSuccess ? (
                                        <>
                                            Submitted!{" "}
                                            <Check className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            Submit Application{" "}
                                            <Check className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:block w-80 bg-gray-50 border-l border-gray-100 p-6 overflow-y-auto">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-1">
                                Match Score Preview
                            </h3>
                            <p className="text-sm text-gray-500">
                                Real-time compatibility analysis
                            </p>
                        </div>

                        {matchPreview ? (
                            <div className="flex flex-col items-center">
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-gray-100">
                                        <div
                                            className={`w-24 h-24 rounded-full ${getMatchScoreColor()} flex items-center justify-center text-white text-2xl font-bold`}
                                        >
                                            {matchPreview.score}%
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute -right-2 -top-2 rounded-full p-2 ${
                                            matchPreview.matchLevel ===
                                            "Ideal Match"
                                                ? "bg-green-500"
                                                : matchPreview.matchLevel ===
                                                  "Strong Match"
                                                ? "bg-yellow-500"
                                                : "bg-red-400"
                                        } text-white shadow`}
                                    >
                                        {matchPreview.matchLevel ===
                                        "Ideal Match" ? (
                                            <Check className="w-4 h-4" />
                                        ) : matchPreview.matchLevel ===
                                          "Strong Match" ? (
                                            <AlertTriangle className="w-4 h-4" />
                                        ) : (
                                            <X className="w-4 h-4" />
                                        )}
                                    </div>
                                </div>

                                <div
                                    className={`text-center mb-6 py-2 px-4 rounded-full ${
                                        matchPreview.matchLevel ===
                                        "Ideal Match"
                                            ? "bg-green-100 text-green-800"
                                            : matchPreview.matchLevel ===
                                              "Strong Match"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    <span className="font-medium">
                                        {matchPreview.matchLevel}
                                    </span>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Score Breakdown
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">
                                                    Basic Information
                                                </span>
                                                <span className="font-medium">
                                                    60%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">
                                                    Impact Areas
                                                </span>
                                                <span className="font-medium">
                                                    {formData.impactAreas
                                                        .length > 0
                                                        ? "5%"
                                                        : "0%"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">
                                                    Bonus
                                                </span>
                                                <span className="font-medium">
                                                    {(formData.isGenderLed
                                                        ? 5
                                                        : 0) +
                                                        (formData.isYouthLed
                                                            ? 5
                                                            : 0) +
                                                        (formData.isRuralBased
                                                            ? 5
                                                            : 0) +
                                                        (formData.usesLocalSourcing
                                                            ? 5
                                                            : 0)}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Potential Matches
                                        </h4>
                                        {matchPreview.score >= 60 ? (
                                            <div className="space-y-3">
                                                <div className="flex items-start">
                                                    <div className="bg-green-100 rounded p-1 mr-2">
                                                        <Zap className="w-3 h-3 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            Green Growth Fund
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            $25k-75k grant
                                                        </p>
                                                    </div>
                                                </div>
                                                {matchPreview.score >= 80 && (
                                                    <div className="flex items-start">
                                                        <div className="bg-green-100 rounded p-1 mr-2">
                                                            <Globe className="w-3 h-3 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Climate Tech
                                                                Initiative
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                $50k-100k
                                                                equity-free
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Complete more fields to see
                                                potential matches
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-sm font-medium text-gray-700">
                                                Upcoming Deadlines
                                            </h4>
                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                2 matches
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start">
                                                <div className="bg-gray-100 rounded p-1 mr-2">
                                                    <Calendar className="w-3 h-3 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        May 15, 2025
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Clean Energy Fund
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="bg-gray-100 rounded p-1 mr-2">
                                                    <Calendar className="w-3 h-3 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        June 30, 2025
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        AgTech Innovation Grant
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500">
                                    Complete required fields to see your match
                                    score
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
