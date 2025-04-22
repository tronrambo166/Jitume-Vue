import React, { useState } from "react";
import {
    TrendingUp,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Calendar,
    MapPin,
    Mail,
    Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosClient from "../../../axiosClient";

const PitchCard = ({ pitch, onStatusChange = () => {} }) => {
    const [expanded, setExpanded] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fundingOption, setFundingOption] = useState("milestone"); // 'milestone' or 'lump-sum'

    // Format numbers with appropriate suffix
    const formatNumber = (num) => {
        if (!num) return "0";
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num;
    };

    // Calculate metrics - with fallbacks for missing data
    const revenue = Number(pitch.revenue_last_12_months || 0);
    const irrValue = Number(pitch.irr_projection || 0);

    // Define action messages
    const actionMessages = {
        accept: "Accept this pitch to begin the investment process. This will notify the startup and schedule an initial meeting.",
        decline:
            "Decline this pitch. The startup will be notified that their pitch was not selected for further consideration.",
    };

    const handleAccept = async () => {
        try {
            setIsProcessing(true);
            const response = await axiosClient.get(
                `capital/accept/${pitch.id}`,
                { params: { funding_type: fundingOption } }
            );

            console.log("✅ ACCEPT RESPONSE:", {
                status: response.status,
                data: response.data,
                fundingOption,
            });

            toast.success(
                `Pitch accepted with ${
                    fundingOption === "milestone"
                        ? "milestone-based"
                        : "lump sum"
                } funding`
            );
            onStatusChange(pitch.id, "accepted");
        } catch (err) {
            console.error("❌ ACCEPT ERROR:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });

            toast.error(
                err.response?.data?.message || "Failed to accept pitch"
            );
        } finally {
            setIsProcessing(false);
            setShowAcceptModal(false);
        }
    };

    const handleReject = async () => {
        try {
            setIsProcessing(true);
            const response = await axiosClient.get(
                `capital/reject/${pitch.id}`
            );

            console.log("✅ REJECT RESPONSE:", {
                status: response.status,
                data: response.data,
            });

            toast.success("Pitch rejected successfully");
            onStatusChange(pitch.id, "rejected");
        } catch (err) {
            console.error("❌ REJECT ERROR:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });

            toast.error(
                err.response?.data?.message || "Failed to reject pitch"
            );
        } finally {
            setIsProcessing(false);
            setShowDeclineModal(false);
        }
    };

    const handleDecline = () => {
        setShowDeclineModal(true);
    };

    // Ensure all necessary data exists to avoid runtime errors
    const ensureArray = (value) => {
        if (!value) return [];
        return typeof value === "string"
            ? value.split(",")
            : Array.isArray(value)
            ? value
            : [];
    };

    const socialImpactAreas = ensureArray(pitch.social_impact_areas);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg">
            {/* Header section */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                {pitch.startup_name ||
                                    pitch.offer_title ||
                                    "Unnamed Pitch"}
                            </h2>
                            {/* Status badge */}
                            <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                    pitch.status === 1
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                                {pitch.status === 1 ? "Accepted" : "Pending"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {pitch.sector || pitch.sectors || "Unlisted Sector"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-end text-xs text-gray-500">
                        <div className="flex">
                            <Calendar size={14} className="mr-1" />
                            {new Date(
                                pitch.created_at || pitch.date || Date.now()
                            ).toLocaleDateString()}
                        </div>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                            {pitch.stage || "Unspecified Stage"}
                        </span>
                    </div>
                </div>

                {/* Key metrics row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            REVENUE (12MO)
                        </p>
                        <div className="flex items-center">
                            <span className="text-lg font-semibold text-gray-900">
                                ${formatNumber(revenue)}
                            </span>
                            {revenue > 500000 && (
                                <TrendingUp
                                    size={16}
                                    className="ml-2 text-green-500"
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            BURN RATE
                        </p>
                        <div className="flex items-center">
                            <span className="text-lg font-semibold text-gray-900">
                                ${formatNumber(Number(pitch.burn_rate || 0))}
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            IRR PROJECTION
                        </p>
                        <div className="flex items-center">
                            <span className="text-lg font-semibold text-gray-900">
                                {irrValue}%
                            </span>
                            {irrValue > 30 && (
                                <TrendingUp
                                    size={16}
                                    className="ml-2 text-green-500"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center text-gray-600">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        {pitch.contact_person_email || "No email provided"}
                    </div>
                    <div className="flex items-center text-gray-600">
                        <MapPin size={14} className="mr-2 text-gray-400" />
                        {pitch.headquarters_location ||
                            pitch.location ||
                            "Location not specified"}
                    </div>
                </div>

                {/* Action buttons - only show if status is pending (0) */}
                {pitch.status === 0 && (
                    <div className="flex space-x-3 my-2">
                        {/* Decline button */}
                        <button
                            onClick={handleDecline}
                            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center font-medium text-sm transition-colors duration-200"
                        >
                            <X size={16} className="mr-2 text-gray-500" />
                            Decline
                        </button>

                        {/* Accept button */}
                        <button
                            onClick={() => setShowAcceptModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center font-medium text-sm transition-colors duration-200"
                        >
                            <Check size={16} className="mr-2" />
                            Accept Pitch
                        </button>
                    </div>
                )}
            </div>

            {/* Expandable details section */}
            <div
                className={`bg-gray-50 px-6 ${
                    expanded ? "py-6" : "py-0"
                } transition-all duration-300 overflow-hidden`}
                style={{ maxHeight: expanded ? "500px" : "0px" }}
            >
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            CAC TO LTV RATIO
                        </p>
                        <p className="text-sm font-medium">
                            {pitch.cac_ltv || "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            TEAM EXPERIENCE
                        </p>
                        <p className="text-sm font-medium">
                            {pitch.team_experience_avg_years
                                ? `${pitch.team_experience_avg_years} years avg.`
                                : "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            EXIT STRATEGY
                        </p>
                        <p className="text-sm">
                            {pitch.exit_strategy || "Not specified"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            SOCIAL IMPACT AREAS
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {socialImpactAreas.length > 0 ? (
                                socialImpactAreas.map((area, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                    >
                                        {typeof area === "string"
                                            ? area.trim()
                                            : area}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm">None specified</span>
                            )}
                        </div>
                    </div>

                    {pitch.hasOwnProperty("pitch_summary") && (
                        <div className="col-span-2 mt-2">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                                PITCH SUMMARY
                            </p>
                            <p className="text-sm">{pitch.pitch_summary}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer with action buttons */}
            <div className="border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                <button
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    onClick={() => setExpanded(!expanded)}
                >
                    <span>{expanded ? "Show less" : "Show details"}</span>
                    {expanded ? (
                        <ChevronUp size={16} className="ml-1" />
                    ) : (
                        <ChevronDown size={16} className="ml-1" />
                    )}
                </button>
            </div>

            {/* Enhanced Accept Modal */}
            {showAcceptModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Accept Investment Proposal
                            </h3>
                            <button
                                onClick={() => setShowAcceptModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto p-6 flex-1">
                            <p className="text-gray-700 mb-6">
                                You're approving funding for{" "}
                                <strong className="text-green-600">
                                    {pitch.startup_name || "this startup"}
                                </strong>
                                . Please select your preferred disbursement
                                method:
                            </p>

                            <div className="space-y-4 mb-6">
                                {/* Milestone Option */}
                                <div
                                    className={`flex items-start p-4 border rounded-lg transition-colors cursor-pointer ${
                                        fundingOption === "milestone"
                                            ? "border-green-300 bg-green-50"
                                            : "border-gray-200 hover:border-green-300"
                                    }`}
                                    onClick={() =>
                                        setFundingOption("milestone")
                                    }
                                >
                                    <div className="flex items-center h-5 mt-0.5">
                                        <input
                                            id="milestone-option"
                                            name="funding-option"
                                            type="radio"
                                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                                            checked={
                                                fundingOption === "milestone"
                                            }
                                            onChange={() =>
                                                setFundingOption("milestone")
                                            }
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between items-start">
                                            <label
                                                htmlFor="milestone-option"
                                                className="block font-medium text-gray-900"
                                            >
                                                Milestone-Based Funding
                                            </label>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Recommended
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Funds are released in predefined
                                            stages as the startup achieves
                                            specific business milestones.
                                        </p>
                                        <div className="mt-2 bg-green-50 p-3 rounded-md">
                                            <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                                                Benefits
                                            </h4>
                                            <ul className="text-xs text-green-600 space-y-1 list-disc list-inside">
                                                <li>Reduces investment risk</li>
                                                <li>Ensures accountability</li>
                                                <li>
                                                    Aligns funding with progress
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Lump Sum Option */}
                                <div
                                    className={`flex items-start p-4 border rounded-lg transition-colors cursor-pointer ${
                                        fundingOption === "lump-sum"
                                            ? "border-blue-300 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300"
                                    }`}
                                    onClick={() => setFundingOption("lump-sum")}
                                >
                                    <div className="flex items-center h-5 mt-0.5">
                                        <input
                                            id="lump-sum-option"
                                            name="funding-option"
                                            type="radio"
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                            checked={
                                                fundingOption === "lump-sum"
                                            }
                                            onChange={() =>
                                                setFundingOption("lump-sum")
                                            }
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <label
                                            htmlFor="lump-sum-option"
                                            className="block font-medium text-gray-900"
                                        >
                                            Full Amount Disbursement
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Transfer the entire investment
                                            amount immediately upon acceptance.
                                        </p>
                                        <div className="mt-2 bg-blue-50 p-3 rounded-md">
                                            <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                                                Considerations
                                            </h4>
                                            <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                                                <li>
                                                    Immediate capital access
                                                </li>
                                                <li>Simpler administration</li>
                                                <li>
                                                    Shows strong trust in team
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                            <div className="flex space-x-3 justify-end">
                                <button
                                    onClick={() => setShowAcceptModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAccept}
                                    disabled={isProcessing}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center"
                                >
                                    {isProcessing ? (
                                        <Loader2
                                            className="animate-spin mr-2"
                                            size={18}
                                        />
                                    ) : null}
                                    Confirm Acceptance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Decline Modal */}
            {showDeclineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">
                            Confirm Decline
                        </h3>
                        <p className="mb-6">{actionMessages.decline}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeclineModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                            >
                                {isProcessing ? (
                                    <Loader2
                                        className="animate-spin mr-2"
                                        size={18}
                                    />
                                ) : null}
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PitchCard;
 