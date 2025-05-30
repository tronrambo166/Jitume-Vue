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
import _ from "lodash";

import { ToastContainer } from "react-toastify";
export default function GrantApplicationModal({ onClose, grantId }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [businessId, setBusinessId] = useState(null);
    const [businessOptions, setBusinessOptions] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [matchScore, setMatchScore] = useState(null);
    const [scoreBreakdown, setScoreBreakdown] = useState(null);

    const [matchPreview, setMatchPreview] = useState(null);
    const [formData, setFormData] = useState({
        startupName: "",
        business_id: businessId,
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
        bonusPoints: "", // Add this array to track selected bonus points
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

    // console.log("businessId", businessId);
    // console.log("formData", grantId);

    // Run check whenever formData changes
    // useEffect(() => {
    //   checkIfComplete();
    // }, [formData]);

    const modalRef = useRef();
    // console.log("grantId", grantId);
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
        const selectedBusinessId = parseInt(e.target.value, 10);
        setBusinessId(selectedBusinessId);
        setFormData((prev) => ({
            ...prev,
            business_id: selectedBusinessId,
        }));
    };
    // Form handlers

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
                business_id: businessId,
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
                gender_led: formData.isGenderLed,
                youth_led: formData.isYouthLed,
                rural_based: formData.isRuralBased,
                uses_local_sourcing: formData.usesLocalSourcing,
                bonus_points: formData.bonusPoints || "", // Use the string directly
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
                        // Removed the console.log that was trying to access response
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
            console.log("Attempting to submit to backend...", formDataToSend);

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
            // console.log("Response data:", response);

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

    // useEffect(() => {
    //     let score = 0;
    //     if (formData.sector && formData.location && formData.stage) {
    //         score += 60;
    //         if (formData.revenue) score += 5;
    //         if (formData.teamExperience) score += 5;
    //         if (formData.traction) score += 5;
    //         if (formData.impactAreas.length > 0) score += 5;
    //         if (formData.isGenderLed) score += 5;
    //         if (formData.isYouthLed) score += 5;
    //         if (formData.isRuralBased) score += 5;
    //         if (formData.usesLocalSourcing) score += 5;
    //     }
    //     score = Math.min(score, 100);
    //     let matchLevel = "Needs Revision";
    //     if (score >= 80) matchLevel = "Ideal Match";
    //     else if (score >= 60) matchLevel = "Strong Match";
    //     setMatchPreview({ score, matchLevel });
    // }, [formData]);

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

        // if (step === 1) {
        //     const requiredFields = [
        //         "startupName",
        //         "contactPerson",
        //         "contactEmail",
        //         "sector",
        //         "location",
        //     ];
        //     canProceed = requiredFields.every(
        //         (field) => formData[field]?.trim() !== ""
        //     );
        //     if (!canProceed) {
        //         toast(
        //             <div className="flex items-center gap-2">
        //                 <AlertTriangle className="h-4 w-4 text-amber-500" />
        //                 <span>Complete all fields to continue</span>
        //             </div>,
        //             {
        //                 position: "top-center",
        //                 autoClose: 1000,
        //                 hideProgressBar: true,
        //                 closeButton: false,
        //                 className:
        //                     "!bg-gray-700 !text-gray-200 !shadow-sm !rounded-lg !border !border-gray-100 !px-3 !py-2",
        //             }
        //         );
        //         return;
        //     }
        // } else if (step === 2) {
        //     const requiredFields = [
        //         "stage",
        //         "revenue",
        //         "teamExperience",
        //         "traction",
        //     ];
        //     canProceed = requiredFields.every(
        //         (field) => formData[field]?.trim() !== ""
        //     );
        //     if (!canProceed) {
        //         toast.warning(
        //             <ValidationToast message="Please fill all required fields in Step 2 before proceeding" />,
        //             {
        //                 position: "top-center",
        //                 autoClose: 5000,
        //                 hideProgressBar: false,
        //                 closeOnClick: true,
        //                 pauseOnHover: true,
        //                 draggable: true,
        //                 progress: undefined,
        //                 className:
        //                     "!bg-white !text-gray-800 !shadow-lg !border !border-yellow-200",
        //             }
        //         );
        //         return;
        //     }
        // } else if (step === 3) {
        //     canProceed = formData.impactAreas?.length > 0;
        //     if (!canProceed) {
        //         toast.warning(
        //             <ValidationToast message="Please select at least one impact area before proceeding" />,
        //             {
        //                 position: "top-center",
        //                 autoClose: 5000,
        //                 hideProgressBar: false,
        //                 closeOnClick: true,
        //                 pauseOnHover: true,
        //                 draggable: true,
        //                 progress: undefined,
        //                 className:
        //                     "!bg-white !text-gray-800 !shadow-lg !border !border-yellow-200",
        //             }
        //         );
        //         return;
        //     }
        // } else if (step === 4) {
        //     // Optional: Add step 4 validation here
        //     // Example:
        //     // canProceed = formData.confirmation === true;
        // }

        if (canProceed) {
            setStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
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

    const getStepColor = (currentStep) =>
        step >= currentStep ? "bg-green-500" : "bg-gray-200";
    const getMatchScoreColor = () => {
        if (!matchPreview) return "bg-gray-200";
        if (matchPreview.score >= 80) return "bg-green-500";
        if (matchPreview.score >= 60) return "bg-yellow-500";
        return "bg-red-400";
    };

    // Handle file upload

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

    // const updateMilestone = async (
    //     index,
    //     field,
    //     value,
    //     isFileUpload = false
    // ) => {
    //     const updatedMilestones = [...formData.milestones];

    //     if (isFileUpload) {
    //         updatedMilestones[index].deliverables = [value];
    //     } else {
    //         updatedMilestones[index][field] = value;
    //     }

    //     const updatedFormData = {
    //         ...formData,
    //         milestones: updatedMilestones,
    //     };

    //     setFormData(updatedFormData);

    //     if (isFileUpload) {
    //         await sendFormDataToAPI(updatedFormData);
    //     }
    // };

    // At top of component
    // State to track user activity
    const [isUserActive, setIsUserActive] = useState(false);
    const userActivityTimeoutRef = useRef(null);

    // Enhanced debounced function with longer delay
    const debouncedSendFormData = useRef(
        _.debounce(async (formData) => {
            await sendFormDataToAPI(formData);
            setIsUserActive(false);
        }, 1500) // Increased to 1.5 seconds
    ).current;

    // Function to handle user activity detection
    const handleUserActivity = (updatedFormData) => {
        setIsUserActive(true);

        // Clear existing timeout
        if (userActivityTimeoutRef.current) {
            clearTimeout(userActivityTimeoutRef.current);
        }

        // Set new timeout for 2 seconds of inactivity
        userActivityTimeoutRef.current = setTimeout(() => {
            if (hasDeliverableFile(updatedFormData)) {
                debouncedSendFormData(updatedFormData);
            }
        }, 2000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const isCheckbox = type === "checkbox";
        const newValue = isCheckbox ? checked : value;

        // Clone existing form data
        let updatedFormData = {
            ...formData,
            [name]: newValue,
        };

        // Bonus fields mapping
        const bonusFieldMappings = {
            isGenderLed: "gender_led",
            isYouthLed: "youth_led",
            isRuralBased: "rural_based",
            usesLocalSourcing: "local_sourcing",
        };

        if (Object.keys(bonusFieldMappings).includes(name)) {
            const bonusKey = bonusFieldMappings[name];
            let updatedBonusPoints = checked
                ? [...new Set([...formData.bonusPoints.split(","), bonusKey])]
                : formData.bonusPoints
                      .split(",")
                      .filter((item) => item !== bonusKey);

            // Re-join into string
            updatedFormData.bonusPoints = updatedBonusPoints.join(",");
        }

        setFormData(updatedFormData);

        if (hasDeliverableFile(updatedFormData)) {
            handleUserActivity(updatedFormData);
        }
    };

    const handleImpactAreaChange = (area) => {
        const updatedFormData = {
            ...formData,
            impactAreas: formData.impactAreas.includes(area)
                ? formData.impactAreas.filter((a) => a !== area)
                : [...formData.impactAreas, area],
        };

        setFormData(updatedFormData);

        // Only track activity if deliverable file has been uploaded
        if (hasDeliverableFile(updatedFormData)) {
            handleUserActivity(updatedFormData);
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const updatedFormData = {
                ...formData,
                documents: {
                    ...formData.documents,
                    [field]: file,
                },
            };

            setFormData(updatedFormData);

            // For file uploads, trigger immediately (no waiting)
            if (hasDeliverableFile(updatedFormData)) {
                debouncedSendFormData(updatedFormData);
            }
        }
    };

    // Enhanced focus/blur detection for inputs
    const handleInputFocus = () => {
        // Clear any pending auto-generation when user focuses on input
        if (userActivityTimeoutRef.current) {
            clearTimeout(userActivityTimeoutRef.current);
        }
        debouncedSendFormData.cancel();
    };

    const handleInputBlur = (updatedFormData) => {
        // When user leaves an input, wait a bit then check if they're done
        if (hasDeliverableFile(updatedFormData)) {
            setTimeout(() => {
                if (
                    !document.activeElement ||
                    !document.activeElement.matches("input, select, textarea")
                ) {
                    // User is not focused on any form element, trigger generation
                    debouncedSendFormData(updatedFormData);
                }
            }, 500);
        }
    };

    // Alternative approach: Detect when user stops typing
    const handleKeyUp = (e, updatedFormData) => {
        // Reset the timer on each keystroke
        if (userActivityTimeoutRef.current) {
            clearTimeout(userActivityTimeoutRef.current);
        }

        // Set new timer - will only fire if user stops typing for 2 seconds
        userActivityTimeoutRef.current = setTimeout(() => {
            if (hasDeliverableFile(updatedFormData)) {
                debouncedSendFormData(updatedFormData);
            }
        }, 2000);
    };

    // Helper function to check if any milestone has a deliverable file
    const hasDeliverableFile = (currentFormData = formData) => {
        return currentFormData.milestones.some(
            (milestone) =>
                milestone.deliverables && milestone.deliverables.length > 0
        );
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            debouncedSendFormData.cancel();
            if (userActivityTimeoutRef.current) {
                clearTimeout(userActivityTimeoutRef.current);
            }
        };
    }, []);

    // Updated updateMilestone function
    const updateMilestone = (index, field, value, isFileUpload = false) => {
        const updatedMilestones = [...formData.milestones];

        if (isFileUpload) {
            updatedMilestones[index].deliverables = [value];
        } else {
            updatedMilestones[index][field] = value;
        }

        const updatedFormData = {
            ...formData,
            milestones: updatedMilestones,
        };

        setFormData(updatedFormData);

        if (isFileUpload) {
            // For file uploads, trigger immediately
            debouncedSendFormData(updatedFormData);
        } else if (hasDeliverableFile(updatedFormData)) {
            // For other changes, use activity detection
            handleUserActivity(updatedFormData);
        }
    };

    // Your existing sendFormDataToAPI function remains unchanged
    const sendFormDataToAPI = async (currentFormData) => {
        const formDataToSend = new FormData();
        setIsUploading(true);
        setUploadProgress(0);

        // Append all fields
        formDataToSend.append("grant_id", grantId);
        formDataToSend.append("business_id", currentFormData.business_id);
        formDataToSend.append("startup_name", currentFormData.startupName);
        formDataToSend.append("contact_name", currentFormData.contactPerson);
        formDataToSend.append("contact_email", currentFormData.contactEmail);
        formDataToSend.append("sector", currentFormData.sector);
        formDataToSend.append(
            "headquarters_location",
            currentFormData.location
        );
        formDataToSend.append("stage", currentFormData.stage);
        formDataToSend.append(
            "revenue_last_12_months",
            currentFormData.revenue
        );
        formDataToSend.append(
            "team_experience_avg_years",
            currentFormData.teamExperience
        );
        formDataToSend.append("traction_kpis", currentFormData.traction);
        formDataToSend.append(
            "social_impact_areas",
            currentFormData.impactAreas.join(", ")
        );
        formDataToSend.append(
            "bonus_points",
            currentFormData.bonusPoints || "" // Use the string directly, fallback to empty string if undefined
        );

        // Handle documents
        if (currentFormData.documents.pitchDeck) {
            formDataToSend.append(
                "pitchDeck_file",
                currentFormData.documents.pitchDeck
            );
        } else {
            formDataToSend.append("pitchDeck_file", null);
        }

        if (currentFormData.documents.pitchVideo) {
            formDataToSend.append(
                "pitchVideo_file",
                currentFormData.documents.pitchVideo
            );
        } else {
            formDataToSend.append("pitchVideo_file", null);
        }

        if (currentFormData.documents.businessPlan) {
            formDataToSend.append(
                "businessPlan_file",
                currentFormData.documents.businessPlan
            );
        } else {
            formDataToSend.append("businessPlan_file", null);
        }

        // Handle milestones
        currentFormData.milestones.forEach((milestone, index) => {
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
                `milestones[${index}][duration]`,
                milestone.duration
            );

            if (milestone.deliverables && milestone.deliverables.length > 0) {
                formDataToSend.append(
                    `milestones[${index}][deliverable]`,
                    milestone.deliverables[0]
                );
            }
        });
        console.log("Data sent to API:", currentFormData);
        try {
            const response = await axiosClient.post(
                `grant/match-score/${grantId}`,
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            console.log("Score API Response:", response.data);
            setMatchScore(response.data.original.score);
            setScoreBreakdown(response.data.original.score_breakdown);
            return response.data;
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    /*
Usage in your JSX:
Add these props to your input elements:

<input
    onFocus={handleInputFocus}
    onBlur={() => handleInputBlur(formData)}
    onKeyUp={(e) => handleKeyUp(e, formData)}
    // ... other props
/>

<select
    onFocus={handleInputFocus}
    onBlur={() => handleInputBlur(formData)}
    // ... other props
/>
*/
    const getMatchLevel = (score) => {
        if (!score) return "Needs Revision";
        if (score >= 80) return "Ideal Match";
        if (score >= 60) return "Strong Match";
        return "Needs Revision";
    };

    const getMatchColor = (score) => {
        if (!score) return "bg-gray-200";
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-400";
    };

    const getMatchLevelColor = (score) => {
        if (!score) return "bg-gray-100 text-gray-800";
        if (score >= 80) return "bg-green-100 text-green-800";
        if (score >= 60) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    const getMatchIcon = (score) => {
        if (!score) return <AlertTriangle className="w-4 h-4" />;
        if (score >= 80) return <Check className="w-4 h-4" />;
        if (score >= 60) return <AlertTriangle className="w-4 h-4" />;
        return <X className="w-4 h-4" />;
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
                                                Business{" "}
                                                <span className="text-green-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="business"
                                                    value={formData.business}
                                                    onChange={(e) => {
                                                        handleBusinessChange(e); // Handle form data change
                                                    }}
                                                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                                    required
                                                >
                                                    <option value="">
                                                        Select Business
                                                    </option>

                                                    {businessOptions.map(
                                                        (business) => (
                                                            <option
                                                                key={
                                                                    business.id
                                                                }
                                                                value={
                                                                    business.id
                                                                }
                                                            >
                                                                {business.name}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                        className="h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500 mr-3"
                                                    />
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
                                        {/* <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bonus Points Eligibility
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="isYouthLed"
                                                        checked={
                                                            formData.isYouthLed
                                                        }
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        Youth-led business
                                                    </span>
                                                </label>

                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="isRuralBased"
                                                        checked={
                                                            formData.isRuralBased
                                                        }
                                                        onChange={handleChange}
                                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        Rural-based business
                                                    </span>
                                                </label>

                                            </div>
                                        </div> 
                                            */}
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
                                                                htmlFor={`duration-${index}`}
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                            >
                                                                Milestone
                                                                Duration*
                                                            </label>
                                                            <select
                                                                id={`duration-${index}`}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                                                value={
                                                                    milestone.duration ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    updateMilestone(
                                                                        index,
                                                                        "duration",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Select
                                                                    duration
                                                                </option>
                                                                <option value="1_week">
                                                                    1 Week
                                                                </option>
                                                                <option value="2_weeks">
                                                                    2 Weeks
                                                                </option>
                                                                <option value="1_month">
                                                                    1 Month
                                                                </option>
                                                                <option value="3_months">
                                                                    3 Months
                                                                </option>
                                                                <option value="6_months">
                                                                    6 Months
                                                                </option>
                                                                <option value="9_months">
                                                                    9 Months
                                                                </option>
                                                                <option value="12_months">
                                                                    12 Months
                                                                </option>
                                                                <option value="custom">
                                                                    Custom
                                                                    Duration
                                                                </option>
                                                            </select>

                                                            {milestone.duration ===
                                                                "custom" && (
                                                                <div className="mt-2 flex items-center">
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border mr-2"
                                                                        placeholder="Number"
                                                                        value={
                                                                            milestone.customDurationValue ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateMilestone(
                                                                                index,
                                                                                "customDurationValue",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                    <select
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                                                                        value={
                                                                            milestone.customDurationUnit ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateMilestone(
                                                                                index,
                                                                                "customDurationUnit",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            unit
                                                                        </option>
                                                                        <option value="days">
                                                                            Days
                                                                        </option>
                                                                        <option value="weeks">
                                                                            Weeks
                                                                        </option>
                                                                        <option value="months">
                                                                            Months
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-end">
                                                            {/* <div className="flex items-center h-10">
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
                                                            </div> */}
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
                                                                                                updateMilestone(
                                                                                                    index,
                                                                                                    "deliverables",
                                                                                                    e
                                                                                                        .target
                                                                                                        .files[0],
                                                                                                    true // This indicates it's a file upload
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
                                    disabled={
                                        isSubmitting ||
                                        submissionSuccess ||
                                        matchScore === null ||
                                        matchScore <= 50
                                    }
                                    className={`bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg transition-all shadow-lg shadow-green-200 flex items-center font-medium ${
                                        isSubmitting ||
                                        matchScore === null ||
                                        matchScore <= 50
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
                                    ) : matchScore === null ? (
                                        "Waiting for match score..."
                                    ) : matchScore <= 50 ? (
                                        `Match score too low (${matchScore}%)`
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

                    <div className="hidden lg:block w-80 bg-gradient-to-br from-blue-50 to-emerald-50 border-l border-emerald-100 p-6 overflow-y-auto">
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="h-5 w-5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-yellow-600">
                                    Match Score Analysis
                                </h3>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full">
                                    Powered by Tujitume AI
                                </span>
                            </div>
                        </div>

                        {isUploading ? (
                            <div className="flex flex-col items-center py-8">
                                <div className="relative mb-6 w-36 h-36">
                                    {/* Container with glass effect */}
                                    <div className="absolute inset-0 rounded-full border-4 border-emerald-100 bg-white bg-opacity-30 backdrop-blur-sm overflow-hidden">
                                        {/* Filling liquid effect */}
                                        <div
                                            className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-yellow-400 transition-all duration-1000 ease-in-out"
                                            style={{
                                                height: `${uploadProgress}%`,
                                                boxShadow:
                                                    "0 -5px 15px rgba(99, 102, 241, 0.5)",
                                                borderTopLeftRadius:
                                                    uploadProgress < 95
                                                        ? "100%"
                                                        : "0",
                                                borderTopRightRadius:
                                                    uploadProgress < 95
                                                        ? "100%"
                                                        : "0",
                                            }}
                                        >
                                            {/* Bubbles effect */}
                                            <div className="absolute inset-0 overflow-hidden">
                                                <div
                                                    className="bubble-sm"
                                                    style={{
                                                        left: "15%",
                                                        animationDelay: "0.5s",
                                                    }}
                                                ></div>
                                                <div
                                                    className="bubble-md"
                                                    style={{
                                                        left: "55%",
                                                        animationDelay: "1.2s",
                                                    }}
                                                ></div>
                                                <div
                                                    className="bubble-sm"
                                                    style={{
                                                        left: "80%",
                                                        animationDelay: "0.8s",
                                                    }}
                                                ></div>
                                                <div
                                                    className="bubble-lg"
                                                    style={{
                                                        left: "30%",
                                                        animationDelay: "1.7s",
                                                    }}
                                                ></div>
                                                <div
                                                    className="bubble-md"
                                                    style={{
                                                        left: "70%",
                                                        animationDelay: "2.1s",
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Shine effect on glass */}
                                        <div className="absolute top-0 left-0 w-full h-12 bg-white bg-opacity-20 transform -skew-y-12"></div>
                                    </div>

                                    {/* Percentage display */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-yellow-600">
                                                {uploadProgress}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-10 bg-emerald-200 rounded-full"></div>
                                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-10 bg-emerald-200 rounded-full"></div>
                                </div>

                                {/* Status messages that change with progress */}
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-bold text-emerald-700">
                                        {uploadProgress < 30
                                            ? "Initializing Quantum Analysis..."
                                            : uploadProgress < 60
                                            ? "Processing Smart Data Points..."
                                            : uploadProgress < 90
                                            ? "Calculating Match Parameters..."
                                            : "Finalizing Tujitume Analysis..."}
                                    </p>
                                    <p className="text-xs text-emerald-500 flex items-center justify-center gap-2">
                                        <span className="flex space-x-1">
                                            <span
                                                className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"
                                                style={{ animationDelay: "0s" }}
                                            ></span>
                                            <span
                                                className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            ></span>
                                            <span
                                                className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"
                                                style={{
                                                    animationDelay: "0.4s",
                                                }}
                                            ></span>
                                        </span>
                                        Jitume data verification in progress
                                    </p>
                                </div>

                                {/* Processing steps */}
                                <div className="w-full mt-6 space-y-2">
                                    <div className="flex items-center text-xs">
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                uploadProgress >= 25
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-200"
                                            }`}
                                        >
                                            {uploadProgress >= 25 && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div
                                            className={`h-0.5 flex-1 mx-1 ${
                                                uploadProgress >= 50
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-200"
                                            }`}
                                        ></div>
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                uploadProgress >= 50
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-200"
                                            }`}
                                        >
                                            {uploadProgress >= 50 && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div
                                            className={`h-0.5 flex-1 mx-1 ${
                                                uploadProgress >= 75
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-200"
                                            }`}
                                        ></div>
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                uploadProgress >= 75
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-200"
                                            }`}
                                        >
                                            {uploadProgress >= 75 && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div
                                            className={`h-0.5 flex-1 mx-1 ${
                                                uploadProgress >= 100
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-200"
                                            }`}
                                        ></div>
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                uploadProgress >= 100
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-200"
                                            }`}
                                        >
                                            {uploadProgress >= 100 && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-emerald-600">
                                        <span>Upload</span>
                                        <span>Analyze</span>
                                        <span>Match</span>
                                        <span>Score</span>
                                    </div>
                                </div>
                            </div>
                        ) : matchScore ? (
                            <div className="flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="w-36 h-36 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-yellow-50 border border-emerald-100">
                                        <div
                                            className={`w-28 h-28 rounded-xl ${getMatchColor(
                                                matchScore
                                            )} flex items-center justify-center text-white text-3xl font-bold backdrop-blur-sm bg-opacity-90 shadow-lg`}
                                        >
                                            {matchScore}%
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute -right-2 -top-2 rounded-full p-2 ${getMatchColor(
                                            matchScore
                                        )} text-white shadow-lg`}
                                    >
                                        {getMatchIcon(matchScore)}
                                    </div>
                                    <div className="absolute -left-1 -bottom-1 h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center rotate-12 shadow-lg">
                                        <span className="text-white text-xs font-bold">
                                            T
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`text-center mb-6 py-2 px-6 rounded-xl backdrop-blur-sm ${getMatchLevelColor(
                                        matchScore
                                    )} shadow-sm border border-emerald-100`}
                                >
                                    <span className="font-bold text-sm">
                                        {getMatchLevel(matchScore)}
                                    </span>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm backdrop-blur-sm">
                                        <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center">
                                            <span className="w-1 h-4 bg-emerald-500 rounded-sm mr-2"></span>
                                            Smart Score Breakdown
                                        </h4>
                                        <div className="space-y-3">
                                            {scoreBreakdown &&
                                                Object.entries(
                                                    scoreBreakdown
                                                ).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex justify-between items-center text-sm"
                                                    >
                                                        <span className="text-gray-600 capitalize font-medium">
                                                            {key}
                                                        </span>
                                                        <div className="flex items-center">
                                                            <div className="h-2 w-16 bg-emerald-100 rounded-full mr-2">
                                                                <div
                                                                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                                                                    style={{
                                                                        width: `${value}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-bold text-emerald-700">
                                                                {value}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-sm font-bold text-emerald-700 flex items-center">
                                                <span className="w-1 h-4 bg-emerald-500 rounded-sm mr-2"></span>
                                                Tujitume Matches
                                            </h4>
                                            <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-emerald-100 to-yellow-100 text-emerald-600 rounded-lg font-medium">
                                                Tujitume
                                            </span>
                                        </div>
                                        {matchScore >= 60 ? (
                                            <div className="space-y-3">
                                                <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                                    <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                        <Zap className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-emerald-700">
                                                            Green Growth Fund
                                                        </p>
                                                        <p className="text-xs text-emerald-500">
                                                            $25k-75k grant
                                                        </p>
                                                    </div>
                                                </div>
                                                {matchScore >= 80 && (
                                                    <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                                        <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                            <Globe className="w-3 h-3 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-emerald-700">
                                                                Climate Tech
                                                                Initiative
                                                            </p>
                                                            <p className="text-xs text-emerald-500">
                                                                $50k-100k
                                                                equity-free
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-emerald-500 p-2 rounded-lg bg-emerald-50 flex items-center">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                                                Complete more fields for
                                                Tujitume matches
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-sm font-bold text-emerald-700 flex items-center">
                                                <span className="w-1 h-4 bg-emerald-500 rounded-sm mr-2"></span>
                                                Smart Deadlines
                                            </h4>
                                            <span className="text-xs font-medium px-2 py-0.5 bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-600 rounded-lg">
                                                2 matches
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                                <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                    <Calendar className="w-3 h-3 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-700">
                                                        May 15, 2025
                                                    </p>
                                                    <p className="text-xs text-emerald-500">
                                                        Clean Energy Fund
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                                <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                    <Calendar className="w-3 h-3 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-700">
                                                        June 30, 2025
                                                    </p>
                                                    <p className="text-xs text-emerald-500">
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
                                <div className="w-20 h-20 mx-auto mb-4 relative">
                                    <div className="absolute inset-0 bg-emerald-100 rounded-xl rotate-6"></div>
                                    <div className="absolute inset-0 bg-emerald-200 rounded-xl -rotate-3"></div>
                                    <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center border border-emerald-100">
                                        <AlertTriangle className="w-8 h-8 text-emerald-400" />
                                    </div>
                                </div>
                                <p className="text-emerald-600 font-medium bg-emerald-50 py-2 px-4 rounded-lg inline-block">
                                    Complete fields for Tujitume analysis
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Add this CSS to your global styles */}
                </div>
            </div>
        </div>
    );
}
