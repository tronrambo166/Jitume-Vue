import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronDown,
    Briefcase,
    MapPin,
    FileText,
    DollarSign,
    Mail,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Code,
    Loader,
    X,
    ExternalLink,
    ThumbsUp,
    ThumbsDown,
    Filter,
} from "lucide-react";
import axiosClient from "../../../axiosClient"; // Update with your actual path
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { useMessage } from "../../dashboard/Service/msgcontext"; // Adjust path as needed

const PitchesOutlet = ({ grantId }) => {
    const [pitches, setPitches] = useState([]);
    const [filteredPitches, setFilteredPitches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [htmlResponse, setHtmlResponse] = useState(null);
    const [openPitchId, setOpenPitchId] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedPitch, setSelectedPitch] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'pending'

    useEffect(() => {
        fetchPitches();
    }, [grantId, retryCount]);

    const handleContinueToPitchDeck = (pitchDeckUrl) => {
        window.open(pitchDeckUrl, "_blank");
    };

    useEffect(() => {
        // Filter pitches based on status filter
        if (statusFilter === "all") {
            setFilteredPitches(pitches);
        } else if (statusFilter === "active") {
            setFilteredPitches(pitches.filter((pitch) => pitch.status === 1));
        } else if (statusFilter === "pending") {
            setFilteredPitches(pitches.filter((pitch) => pitch.status === 0));
        }
    }, [statusFilter, pitches]);

    console.log("pitches", pitches);

    const fetchPitches = async () => {
        console.log(`[PitchesOutlet] Fetching pitches for grant ID:`, grantId);

        try {
            setIsLoading(true);
            setError(null);
            setHtmlResponse(null);

            const response = await axiosClient.get(`grant/pitches/${grantId}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            console.log("[PitchesOutlet] Response data:", response.data);

            // Handle empty response
            if (!response.data) {
                throw new Error("Empty response from server");
            }

            // Check if response.data has a pitches property, if so use that, otherwise use response.data directly
            const pitchesData = response.data.pitches || response.data;
            setPitches(Array.isArray(pitchesData) ? pitchesData : []);
        } catch (err) {
            console.error("[PitchesOutlet] Error fetching pitches:", err);

            if (err.response) {
                // Server responded with error status
                const errorData = err.response.data;

                // Check for HTML error response
                if (
                    typeof errorData === "string" &&
                    (errorData
                        .trim()
                        .toLowerCase()
                        .startsWith("<!doctype html>") ||
                        errorData.trim().toLowerCase().startsWith("<html"))
                ) {
                    setHtmlResponse(errorData.substring(0, 500));
                    setError(
                        "Server returned an HTML error page. Please try again later."
                    );
                } else {
                    setError(
                        err.response.data?.message ||
                            `Server error: ${err.response.status}`
                    );
                }
            } else if (err.request) {
                // Request was made but no response received
                setError("Network error - could not connect to server");
            } else {
                // Other errors
                setError(err.message || "An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };
    const handleConfirmAction = async () => {
        try {
            setIsLoading(true);
            console.groupCollapsed(
                `[Pitch Action] Starting ${modalAction} action for pitch ${selectedPitch.id}`
            );
            console.log("Action:", modalAction);
            console.log("Pitch ID:", selectedPitch.id);
            console.log("Current pitch data:", selectedPitch);

            // Use the correct API endpoint based on the action
            const endpoint =
                modalAction === "accept"
                    ? `grant/accept/${selectedPitch.id}`
                    : `grant/reject/${selectedPitch.id}`;

            console.log("Making GET request to:", endpoint);

            const response = await axiosClient.get(endpoint, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            console.groupCollapsed("Backend Response");
            console.log("Status:", response.status);
            console.log("Headers:", response.headers);
            console.log("Response Data:", response.data);
            console.groupEnd();

            // Update local state to reflect the change
            setPitches((prevPitches) =>
                prevPitches.map((pitch) =>
                    pitch.id === selectedPitch.id
                        ? {
                              ...pitch,
                              status: modalAction === "accept" ? 1 : 2,
                              // Include any additional data from the backend response
                              ...(response.data.updatedData || {}),
                              updatedAt: new Date().toISOString(), // Add timestamp
                          }
                        : pitch
                )
            );

            setShowConfirmModal(false);
            setSelectedPitch(null);

            if (response.data.message) {
                console.log("Success message:", response.data.message);
            }

            // Refresh data to ensure consistency
            console.log("Refreshing pitches data...");
            await fetchPitches();

            console.groupEnd();
        } catch (err) {
            console.groupCollapsed(
                `[Pitch Action Error] ${modalAction} action failed`
            );
            console.error("Error details:", err);

            if (err.response) {
                console.log("Error response status:", err.response.status);
                console.log("Error response data:", err.response.data);
                console.log("Error response headers:", err.response.headers);
            } else if (err.request) {
                console.log("No response received:", err.request);
            } else {
                console.log("Request setup error:", err.message);
            }

            const errorMessage = err.response?.data?.message
                ? `Failed to ${modalAction} pitch: ${err.response.data.message}`
                : `Failed to ${modalAction} pitch. Please try again.`;

            console.log("User error message:", errorMessage);
            setError(errorMessage);

            console.groupEnd();
        } finally {
            setIsLoading(false);
            console.log("Loading state set to false");
        }
    };

    const retryFetch = () => {
        console.log("[PitchesOutlet] Retrying fetch...");
        setRetryCount((prevCount) => prevCount + 1);
    };

    const togglePitch = (id) => {
        setOpenPitchId(openPitchId === id ? null : id);
    };

    const toggleDebugInfo = () => {
        setShowDebugInfo(!showDebugInfo);
    };

    const handleActionClick = (pitch, action) => {
        setSelectedPitch(pitch);
        setModalAction(action);
        setShowConfirmModal(true);
    };

    const handleStatusChange = async (pitchId, newStatus) => {
        setIsChanging(true);
        const previousStatus = pitches.find(
            (pitch) => pitch.id === pitchId
        )?.status;

        console.groupCollapsed(
            `[Pitch Status Change] Starting status update for pitch ${pitchId}`
        );
        console.log("New Status:", newStatus);
        console.log("Pitch ID:", pitchId);

        try {
            // EXACT endpoint format from working function
            const action =
                newStatus.toLowerCase() === "accepted" ? "accept" : "reject";
            const endpoint = `grant/${action}/${pitchId}`; // No trailing slash!

            console.log("Making GET request to:", endpoint);
            const response = await axiosClient.get(endpoint, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            console.groupCollapsed("Backend Response");
            console.log("Status:", response.status);
            console.log("Response Data:", response.data);
            console.groupEnd();

            // Numeric status codes (1=accept, 2=reject)
            const statusCode = action === "accept" ? 1 : 2;

            // Update both selected pitch and main list
            setSelectedPitch((prev) => ({
                ...prev,
                status: statusCode,
            }));

            setPitches((prevPitches) =>
                prevPitches.map((pitch) =>
                    pitch.id === pitchId
                        ? {
                              ...pitch,
                              status: statusCode,
                              updatedAt: new Date().toISOString(),
                              ...(response.data.updatedData || {}),
                          }
                        : pitch
                )
            );

            toast.success(`Status successfully updated to ${newStatus}`);
            setLastChanged(newStatus);
            console.groupEnd();
        } catch (error) {
            console.groupCollapsed(
                `[Pitch Status Change Error] ${newStatus} action failed`
            );
            console.error("Error details:", error);

            // Revert changes
            setSelectedPitch((prev) => ({
                ...prev,
                status: previousStatus,
            }));

            setPitches((prevPitches) =>
                prevPitches.map((pitch) =>
                    pitch.id === pitchId
                        ? { ...pitch, status: previousStatus }
                        : pitch
                )
            );

            const errorMessage = error.response?.data?.message
                ? `Failed to update status: ${error.response.data.message}`
                : "Failed to update status. Please try again.";

            toast.error(errorMessage);
            console.groupEnd();
        } finally {
            setIsChanging(false);
            console.log("Loading state set to false");
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-8 shadow-md min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-12 h-12 mx-auto mb-6">
                        <div className="absolute inset-0 border-t-4 border-gray-300 rounded-full animate-pulse opacity-30"></div>
                        <div className="absolute inset-0 border-t-4 border-gray-800 rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                        Loading
                    </h3>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-center flex-col p-6">
                    <AlertCircle size={32} className="text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Error Loading Pitches
                    </h3>
                    <p className="text-gray-800 text-center mb-2">{error}</p>

                    {htmlResponse && (
                        <div className="w-full mt-4">
                            <button
                                onClick={toggleDebugInfo}
                                className="text-sm text-gray-500 flex items-center justify-center mx-auto mb-2"
                            >
                                <Code size={16} className="mr-1" />
                                {showDebugInfo
                                    ? "Hide Debug Info"
                                    : "Show Debug Info"}
                            </button>

                            {showDebugInfo && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2 overflow-auto max-h-64">
                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                                        {htmlResponse}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex space-x-3 mt-6">
                        <button
                            onClick={retryFetch}
                            className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors flex items-center"
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Available Pitches
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Browse through pitches submitted for this grant
                            opportunity
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium text-green-700">
                            {filteredPitches.length}{" "}
                            {filteredPitches.length === 1 ? "Pitch" : "Pitches"}
                        </div>
                        <div className="relative">
                            <div className="flex items-center space-x-1 bg-gray-50 rounded-full px-3 py-1.5 cursor-pointer">
                                <Filter size={14} className="text-gray-500" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="bg-transparent text-sm appearance-none outline-none pr-5 cursor-pointer"
                                >
                                    <option value="all">All</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredPitches.length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FileText size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No Pitches Found
                            </h3>
                            <p className="text-gray-600">
                                {statusFilter === "all"
                                    ? "No pitches have been submitted for this grant yet."
                                    : statusFilter === "active"
                                    ? "No active pitches found."
                                    : "No pending pitches found."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPitches.map((pitch) => (
                            <PitchCard
                                key={pitch.id}
                                pitch={pitch}
                                isOpen={openPitchId === pitch.id}
                                onToggle={togglePitch}
                                onAccept={() =>
                                    handleActionClick(pitch, "accept")
                                }
                                onDecline={() =>
                                    handleActionClick(pitch, "decline")
                                }
                                onContinueToPitchDeck={() =>
                                    handleContinueToPitchDeck(
                                        pitch.pitch_deck_file
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && selectedPitch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {modalAction === "accept"
                                    ? "Accept Investment Proposal"
                                    : "Reject Proposal"}
                            </h3>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto p-6 flex-1">
                            {modalAction === "accept" ? (
                                <>
                                    <p className="text-gray-700 mb-6">
                                        You're approving funding for{" "}
                                        <strong className="text-green-600">
                                            {selectedPitch.startup_name ||
                                                "this startup"}
                                        </strong>
                                        . Please select your preferred
                                        disbursement method:
                                    </p>

                                    <div className="space-y-4 mb-6">
                                        {/* Milestone Option */}
                                        <div className="flex items-start p-4 border rounded-lg border-gray-200 hover:border-green-300 transition-colors">
                                            <div className="flex items-center h-5 mt-0.5">
                                                <input
                                                    id="milestone-option"
                                                    name="funding-option"
                                                    type="radio"
                                                    className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                                                    defaultChecked
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
                                                    Funds are released in
                                                    predefined stages as the
                                                    startup achieves specific
                                                    business milestones.
                                                </p>
                                                <div className="mt-2 bg-green-50 p-3 rounded-md">
                                                    <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                                                        Benefits
                                                    </h4>
                                                    <ul className="text-xs text-green-600 space-y-1 list-disc list-inside">
                                                        <li>
                                                            Reduces investment
                                                            risk
                                                        </li>
                                                        <li>
                                                            Ensures
                                                            accountability
                                                        </li>
                                                        <li>
                                                            Aligns funding with
                                                            progress
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lump Sum Option */}
                                        <div className="flex items-start p-4 border rounded-lg border-gray-200 hover:border-green-300 transition-colors">
                                            <div className="flex items-center h-5 mt-0.5">
                                                <input
                                                    id="lump-sum-option"
                                                    name="funding-option"
                                                    type="radio"
                                                    className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
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
                                                    Transfer the entire
                                                    investment amount
                                                    immediately upon acceptance.
                                                </p>
                                                <div className="mt-2 bg-red-50 p-3 rounded-md">
                                                    <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">
                                                        Risk Considerations
                                                    </h4>
                                                    <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                                                        <li>
                                                            Higher exposure to
                                                            execution risk
                                                        </li>
                                                        <li>
                                                            Limited recourse if
                                                            milestones aren't
                                                            met
                                                        </li>
                                                        <li>
                                                            Requires strong
                                                            trust in the team
                                                        </li>
                                                    </ul>
                                                    <p className="text-xs text-red-700 mt-2 font-medium">
                                                        Only recommended for
                                                        established teams with
                                                        proven track records.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-700">
                                        Reject the proposal from{" "}
                                        <strong className="text-gray-900">
                                            {selectedPitch.startup_name ||
                                                "this startup"}
                                        </strong>
                                        ?
                                    </p>
                                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-600">
                                            <ExclamationTriangleIcon className="h-4 w-4 text-gray-400 inline mr-1" />
                                            This action cannot be undone. The
                                            startup will be notified
                                            automatically.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Fixed Footer */}
                        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                            <div className="flex space-x-3 justify-end">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAction}
                                    className={`px-4 py-2 rounded-lg text-sm text-white shadow-sm transition-colors ${
                                        modalAction === "accept"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    {modalAction === "accept"
                                        ? "Confirm Acceptance"
                                        : "Confirm Rejection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Extracted PitchCard component for better readability
const PitchCard = ({
    pitch,
    isOpen,
    onToggle,
    onAccept,
    onDecline,
    onContinueToPitchDeck,
}) => {
    const isPitchStatusDefined = pitch.status === 1 || pitch.status === 2;
    const [isReleasing, setIsReleasing] = useState(false);
    const [releaseError, setReleaseError] = useState(null);

    const navigate = useNavigate();

    const initiateBusinessOwnerMessage = (businessOwnerId) => {
        // Validate the business owner ID
        if (!businessOwnerId) {
            console.error("No business owner ID provided");
            alert("Error: Unable to message - no business owner ID found");
            return;
        }

        const initialMessage =
            "Hello, I'm interested in your business and would like to discuss further.";

        navigate("/dashboard/overview/messages", {
            state: {
                customer_id: businessOwnerId,
                initialMessage: initialMessage, // Passing message via state
            },
        });
    };

    const handleReleaseFunds = async (milestoneId) => {
        // Find the milestone details
        const milestone = pitch.grant_milestone.find(
            (m) => m.id === milestoneId
        );

        // Create confirmation dialog content
        const content = `
    <div class="space-y-4">
        <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">Confirm Fund Release</h3>
        </div>
        <div class="bg-gray-50 p-4 rounded-md">
            <div class="flex justify-between">
                <span class="font-medium">Milestone:</span>
                <span>${milestone?.title || "Untitled Milestone"}</span>
            </div>
            <div class="flex justify-between mt-2">
                <span class="font-medium">Amount:</span>
                <span class="font-bold">$${
                    milestone?.amount?.toLocaleString() || "0"
                }</span>
            </div>
            <div class="mt-3 text-sm text-gray-600">
                ${milestone?.description || "No description provided"}
            </div>
        </div>
        <div class="text-sm text-gray-500">
            Are you sure you want to release these funds? This action cannot be undone.
        </div>
    </div>
`;

        // Show confirmation dialog
        $.confirm({
            title: false,
            content: content,
            type: "orange",
            boxWidth: "500px",
            useBootstrap: false,
            buttons: {
                confirm: {
                    text: "Release Funds",
                    btnClass: "btn-orange",
                    action: async function () {
                        setIsReleasing(true);
                        setReleaseError(null);

                        try {
                            console.log(
                                "Releasing funds for milestone:",
                                milestoneId
                            );

                            // Navigate to checkout with the specified parameters
                            navigate("/checkout", {
                                state: {
                                    amount: btoa(milestone?.amount),
                                    listing_id: btoa(milestoneId),
                                    percent: btoa(0), // 100 if they select full amount
                                    purpose: btoa("grant_milestone"),
                                },
                            });
                        } catch (error) {
                            console.error("Error releasing funds:", error);
                            $.alert({
                                title: false,
                                content: `
                            <div class="text-center">
                                <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 class="text-lg font-medium text-gray-900">Release Failed</h3>
                                <div class="mt-2 text-sm text-gray-600">
                                    ${
                                        error.response?.data?.message ||
                                        "Failed to release funds. Please try again."
                                    }
                                </div>
                            </div>
                        `,
                                type: "red",
                                boxWidth: "400px",
                                useBootstrap: false,
                                buttons: {
                                    ok: {
                                        text: "Close",
                                        btnClass: "btn-red",
                                    },
                                },
                            });
                        } finally {
                            setIsReleasing(false);
                        }
                    },
                },
                cancel: {
                    text: "Cancel",
                    btnClass: "btn-default",
                    action: function () {
                        console.log("Fund release canceled");
                    },
                },
            },
        });
    };

    return (
        <div
            className={`border rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden ${
                isPitchStatusDefined
                    ? pitch.status === 1
                        ? "border-green-200 bg-green-50/30"
                        : "border-red-200 bg-red-50/30"
                    : "border-gray-100"
            }`}
        >
            <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    {/* Left side - Pitch info */}
                    <div className="flex-grow">
                        <div className="flex items-center">
                            <h3 className="font-medium text-gray-900">
                                {pitch.startup_name || "Untitled Pitch"}
                            </h3>
                            {pitch.status === 1 && (
                                <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>
                            )}
                            {pitch.status === 2 && (
                                <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                    Declined
                                </span>
                            )}
                            {pitch.status === 0 && (
                                <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                    Pending
                                </span>
                            )}
                        </div>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <Briefcase
                                    size={14}
                                    className="mr-1.5 text-gray-400"
                                />
                                {pitch.sector || "No sector"}
                            </span>
                            <span className="flex items-center">
                                <MapPin
                                    size={14}
                                    className="mr-1.5 text-gray-400"
                                />
                                {pitch.headquarters_location ||
                                    "Location not specified"}
                            </span>
                            {pitch.revenue_last_12_months && (
                                <span className="flex items-center">
                                    <DollarSign
                                        size={14}
                                        className="mr-1.5 text-gray-400"
                                    />
                                    $
                                    {parseFloat(
                                        pitch.revenue_last_12_months
                                    ).toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right side - Action buttons */}
                    <div className="flex items-center space-x-2 md:justify-end">
                        {pitch.status === 0 && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDecline();
                                    }}
                                    className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center"
                                >
                                    <ThumbsDown size={14} className="mr-1.5" />
                                    Decline
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAccept();
                                    }}
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <ThumbsUp size={14} className="mr-1.5" />
                                    Accept
                                </button>
                            </div>
                        )}
                        {pitch.pitch_deck_file && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onContinueToPitchDeck(
                                        pitch.pitch_deck_file
                                    );
                                }}
                                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center whitespace-nowrap"
                            >
                                <FileText size={14} className="mr-1.5" />
                                View Pitch Deck
                            </button>
                        )}
                        <button
                            onClick={() => onToggle(pitch.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
                        >
                            <ChevronDown
                                size={18}
                                className={`text-gray-400 hover:text-green-500 transition-transform duration-200 ${
                                    isOpen ? "transform rotate-180" : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                                <div className="w-1 h-4 bg-green-400 rounded-full mr-2"></div>
                                Overview
                            </h4>
                            <p className="text-gray-600 text-sm">
                                <strong>Stage:</strong>{" "}
                                {pitch.stage || "Not specified"}
                                <br />
                                <strong>Social Impact:</strong>{" "}
                                {pitch.social_impact_areas || "Not specified"}
                                <br />
                                <strong>Traction KPIs:</strong>{" "}
                                {pitch.traction_kpis || "Not specified"}
                                <br />
                                <strong>Team Experience:</strong>{" "}
                                {pitch.team_experience_avg_years}{" "}
                                {pitch.team_experience_avg_years === 1
                                    ? "year"
                                    : "years"}{" "}
                                average
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                                <div className="w-1 h-4 bg-black rounded-full mr-2"></div>
                                Financial Information
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                    <div className="p-1.5 bg-green-50 rounded-lg">
                                        <DollarSign
                                            className="text-green-600"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs block text-gray-500">
                                            Revenue (Last 12 Months):
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            $
                                            {pitch.revenue_last_12_months
                                                ? parseFloat(
                                                      pitch.revenue_last_12_months
                                                  ).toLocaleString()
                                                : "Not specified"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                                <div className="w-1 h-4 bg-black rounded-full mr-2"></div>
                                Message The Business Owner
                            </h4>
                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <button
                                        onClick={() =>
                                            initiateBusinessOwnerMessage(
                                                pitch.user_id
                                            )
                                        }
                                        className="flex items-center space-x-3 bg-white p-3 rounded-lg w-full text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="p-1.5 bg-green-50 rounded-lg">
                                            <MessageSquare
                                                className="text-green-600"
                                                size={16}
                                            />
                                        </div>
                                        <span>Message Owner</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                                <div className="w-1 h-4 bg-gray-400 rounded-full mr-2"></div>
                                Contact
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                    <div className="p-1.5 bg-gray-50 rounded-lg">
                                        <Mail
                                            className="text-gray-600"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs block text-gray-500">
                                            Contact Person:
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {pitch.contact_person_name ||
                                                "Not provided"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                    <div className="p-1.5 bg-gray-50 rounded-lg">
                                        <Mail
                                            className="text-gray-600"
                                            size={16}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-xs block text-gray-500">
                                            Email:
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {pitch.contact_person_email ||
                                                "Not provided"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(pitch.pitch_deck_file ||
                        pitch.business_plan_file ||
                        pitch.pitch_video) && (
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-800 mb-3">
                                Supporting Documents
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {pitch.pitch_deck_file && (
                                    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
                                        <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-green-50 transition-colors">
                                            <FileText
                                                size={16}
                                                className="text-gray-500 group-hover:text-green-500 transition-colors"
                                            />
                                        </div>
                                        <div className="truncate flex-grow">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                Pitch Deck
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF Document
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onContinueToPitchDeck(
                                                    pitch.pitch_deck_file
                                                );
                                            }}
                                            className="ml-2 text-sm text-green-600 hover:text-green-700 flex items-center"
                                        >
                                            <ExternalLink
                                                size={14}
                                                className="mr-1"
                                            />
                                            View
                                        </button>
                                    </div>
                                )}
                                {pitch.business_plan_file && (
                                    <a
                                        href={pitch.business_plan_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-green-50 transition-colors">
                                            <FileText
                                                size={16}
                                                className="text-gray-500 group-hover:text-green-500 transition-colors"
                                            />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                Business Plan
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF Document
                                            </p>
                                        </div>
                                    </a>
                                )}
                                {pitch.pitch_video && (
                                    <a
                                        href={pitch.pitch_video}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-green-50 transition-colors">
                                            <FileText
                                                size={16}
                                                className="text-gray-500 group-hover:text-green-500 transition-colors"
                                            />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                Pitch Video
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Video
                                            </p>
                                        </div>
                                    </a>
                                )}
                            </div>
                            {pitch.status === 1 &&
                                pitch.grant_milestone &&
                                pitch.grant_milestone.length > 0 && (
                                    <div className="mt-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <svg
                                                    className="w-5 h-5 text-green-500 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Funding Milestones
                                            </h4>
                                            <span className="text-sm text-gray-500">
                                                {pitch.grant_milestone.length}{" "}
                                                milestone
                                                {pitch.grant_milestone
                                                    .length !== 1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
                                            {pitch.grant_milestone.map(
                                                (milestone) => (
                                                    <div
                                                        key={milestone.id}
                                                        className="p-5 hover:bg-white transition-colors duration-150"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-start">
                                                                    <div className="flex-shrink-0 mt-1">
                                                                        {milestone.status ===
                                                                        0 ? (
                                                                            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                                                        ) : (
                                                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                                                        )}
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <h5 className="text-base font-medium text-gray-900">
                                                                            {milestone.title ||
                                                                                "Untitled Milestone"}
                                                                        </h5>
                                                                        <p className="text-sm text-gray-600 mt-1">
                                                                            {milestone.description ||
                                                                                "No description provided"}
                                                                        </p>

                                                                        {/* Document section */}
                                                                        <div className="mt-3">
                                                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                                                                Supporting
                                                                                Document
                                                                            </div>
                                                                            {milestone.document ? (
                                                                                <a
                                                                                    href={
                                                                                        milestone.document
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                                                >
                                                                                    <svg
                                                                                        className="w-4 h-4 mr-1"
                                                                                        fill="none"
                                                                                        stroke="currentColor"
                                                                                        viewBox="0 0 24 24"
                                                                                    >
                                                                                        <path
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            strokeWidth={
                                                                                                2
                                                                                            }
                                                                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                                                        />
                                                                                    </svg>
                                                                                    Download
                                                                                    Document
                                                                                </a>
                                                                            ) : (
                                                                                <div className="text-sm text-gray-500 italic">
                                                                                    No
                                                                                    document
                                                                                    attached
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-end">
                                                                <div className="text-xl font-bold text-green-600 mb-2">
                                                                    $
                                                                    {milestone.amount.toLocaleString()}
                                                                </div>
                                                                <div className="mb-3">
                                                                    {milestone.status ===
                                                                    0 ? (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            Pending
                                                                            Release
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            Funds
                                                                            Released
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {milestone.status ===
                                                                    0 && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleReleaseFunds(
                                                                                milestone.id
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                                    >
                                                                        {isReleasing ? (
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
                                                                                Processing...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <svg
                                                                                    className="-ml-1 mr-2 h-4 w-4"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={
                                                                                            2
                                                                                        }
                                                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                    />
                                                                                </svg>
                                                                                Release
                                                                                Funds
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Additional info */}
                                                        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                                            <div className="flex space-x-4">
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Created:
                                                                    </span>{" "}
                                                                    {new Date(
                                                                        milestone.created_at
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Last
                                                                        Updated:
                                                                    </span>{" "}
                                                                    {new Date(
                                                                        milestone.updated_at
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PitchesOutlet;
