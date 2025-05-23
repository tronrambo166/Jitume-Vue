import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    CalendarDays,
    FileText,
    DollarSign,
    Award,
    ChevronLeft,
    Clock,
    CheckCircle,
    Target,
    Star,
    Users,
    MapPin,
    Building,
} from "lucide-react";
import axiosClient from "../../../axiosClient";
import { useStateContext } from "../../../contexts/contextProvider";
import GrantApplicationModal from "../Utils/Modals/Newgrant"; // Import the modal component

export default function GrantDetailsDashboard() {
    const { id } = useParams();
    const [grant, setGrant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [newGrant, setNewGrant] = useState({});
    const { user, token, setUser, setToken } = useStateContext();

    useEffect(() => {
        const fetchGrantDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosClient.get("/grant/grants");
                console.log("API Response:", response);

                const rawData = Array.isArray(response.data?.grants)
                    ? response.data.grants
                    : [];

                // Find the specific grant by ID
                const selectedGrant = rawData.find(
                    (grant) => String(grant.id) === String(id)
                );

                if (!selectedGrant) {
                    throw new Error(`Grant with ID "${id}" not found`);
                }

                setGrant(selectedGrant);
                console.log("Selected Grant:", selectedGrant);
            } catch (err) {
                console.error("Failed to fetch grant details:", err);
                const errorMessage =
                    err.response?.status === 401
                        ? "Session expired. Please login again."
                        : err.message ||
                          "Failed to load grant details. Please try again later.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchGrantDetails();
    }, [id]);

    const parseJsonString = (jsonString) => {
        if (!jsonString) return [];
        try {
            if (typeof jsonString === "string" && jsonString.startsWith("[")) {
                return JSON.parse(jsonString);
            }
            return Array.isArray(jsonString) ? jsonString : [jsonString];
        } catch (e) {
            return typeof jsonString === "string" ? [jsonString] : [];
        }
    };

    const createNewGrant = () => {
        // This function would handle creating a new grant if needed
        console.log("Creating new grant...", newGrant);
    };

    const handleApplyClick = () => {
        setShowApplicationModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (e) {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        if (!amount || amount === "N/A") return "N/A";
        const numAmount = parseFloat(amount.toString().replace(/,/g, ""));
        return isNaN(numAmount)
            ? `$${amount}`
            : `$${numAmount.toLocaleString()}`;
    };

    const daysRemaining = () => {
        if (!grant?.application_deadline) return 0;
        const deadline = new Date(grant.application_deadline);
        const today = new Date();
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const deadlineStatus = () => {
        const days = daysRemaining();
        if (days === 0)
            return { text: "Deadline today", color: "text-yellow-500" };
        if (days < 0) return { text: "Deadline passed", color: "text-red-500" };
        if (days <= 7)
            return { text: `${days} days left`, color: "text-yellow-500" };
        return { text: `${days} days left`, color: "text-green-500" };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-64 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-200 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
                    <p className="text-gray-500">Loading grant details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center w-full h-64 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col items-center space-y-2 text-red-500">
                    <p>{error}</p>
                    <button className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!grant) {
        return (
            <div className="flex items-center justify-center w-full h-64 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">
                    No grant details found for ID: {id}
                </p>
            </div>
        );
    }

    // Parse JSON strings from backend
    const requiredDocuments = parseJsonString(grant.required_documents);
    const startupStages = parseJsonString(grant.startup_stage_focus);
    const regions = grant.regions || [];
    const sectors = grant.sectors || [];

    return (
        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-green-600 to-green-500 p-6">
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-4 left-4 flex items-center text-white hover:bg-white/10 p-2 rounded-full transition"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="ml-1 text-sm">Back</span>
                </button>

                <div className="mt-6">
                    <h1 className="text-2xl font-bold text-white">
                        {grant.grant_title}
                    </h1>
                    <div className="flex items-center mt-2 text-white/90">
                        <Award className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                            {grant.organization || "Grant Provider"}
                        </span>
                    </div>
                    {grant.status && (
                        <div className="flex items-center mt-1 text-white/80">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                                Status: {grant.status}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                        <DollarSign className="w-4 h-4 text-white" />
                        <span className="ml-1 text-sm text-white">
                            {formatCurrency(grant.total_grant_amount)}
                        </span>
                    </div>

                    <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="ml-1 text-sm text-white">
                            {formatDate(grant.application_deadline)}
                        </span>
                    </div>

                    <div
                        className={`flex items-center bg-white/20 rounded-full px-3 py-1`}
                    >
                        <span className="text-sm text-white">
                            {deadlineStatus().text}
                        </span>
                    </div>

                    {grant.pitch_count && (
                        <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                            <Users className="w-4 h-4 text-white" />
                            <span className="ml-1 text-sm text-white">
                                {grant.pitch_count} applications
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            FUNDING DETAILS
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs text-gray-500">
                                    Total Grant Amount
                                </div>
                                <div className="text-lg font-semibold text-green-600">
                                    {formatCurrency(grant.total_grant_amount)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Funding Per Business
                                </div>
                                <div className="text-lg font-semibold text-green-600">
                                    {formatCurrency(grant.funding_per_business)}
                                </div>
                            </div>
                            {grant.available_amount && (
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Available Amount
                                    </div>
                                    <div className="text-base font-semibold text-blue-600">
                                        {formatCurrency(grant.available_amount)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            APPLICATION TIMELINE
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Deadline
                                    </div>
                                    <div className="text-base font-medium">
                                        {formatDate(grant.application_deadline)}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`text-sm font-medium ${
                                    deadlineStatus().color
                                }`}
                            >
                                {deadlineStatus().text}
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">
                                    Created
                                </div>
                                <div className="text-sm">
                                    {formatDate(grant.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                            GRANT INFO
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs text-gray-500">
                                    Grant ID
                                </div>
                                <div className="text-base font-medium">
                                    #{grant.id}
                                </div>
                            </div>
                            {grant.user_id && (
                                <div>
                                    <div className="text-xs text-gray-500">
                                        Created by User
                                    </div>
                                    <div className="text-base font-medium">
                                        #{grant.user_id}
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="text-xs text-gray-500">
                                    Visibility
                                </div>
                                <div className="text-base font-medium">
                                    {grant.visible ? "Public" : "Private"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grant Focus & Stages */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                        FOCUS AREAS & STARTUP STAGES
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Grant Focus
                            </h4>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {grant.grant_focus}
                            </span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Startup Stage Focus
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {startupStages.map((stage, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                    >
                                        {stage}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                {(sectors.length > 0 ||
                    grant.techLevel ||
                    regions.length > 0) && (
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                            ADDITIONAL DETAILS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {sectors.map((sector, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                >
                                    {sector}
                                </span>
                            ))}
                            {grant.techLevel && (
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                    Tech Level: {grant.techLevel}
                                </span>
                            )}
                            {regions.map((region, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                >
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {region}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Criteria & Requirements */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                        ELIGIBILITY & REQUIREMENTS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Eligibility Criteria
                            </h4>
                            <p className="text-sm text-gray-600">
                                {grant.eligibility_criteria || "Not specified"}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Required Documents
                            </h4>
                            {requiredDocuments.length > 0 ? (
                                <div className="space-y-1">
                                    {requiredDocuments.map((doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <FileText className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-gray-600">
                                                {doc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    None specified
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Impact & Evaluation */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                        IMPACT & EVALUATION
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Impact Objectives
                            </h4>
                            <p className="text-sm text-gray-600">
                                {grant.impact_objectives || "Not specified"}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Evaluation Criteria
                            </h4>
                            <p className="text-sm text-gray-600">
                                {grant.evaluation_criteria || "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Documentation */}
                {grant.grant_brief_pdf && (
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">
                            DOCUMENTATION
                        </h3>
                        <a
                            href={grant.grant_brief_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                        >
                            <FileText className="w-5 h-5" />
                            <span>Download Grant Brief PDF</span>
                        </a>
                    </div>
                )}

                {/* Action Button */}
                {!user?.investor && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleApplyClick}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <span>Apply for Grant</span>
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                )}

                {/* Grant Application Modal */}
                {showApplicationModal && (
                    <GrantApplicationModal
                        grantId={grant.id}
                        newGrant={newGrant}
                        setNewGrant={setNewGrant}
                        setShowCreateModal={setShowApplicationModal}
                        createNewGrant={createNewGrant}
                        onClose={() => {
                            setShowApplicationModal(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
