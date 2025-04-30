import React, { useState, useEffect } from "react";
import {
    MapPin,
    Rocket,
    Users,
    Lightbulb,
    TrendingUp,
    Globe,
    CheckCircle2,
    XCircle,
    FileText,
    Upload,
    Download,
    Plus,
    Filter,
    Search,
    ChevronDown,
    ChevronUp,
    Calendar,
    Zap,
    ArrowRight,
    ExternalLink,
    Loader,
    DollarSign,
    Briefcase,
    Trash,
    Eye,
    PlusCircle,
    Edit2,
    Edit3,
    X,
    Map,
    Building,
    Award,
    ChevronRight,
    Target,
    Layers,
    Files,
} from "lucide-react";
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axiosClient";
import DocumentPreviewModal from "../components/DocumentPreviewModal";
import { Disclosure } from "@headlessui/react";
import GrantApplicationModal from "../Utils/Modals/Newgrant";
import OfferGrantModal from "../Utils/Modals/AddnewGrant";

import PitchesOutlet from "../components/Grantpitches";
import { CheckCircle, Star } from "lucide-react";
import GrantEditModal from "../Utils/Modals/GranteditModal";
import { Link } from "react-router-dom";

const TujitumeGrantPortal = () => {
    const [viewingPitchesForGrant, setViewingPitchesForGrant] = useState(null);
    const [activeView, setActiveView] = useState("dashboard");
    const [selectedGrant, setSelectedGrant] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [grants, setGrants] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [grantCount, setGrantCount] = useState(0);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        sectors: [],
        regions: [],
        amountRange: [0, 1000000],
        deadline: "",
    });
    const [showFilters, setShowFilters] = useState(false);

    const [uploadedDocuments, setUploadedDocuments] = useState({});
    const [grantApplications, setGrantApplications] = useState([]);
    const [grantOpportunities, setGrantOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [visibilityStates, setVisibilityStates] = useState({});
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [pendingToggleId, setPendingToggleId] = useState(null);
    const [myApplications, setMyApplications] = useState([]);
    const [currentPreviewFile, setCurrentPreviewFile] = useState(null);
    const [newGrant, setNewGrant] = useState({
        title: "",
        organization: "",
        impact: "",
        totalFund: "",
        maxGrantPerStartup: "",
        regions: [],
        sectors: [],
        deadline: "",
        keyFocus: [],
        documentsRequired: [],
    });
    const { user, token, setUser, setToken } = useStateContext();
    const [isGrantEditModalOpen, setIsGrantEditModalOpen] = useState(false);
    const [grantToEdit, setGrantToEdit] = useState(null);

    const handleEditGrantClick = (grant) => {
        setGrantToEdit(grant);
        setIsGrantEditModalOpen(true);
    };

    const handleGrantUpdate = (updatedGrant) => {
        // Handle the updated grant data
        console.log("Grant updated:", updatedGrant);
        // You might want to update your grants list state here
        setIsGrantEditModalOpen(false);
    };

    const toggleVisibility = (id) => {
        // Show disclaimer modal before toggling
        setPendingToggleId(id);
        setShowDisclaimer(true);
    };

    const confirmToggle = () => {
        setVisibilityStates((prev) => ({
            ...prev,
            [pendingToggleId]: !prev[pendingToggleId],
        }));
        setShowDisclaimer(false);
        setPendingToggleId(null);
    };
    const [previewFile, setPreviewFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewFile = (file) => {
        setPreviewFile(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPreviewFile(null);
    };

    const cancelToggle = () => {
        setShowDisclaimer(false);
        setPendingToggleId(null);
    };
    // Fetch grants from API
    useEffect(() => {
        const fetchGrants = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axiosClient.get("/grant/grants");

                // Log the entire response to inspect the structure
                console.log("API Response:", response);

                // Access the grants array inside the response data
                const rawData = Array.isArray(response.data?.grants)
                    ? response.data.grants
                    : [];

                const cleanedData = rawData.map((grant) => ({
                    ...grant,
                    title: grant.grant_title || "",
                    organization: grant.organization || "",
                    impact: grant.impact || "",
                    status: grant.status || "",
                    techLevel: grant.techLevel || "",
                    regions: grant.regions || [],
                    sectors: grant.sectors || [],
                    keyFocus: grant.keyFocus || [],
                    documentsRequired: grant.documentsRequired || [],
                    // Handle numeric fields that might be strings
                    totalFund:
                        grant.totalFund === "N/A"
                            ? "N/A"
                            : Number(grant.totalFund).toLocaleString(),
                    maxGrantPerStartup:
                        grant.maxGrantPerStartup === "N/A"
                            ? "N/A"
                            : Number(grant.maxGrantPerStartup).toLocaleString(),
                    // Handle funding amounts
                    funding_per_business: grant.funding_per_business
                        ? Number(grant.funding_per_business).toLocaleString()
                        : "N/A",
                    total_grant_amount: grant.total_grant_amount
                        ? Number(grant.total_grant_amount).toLocaleString()
                        : "N/A",
                    // Format dates
                    application_deadline:
                        grant.application_deadline || "No deadline",
                    created_at: grant.created_at || "",
                    // Other fields from the response
                    grant_focus: grant.grant_focus || "",
                    startup_stage_focus: grant.startup_stage_focus || "",
                    eligibility_criteria: grant.eligibility_criteria || "",
                    evaluation_criteria: grant.evaluation_criteria || "",
                    impact_objectives: grant.impact_objectives || "",
                    required_documents: grant.required_documents || "",
                    grant_brief_pdf: grant.grant_brief_pdf || "",
                }));

                setGrantOpportunities(cleanedData);
                console.log("cleanedData:", cleanedData);

                setGrantOpportunities(cleanedData);
                console.log("cleanedData:", cleanedData);
            } catch (err) {
                console.error("Failed to fetch grants:", err);

                const errorMessage =
                    err.response?.status === 401
                        ? "Session expired. Please login again."
                        : err.response?.data?.message ||
                          "Failed to load grant opportunities. Please try again later.";

                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrants();
    }, []);

    const mee = () => {
        console.log("Create Grant");
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleFundRequest = async (pitchId) => {
        console.log("Attempting to request funds for pitch:", pitchId); // logging before request

        try {
            const response = await axiosClient.get(
                `grant/fund-release-request/${pitchId}`
            );
            console.log("Fund request success response:", {
                status: response.status,
                headers: response.headers,
                data: response.data,
            });
        } catch (error) {
            console.error("Error requesting funds:", {
                message: error.message,
                status: error.response?.status,
                headers: error.response?.headers,
                data: error.response?.data,
            });
        }
    };

    const fetchApplications = () => {
        setLoading(true);
        axiosClient
            .get("grant/my_pitches")
            .then(({ data }) => {
                setMyApplications(data.pitches);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching applications:", error);
                setLoading(false);
            });
    };
    console.log("myApplications", myApplications);

    const openDrawer = (application) => {
        setSelectedApplication(application);
        setIsDrawerOpen(true);
        // Optional: Add body class to prevent scrolling when drawer is open
        document.body.classList.add("overflow-hidden");
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        // Remove body class when drawer is closed
        document.body.classList.remove("overflow-hidden");
    };

    const getStatusClass = (status) => {
        if (status === 1 || status === "Accepted")
            return "bg-green-100 text-green-800";
        if (status === 2 || status === "Rejected")
            return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    };

    const getStatusText = (status) => {
        if (status === 1) return "Accepted";
        if (status === 2) return "Rejected";
        return "Pending";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };
    const formatNumber = (num) => {
        if (num >= 1_000_000)
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
        if (num >= 1_000)
            return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        return num.toString();
    };

    const getFileName = (path) => {
        if (!path) return "No file";
        return path.split("/").pop();
    };

    // Delete Grant
    const handleDeleteGrant = (id) => {
        setPendingDeleteId(id); // Store the grant ID to delete
        setShowConfirmModal(true); // Open the confirmation modal
    };

    const confirmDeleteGrant = async () => {
        try {
            await axiosClient.get(`/grant/delete-grant/${pendingDeleteId}`);

            setGrantOpportunities((prevGrants) =>
                prevGrants.filter((grant) => grant.id !== pendingDeleteId)
            );
        } catch (error) {
            console.error("Error deleting grant:", error);
            alert("Failed to delete grant. Please try again.");
        } finally {
            setShowConfirmModal(false);
            setPendingDeleteId(null);
        }
    };

    const cancelDeleteGrant = () => {
        setShowConfirmModal(false);
        setPendingDeleteId(null);
    };

    // No dependencies needed since axiosClient handles token internally
    console.log("grantOpportunities", grantOpportunities);
    // Filter grants
    const filteredGrants = grantOpportunities
        .filter((grant) => {
            const grantTitle = grant.title || grant.grant_title || "";
            const matchesSearch =
                grantTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (grant.organization || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesSectors =
                filters.sectors.length === 0 ||
                (grant.sectors &&
                    Array.isArray(grant.sectors) &&
                    filters.sectors.some((sector) =>
                        grant.sectors.includes(sector)
                    ));
            const matchesRegions =
                filters.regions.length === 0 ||
                (grant.regions &&
                    Array.isArray(grant.regions) &&
                    filters.regions.some((region) =>
                        grant.regions.includes(region)
                    ));
            const fundingAmount =
                grant.funding_per_business || grant.maxGrantPerStartup;
            const parsedAmount = parseFloat(fundingAmount);
            const matchesAmount =
                !isNaN(parsedAmount) &&
                parsedAmount >= filters.amountRange[0] &&
                parsedAmount <= filters.amountRange[1];
            const matchesDeadline =
                !filters.deadline ||
                (grant.application_deadline &&
                    new Date(grant.application_deadline) <=
                        new Date(filters.deadline));
            return (
                matchesSearch &&
                matchesSectors &&
                matchesRegions &&
                matchesAmount &&
                matchesDeadline
            );
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Newest first
        .slice(0, 6); // Limit to 10 results
    console.log("filteredGrants", filteredGrants);

    // Dashboard metrics
    const dashboardMetrics = {
        activeApplications: grantApplications.length,
        totalFundingPotential: grantApplications.reduce((sum, app) => {
            const fundingAmount =
                app.grant?.funding_per_business ||
                app.grant?.maxGrantPerStartup;
            const parsedAmount = parseFloat(fundingAmount);
            return sum + (!isNaN(parsedAmount) ? parsedAmount : 0);
        }, 0),
        countriesCovered: new Set(
            grantApplications.flatMap((app) =>
                app.grant?.regions && Array.isArray(app.grant.regions)
                    ? app.grant.regions
                    : []
            )
        ).size,
        matchingGrants: filteredGrants.length,
        highTechGrants: grantOpportunities.filter(
            (g) =>
                g.techLevel &&
                ["high", "very-high", "cutting-edge"].includes(g.techLevel)
        ).length,
    };
    const toggleOfferModal = () => {
        setIsOfferModalOpen((prev) => !prev);
    };
    // Futuristic document upload with drag and drop
    const handleDocumentUpload = (grantId, documentName) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf,.doc,.docx,.xlsx,.pptx";

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setUploadedDocuments((prev) => ({
                    ...prev,
                    [`${grantId}-${documentName}`]: {
                        name: file.name,
                        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                        type: file.name.split(".").pop(),
                        uploadedAt: new Date().toISOString(),
                    },
                }));
            }
        };
        fileInput.click();
    };

    // Enhanced application submission
    const submitApplication = (grant) => {
        const newApplication = {
            id: Date.now(),
            grant,
            status: "Pending",
            date: new Date().toISOString().split("T")[0],
            documents: uploadedDocuments,
            estimatedReviewTime: Math.floor(Math.random() * 14) + 7, // Days
        };

        setGrantApplications([...grantApplications, newApplication]);
        setSelectedGrant(null);
        setUploadedDocuments({});

        // Futuristic success notification
        alert(
            `🚀 Application submitted successfully!\n\nEstimated review time: ${newApplication.estimatedReviewTime} days`
        );
    };

    // Create new grant with futuristic fields
    const createNewGrant = async () => {
        if (!newGrant.title || !newGrant.organization || !newGrant.totalFund) {
            alert("Please fill in all required fields");
            return;
        }

        const grant = {
            id: Date.now(), // Use timestamp as temporary ID
            ...newGrant,
            totalFund: Number(newGrant.totalFund),
            maxGrantPerStartup: Number(newGrant.maxGrantPerStartup),
            matchScore: Math.floor(Math.random() * 30) + 70,
            status: "open",
            techLevel: "medium", // Default tech level
            createdAt: new Date().toISOString(),
        };

        setIsLoading(true);

        try {
            // Submit to API
            const response = await fetch("/grant/grants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(grant),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const createdGrant = await response.json();
            setGrantOpportunities([...grantOpportunities, createdGrant]);
            alert("Grant opportunity created successfully!");
        } catch (err) {
            console.error("Failed to create grant:", err);
            alert("Failed to create grant opportunity. Please try again.");
            // Fallback - add locally even if API fails
            setGrantOpportunities([...grantOpportunities, grant]);
        } finally {
            setIsLoading(false);
            setShowCreateModal(false);
            setNewGrant({
                title: "",
                organization: "",
                impact: "",
                totalFund: "",
                maxGrantPerStartup: "",
                regions: [],
                sectors: [],
                deadline: "",
                keyFocus: [],
                documentsRequired: [],
            });
        }
    };

    // Sample UI for loading state
    if (isLoading && grantOpportunities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full">
                <Loader className="h-12 w-12 animate-spin text-blue-500" />
                <p className="mt-4 text-lg">Loading grant opportunities...</p>
            </div>
        );
    }

    // Sample UI for error state
    if (error && grantOpportunities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full text-red-500">
                <XCircle className="h-12 w-12" />
                <p className="mt-4 text-lg">{error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }
    // Futuristic Dashboard with animated cards
    const renderDashboard = () => (
        <div className="">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Active Applications Card */}
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow transition-shadow duration-300">
                    <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm font-medium">
                                #
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">
                            Active Applications
                        </h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">
                        {dashboardMetrics.activeApplications}
                    </p>
                </div>

                {/* Funding Potential Card */}
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow transition-shadow duration-300">
                    <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                            <span className="text-green-600 text-sm font-medium">
                                $
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">
                            Funding Potential
                        </h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">
                        $
                        {dashboardMetrics.totalFundingPotential.toLocaleString()}
                    </p>
                </div>

                {/* Matching Grants Card */}
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow transition-shadow duration-300">
                    <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mr-3">
                            <span className="text-yellow-600 text-sm font-medium">
                                ≈
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">
                            Matching Grants
                        </h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">
                        {dashboardMetrics.matchingGrants}
                    </p>
                </div>

                {/* High-Tech Grants Card */}
                <div className="bg-white p-5 rounded-md shadow-sm hover:shadow transition-shadow duration-300">
                    <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                            <span className="text-purple-600 text-sm font-medium">
                                ⚡
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">
                            High-Tech Grants
                        </h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-800">
                        {dashboardMetrics.highTechGrants}
                    </p>
                </div>
            </div>

            {/* Featured Grants - Futuristic Cards */}
            <div>
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Featured Grants
                        </h2>
                        <button
                            onClick={() => setActiveView("opportunities")}
                            className="flex items-center text-green-600 hover:text-green-800"
                        >
                            View all <ArrowRight size={16} className="ml-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
                        {filteredGrants.length === 0 ? (
                            <div className="bg-whit rounded-xl border border-gray-200 text-center p-6 col-span-full">
                                <p className="text-gray-600">
                                    No grants available
                                </p>
                            </div>
                        ) : (
                            filteredGrants.map((grant) => (
                                <div
                                    key={grant.id}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group relative "
                                >
                                    <div className="p-6">
                                        {/* Header section with title and amount */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                                        {grant.title ||
                                                            grant.grant_title ||
                                                            "Untitled Grant"}
                                                    </h3>
                                                    {grant.techLevel ===
                                                        "cutting-edge" && (
                                                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full flex items-center">
                                                            <Zap
                                                                size={12}
                                                                className="mr-1"
                                                            />
                                                            Cutting Edge
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <Building
                                                        size={14}
                                                        className="mr-1.5 text-gray-400"
                                                    />
                                                    {grant.organization ||
                                                        "No organization specified"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-green-600">
                                                    $
                                                    {grant.total_grant_amount ||
                                                        grant.maxGrantPerStartup ||
                                                        0}
                                                </p>

                                                <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                                                    <Calendar
                                                        size={12}
                                                        className="mr-1.5 text-gray-400"
                                                    />
                                                    <span>
                                                        {grant.application_deadline
                                                            ? new Date(
                                                                  grant.application_deadline
                                                              ).toLocaleDateString()
                                                            : "No deadline"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtle divider */}
                                        <div className="h-px bg-gray-50 my-4"></div>

                                        <div className="mt-4">
                                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                {grant.impact ||
                                                    grant.impact_objectives ||
                                                    "No impact description"}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {grant.grant_focus && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700 flex items-center">
                                                        <Target
                                                            size={10}
                                                            className="mr-1"
                                                        />
                                                        {grant.grant_focus}
                                                    </span>
                                                )}
                                                {grant.startup_stage_focus && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 flex items-center">
                                                        <Layers
                                                            size={10}
                                                            className="mr-1"
                                                        />
                                                        {grant.startup_stage_focus
                                                            ? grant.startup_stage_focus.replace(
                                                                  /[\[\]"]+/g,
                                                                  ""
                                                              )
                                                            : "No stage specified"}
                                                    </span>
                                                )}
                                                <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-900 text-white flex items-center gap-x-1.5">
                                                    <Eye
                                                        size={16}
                                                        className="text-emerald-200"
                                                    />
                                                    <span className="font-medium">
                                                        {formatNumber(
                                                            grant.pitch_count ||
                                                                0
                                                        )}
                                                    </span>
                                                    <span className="text-xs">
                                                        Pitches
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <h4 className="flex items-center text-xs font-medium text-gray-500 mb-1">
                                                        <Users
                                                            size={12}
                                                            className="mr-1.5 text-gray-400"
                                                        />
                                                        Eligibility:
                                                    </h4>
                                                    <p className="text-sm text-gray-600 line-clamp-2 pl-4">
                                                        {grant.eligibility_criteria ||
                                                            "Not specified"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="flex items-center text-xs font-medium text-gray-500 mb-1">
                                                        <Files
                                                            size={12}
                                                            className="mr-1.5 text-gray-400"
                                                        />
                                                        Documents:
                                                    </h4>
                                                    <p className="text-sm text-gray-600 pl-4">
                                                        {grant.required_documents
                                                            ? grant.required_documents.replace(
                                                                  /[\[\]"]+/g,
                                                                  ""
                                                              )
                                                            : "Not specified"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex space-x-3">
                                            {grant.grant_brief_pdf && (
                                                <Link
                                                    to={`/Dashboard/grants/${grant.id}`}
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-gray-700"
                                                >
                                                    <FileText size={16} />
                                                    <span>Details</span>
                                                </Link>
                                            )}
                                            <p>
                                                {!user.investor ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedGrant(
                                                                grant
                                                            );
                                                            setShowCreateModal(
                                                                true
                                                            );
                                                        }}
                                                        className={`flex-1 px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 shadow-sm ${
                                                            !grant.grant_brief_pdf
                                                                ? "w-full"
                                                                : ""
                                                        }`}
                                                    >
                                                        <Upload size={16} />
                                                        <span>Apply</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setViewingPitchesForGrant(
                                                                grant.id
                                                            );
                                                        }}
                                                        className={`px-3 py-3 bg-gradient-to-r from-yellow-300 to-green-600 text-black text-sm rounded-lg hover:shadow-md transition-all flex items-center space-x-1.5 shadow-sm ${
                                                            open
                                                                ? "hidden md:flex"
                                                                : "flex"
                                                        }`}
                                                        title="View pitches"
                                                    >
                                                        <Eye size={16} />
                                                        <span>Pitches</span>
                                                    </button>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Enhanced Filters with futuristic elements
    const renderFilters = () => (
        <div className=" p-5 rounded-xl border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-gray-400" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search grants by name, tech or organization..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <Filter size={18} />
                    <span>Advanced Filters</span>
                    {showFilters ? (
                        <ChevronUp size={18} />
                    ) : (
                        <ChevronDown size={18} />
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technology Level
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    techLevel: e.target.value,
                                })
                            }
                        >
                            <option value="">All Levels</option>
                            <option value="emerging">Emerging Tech</option>
                            <option value="high">High Tech</option>
                            <option value="cutting-edge">Cutting Edge</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sectors
                        </label>
                        <select
                            multiple
                            className="w-full border border-gray-300 rounded-lg p-2 h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    sectors: Array.from(
                                        e.target.selectedOptions,
                                        (option) => option.value
                                    ),
                                })
                            }
                        >
                            <option value="AI">Artificial Intelligence</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="IoT">Internet of Things</option>
                            <option value="Renewable Energy">
                                Renewable Energy
                            </option>
                            <option value="AgriTech">AgriTech</option>
                            <option value="Fintech">Fintech</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Regions
                        </label>
                        <select
                            multiple
                            className="w-full border border-gray-300 rounded-lg p-2 h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    regions: Array.from(
                                        e.target.selectedOptions,
                                        (option) => option.value
                                    ),
                                })
                            }
                        >
                            <option value="East Africa">East Africa</option>
                            <option value="West Africa">West Africa</option>
                            <option value="Southern Africa">
                                Southern Africa
                            </option>
                            <option value="North Africa">North Africa</option>
                            <option value="Pan-African">Pan-African</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Funding Range: $
                            {filters.amountRange[0].toLocaleString()} - $
                            {filters.amountRange[1].toLocaleString()}
                        </label>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="1000000"
                                step="10000"
                                value={filters.amountRange[0]}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        amountRange: [
                                            parseInt(e.target.value),
                                            filters.amountRange[1],
                                        ],
                                    })
                                }
                                className="w-full accent-green-600"
                            />
                            <input
                                type="range"
                                min="0"
                                max="1000000"
                                step="10000"
                                value={filters.amountRange[1]}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        amountRange: [
                                            filters.amountRange[0],
                                            parseInt(e.target.value),
                                        ],
                                    })
                                }
                                className="w-full accent-green-600"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    //  Grant Cards
    const renderGrantOpportunities = () => (
        <div className="space-y-4">
            {grantOpportunities.length === 0 ? (
                <div className=" p-6 rounded-xl border border-gray-200  text-center">
                    <p className="text-gray-600 font-medium">
                        No grant opportunities available
                    </p>
                </div>
            ) : (
                grantOpportunities.map((grant) => (
                    <div
                        key={grant.id}
                        className=" border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    {/* Header content - no longer a Disclosure.Button */}
                                    <div className="p-5">
                                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap gap-2 mb-1">
                                                    <div>
                                                        <h2 className="text-lg font-bold text-gray-900 truncate">
                                                            {grant.title ||
                                                                grant.grant_title}
                                                        </h2>
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditGrantClick(
                                                                        grant.id
                                                                    )
                                                                }
                                                                className="px-4 py-2  text-green rounded "
                                                            >
                                                                <Edit3 className=" text-[10px]" />
                                                                <span>
                                                                    Edit-grant
                                                                </span>
                                                            </button>

                                                            {isGrantEditModalOpen && (
                                                                <GrantEditModal
                                                                    grantData={
                                                                        grantToEdit
                                                                    }
                                                                    onClose={() =>
                                                                        setIsGrantEditModalOpen(
                                                                            false
                                                                        )
                                                                    }
                                                                    onSave={
                                                                        handleGrantUpdate
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {grant.techLevel ===
                                                        "cutting-edge" && (
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex-shrink-0">
                                                            <Zap
                                                                size={12}
                                                                className="mr-1 inline"
                                                            />
                                                            Cutting Edge
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Briefcase
                                                            size={14}
                                                            className="mr-1.5 text-gray-400"
                                                        />
                                                        {grant.organization ||
                                                            "No organization"}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin
                                                            size={14}
                                                            className="mr-1.5 text-gray-400"
                                                        />
                                                        {grant.regions.length >
                                                        0
                                                            ? grant.regions.join(
                                                                  ", "
                                                              )
                                                            : "All regions"}
                                                    </div>

                                                    {grant.application_deadline && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar
                                                                size={14}
                                                                className="mr-1.5 text-gray-400"
                                                            />
                                                            {new Date(
                                                                grant.application_deadline
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        visibilityStates[
                                                            grant.id
                                                        ]
                                                    }
                                                    onChange={(e) => {
                                                        e.preventDefault();
                                                        toggleVisibility(
                                                            grant.id
                                                        );
                                                    }}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-amber-400 rounded-full peer relative transition-colors">
                                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                                                </div>
                                                <span className="ml-3 text-sm text-gray-700">
                                                    {visibilityStates[grant.id]
                                                        ? "Visible"
                                                        : "Hidden"}
                                                </span>
                                            </label>
                                            <div className="flex items-center space-x-3 flex-shrink-0">
                                                <span className="bg-green-100 text-green-800 text-md px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                                    <Eye size={16} />
                                                    {formatNumber(
                                                        grant.pitch_count || 0
                                                    )}
                                                    {/* Replace with your actual count variable */}
                                                </span>

                                                {user.investor && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setViewingPitchesForGrant(
                                                                grant.id
                                                            );
                                                        }}
                                                        className={`px-3 py-1.5 bg-gradient-to-r from-[rgb(17, 17, 15)] to-gray-100 text-black text-sm rounded-lg hover:from-[rgb(253,224,71)] hover:to-gray-100 transition-all flex items-center space-x-1.5 shadow-sm ${
                                                            open
                                                                ? "hidden md:flex"
                                                                : "flex"
                                                        }`}
                                                        title="View pitches"
                                                    >
                                                        <Eye size={16} />
                                                        <span>Pitches</span>
                                                    </button>
                                                )}
                                                {!user.investor && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedGrant(
                                                                grant
                                                            );
                                                            setShowCreateModal(
                                                                true
                                                            );
                                                        }}
                                                        className={`px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-500 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-600 transition-all flex items-center space-x-1.5 shadow-sm ${
                                                            open
                                                                ? "hidden md:flex"
                                                                : "flex"
                                                        }`}
                                                        title="Apply now"
                                                    >
                                                        <Upload size={16} />
                                                        <span>Apply</span>
                                                    </button>
                                                )}
                                                <div
                                                    className={`flex space-x-2 ${
                                                        open ? "hidden" : "flex"
                                                    }`}
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const fileName =
                                                                grant.grant_brief_pdf
                                                                    ?.split("/")
                                                                    .pop() ||
                                                                "grant_brief.pdf";
                                                            setCurrentPreviewFile(
                                                                {
                                                                    name: fileName,
                                                                    url: grant.grant_brief_pdf,
                                                                }
                                                            );
                                                            setPreviewModalOpen(
                                                                true
                                                            );
                                                        }}
                                                        disabled={
                                                            !grant.grant_brief_pdf
                                                        }
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                                        title="View document"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                </div>
                                                {user.investor && (
                                                    <div className="group relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteGrant(
                                                                    grant.id
                                                                );
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                            aria-label="Delete grant"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                            Delete
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Only the chevron is now the Disclosure.Button */}
                                                <Disclosure.Button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all">
                                                    <ChevronDown
                                                        size={20}
                                                        className={`transition-transform duration-200 ${
                                                            open
                                                                ? "transform rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </Disclosure.Button>
                                            </div>
                                        </div>

                                        <div
                                            className={`mt-3 flex flex-wrap items-center gap-3 ${
                                                open ? "hidden" : "flex"
                                            }`}
                                        >
                                            {grant.total_grant_amount && (
                                                <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-800 text-xs rounded-full">
                                                    <DollarSign
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    Total: $
                                                    {grant.total_grant_amount.toLocaleString()}
                                                </span>
                                            )}
                                            {grant.funding_per_business && (
                                                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">
                                                    <Briefcase
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    Per Business: $
                                                    {grant.funding_per_business.toLocaleString()}
                                                </span>
                                            )}
                                            {grant.grant_focus && (
                                                <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                                    {grant.grant_focus}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Content - remains the same */}
                                    <Disclosure.Panel className="px-4 pb-5 pt-3 border-t border-gray-100">
                                        <div className="space-y-5">
                                            {/* Key Stats - Horizontal scrollable on mobile */}
                                            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
                                                {grant.total_grant_amount && (
                                                    <div className="flex-shrink-0 border border-gray-200 px-3 py-2 rounded-md">
                                                        <p className="text-xs text-gray-500">
                                                            Total Grant
                                                        </p>
                                                        <p className="text-base font-medium text-gray-900">
                                                            $
                                                            {grant.total_grant_amount.toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}

                                                {grant.funding_per_business && (
                                                    <div className="flex-shrink-0 border border-gray-200 px-3 py-2 rounded-md">
                                                        <p className="text-xs text-gray-500">
                                                            Per Business
                                                        </p>
                                                        <p className="text-base font-medium text-gray-900">
                                                            $
                                                            {grant.funding_per_business.toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}

                                                {grant.application_deadline && (
                                                    <div className="flex-shrink-0 border border-gray-200 px-3 py-2 rounded-md">
                                                        <p className="text-xs text-gray-500">
                                                            Deadline
                                                        </p>
                                                        <p className="text-base font-medium text-gray-900">
                                                            {new Date(
                                                                grant.application_deadline
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                                {grant.grant_focus && (
                                                    <div className="flex-shrink-0 border border-gray-200 px-3 py-2 rounded-md">
                                                        <p className="text-xs text-gray-500">
                                                            Focus
                                                        </p>
                                                        <p className="text-base font-medium text-gray-900">
                                                            {grant.grant_focus}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Collapsible/Expandable Sections */}
                                            <div className="space-y-4">
                                                {/* Description Section */}
                                                <Disclosure defaultOpen={true}>
                                                    {({ open }) => (
                                                        <>
                                                            <Disclosure.Button className="flex w-full justify-between items-center py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200">
                                                                <span className="flex items-center text-gray-700">
                                                                    <FileText
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="mr-2 text-gray-400"
                                                                    />
                                                                    Description
                                                                </span>
                                                                <ChevronDown
                                                                    size={16}
                                                                    className={`text-gray-400 transition-transform ${
                                                                        open
                                                                            ? "transform rotate-180"
                                                                            : ""
                                                                    }`}
                                                                />
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel className="text-sm text-gray-600 pl-6 pr-2">
                                                                {grant.description ||
                                                                    "No description available."}
                                                            </Disclosure.Panel>
                                                        </>
                                                    )}
                                                </Disclosure>

                                                {/* Eligibility Section */}
                                                <Disclosure>
                                                    {({ open }) => (
                                                        <>
                                                            <Disclosure.Button className="flex w-full justify-between items-center py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200">
                                                                <span className="flex items-center text-gray-700">
                                                                    <CheckCircle
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="mr-2 text-gray-400"
                                                                    />
                                                                    Eligibility
                                                                    Criteria
                                                                </span>
                                                                <ChevronDown
                                                                    size={16}
                                                                    className={`text-gray-400 transition-transform ${
                                                                        open
                                                                            ? "transform rotate-180"
                                                                            : ""
                                                                    }`}
                                                                />
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel className="text-sm text-gray-600 pl-6 pr-2">
                                                                {grant.eligibility_criteria ||
                                                                    "No eligibility criteria specified."}
                                                            </Disclosure.Panel>
                                                        </>
                                                    )}
                                                </Disclosure>

                                                {/* Evaluation Section */}
                                                <Disclosure>
                                                    {({ open }) => (
                                                        <>
                                                            <Disclosure.Button className="flex w-full justify-between items-center py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200">
                                                                <span className="flex items-center text-gray-700">
                                                                    <Star
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="mr-2 text-gray-400"
                                                                    />
                                                                    Evaluation
                                                                    Criteria
                                                                </span>
                                                                <ChevronDown
                                                                    size={16}
                                                                    className={`text-gray-400 transition-transform ${
                                                                        open
                                                                            ? "transform rotate-180"
                                                                            : ""
                                                                    }`}
                                                                />
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel className="text-sm text-gray-600 pl-6 pr-2">
                                                                {grant.evaluation_criteria ||
                                                                    "No evaluation criteria specified."}
                                                            </Disclosure.Panel>
                                                        </>
                                                    )}
                                                </Disclosure>

                                                {/* Documents Section */}
                                                {grant.documentsRequired &&
                                                    grant.documentsRequired
                                                        .length > 0 && (
                                                        <Disclosure>
                                                            {({ open }) => (
                                                                <>
                                                                    <Disclosure.Button className="flex w-full justify-between items-center py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200">
                                                                        <span className="flex items-center text-gray-700">
                                                                            <FileText
                                                                                size={
                                                                                    15
                                                                                }
                                                                                className="mr-2 text-gray-400"
                                                                            />
                                                                            Required
                                                                            Documents
                                                                        </span>
                                                                        <ChevronDown
                                                                            size={
                                                                                16
                                                                            }
                                                                            className={`text-gray-400 transition-transform ${
                                                                                open
                                                                                    ? "transform rotate-180"
                                                                                    : ""
                                                                            }`}
                                                                        />
                                                                    </Disclosure.Button>
                                                                    <Disclosure.Panel className="text-sm text-gray-600 pl-6 pr-2">
                                                                        <ul className="list-disc pl-5 space-y-1">
                                                                            {grant.documentsRequired.map(
                                                                                (
                                                                                    doc,
                                                                                    index
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            doc
                                                                                        }
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </Disclosure.Panel>
                                                                </>
                                                            )}
                                                        </Disclosure>
                                                    )}
                                            </div>

                                            {/* Action Buttons - Stacked on mobile, side by side on larger screens */}
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-3 border-t border-gray-100">
                                                {!user.investor && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedGrant(
                                                                grant
                                                            );
                                                            setShowCreateModal(
                                                                true
                                                            );
                                                        }}
                                                        className="flex-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
                                                    >
                                                        <Upload size={16} />
                                                        <span>Apply</span>
                                                    </button>
                                                )}

                                                {user.investor && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setViewingPitchesForGrant(
                                                                grant.id
                                                            );
                                                        }}
                                                        className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                                                    >
                                                        <Eye size={16} />
                                                        <span>
                                                            View Pitches
                                                        </span>
                                                    </button>
                                                )}

                                                {grant.grant_brief_pdf && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const fileName =
                                                                grant.grant_brief_pdf
                                                                    ?.split("/")
                                                                    .pop() ||
                                                                "grant_brief.pdf";
                                                            setCurrentPreviewFile(
                                                                {
                                                                    name: fileName,
                                                                    url: grant.grant_brief_pdf,
                                                                }
                                                            );
                                                            setPreviewModalOpen(
                                                                true
                                                            );
                                                        }}
                                                        className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                                                    >
                                                        <FileText size={16} />
                                                        <span>Brief</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>

                        {previewModalOpen && (
                            <DocumentPreviewModal
                                file={currentPreviewFile}
                                isOpen={previewModalOpen}
                                onClose={() => setPreviewModalOpen(false)}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
    //  Application Modal

    return (
        <div className="min-h-screen  ">
            <div className="max-w-7xl   mx-auto">
                {/* Futuristic Header */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Tujitume{" "}
                                <span className="text-green-600">Grants</span>
                            </h1>
                            <p className="text-gray-600">
                                Empowering Africa's Entrepreneurs
                            </p>
                        </div>
                        {user.investor && (
                            <div className="flex space-x-3">
                                {/* <button
                                // onClick={mee}
                                onClick={() => setShowCreateModal(true)}
                                // onClick={toggleOfferModal}
                                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-md"
                            >
                                <Plus size={18} />
                                <span>Create Grant</span>
                            </button> */}
                                <button
                                    onClick={toggleOfferModal}
                                    className="bg-black text-slate-100 px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition w-full md:w-auto justify-center"
                                >
                                    <PlusCircle className="mr-2" />
                                    Add New Grant
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveView("dashboard")}
                            className={`px-5 py-2.5 rounded-md text-sm font-medium flex-1 text-center ${
                                activeView === "dashboard"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveView("opportunities")}
                            className={`px-5 py-2.5 rounded-md text-sm font-medium flex-1 text-center ${
                                activeView === "opportunities"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Opportunities
                        </button>
                        {!user.investor && (
                            <button
                                onClick={() => setActiveView("status")}
                                className={`px-5 py-2.5 rounded-md text-sm font-medium flex-1 text-center ${
                                    activeView === "status"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                My Applications
                            </button>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    {activeView === "dashboard" && renderDashboard()}
                    {activeView === "opportunities" && (
                        <>
                            {renderFilters()}
                            {renderGrantOpportunities()}
                        </>
                    )}
                    <>
                        {activeView === "status" && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    My Applications ({myApplications.length})
                                </h2>

                                {loading ? (
                                    <div className="flex justify-center items-center py-16">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                    </div>
                                ) : myApplications.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <FileText
                                                className="text-gray-400"
                                                size={32}
                                            />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No applications yet
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            You haven't applied to any grants
                                            yet
                                        </p>
                                        <button
                                            onClick={() =>
                                                setActiveView("opportunities")
                                            }
                                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Browse Opportunities
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myApplications.map((application) => (
                                            <div
                                                key={application.id}
                                                className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {application.grant
                                                                ?.grant_title ||
                                                                application.startup_name}
                                                        </h3>
                                                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                                                            <p>
                                                                <span className="font-medium">
                                                                    Submitted:
                                                                </span>{" "}
                                                                {formatDate(
                                                                    application.created_at
                                                                )}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">
                                                                    Sector:
                                                                </span>{" "}
                                                                {
                                                                    application.sector
                                                                }
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">
                                                                    Location:
                                                                </span>{" "}
                                                                {
                                                                    application.headquarters_location
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                                                application.status
                                                            )}`}
                                                        >
                                                            {getStatusText(
                                                                application.status
                                                            )}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    openDrawer(
                                                                        application
                                                                    )
                                                                }
                                                                className="px-3 py-1 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 text-sm flex items-center"
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                    className="mr-1"
                                                                />
                                                                View
                                                            </button>

                                                            {application.status ===
                                                                1 && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleFundRequest(
                                                                            application.id
                                                                        )
                                                                    }
                                                                    className="px-3 py-1 border border-green-200 rounded-md text-green-600 hover:bg-green-50 text-sm flex items-center"
                                                                >
                                                                    <ExternalLink
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="mr-1"
                                                                    />
                                                                    Request for
                                                                    Funds
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-gray-100">
                                                    <div className="flex flex-wrap gap-3">
                                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                                            {application.stage}
                                                        </span>
                                                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                                                            {
                                                                application.social_impact_areas
                                                            }
                                                        </span>
                                                        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                                                            Revenue: $
                                                            {Number(
                                                                application.revenue_last_12_months
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Drawer for Application Details */}
                        {isDrawerOpen && selectedApplication && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
                                    onClick={closeDrawer}
                                ></div>

                                {/* Drawer */}
                                <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-300">
                                    {/* Header */}
                                    <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                                        <div className="flex items-center justify-between px-6 py-4">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Application Details
                                            </h3>
                                            <button
                                                onClick={closeDrawer}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <X
                                                    size={20}
                                                    className="text-gray-500"
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-6 py-4 space-y-6">
                                        {/* Grant and status information */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    {
                                                        selectedApplication.startup_name
                                                    }
                                                </h2>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                                        selectedApplication.status
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        selectedApplication.status
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-2">
                                                Applied for:{" "}
                                                <span className="font-medium">
                                                    {selectedApplication.grant
                                                        ?.grant_title ||
                                                        "Unknown Grant"}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Key Details */}
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center">
                                                <Calendar
                                                    size={18}
                                                    className="text-gray-500 mr-3"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Submitted on
                                                    </p>
                                                    <p className="font-medium">
                                                        {formatDate(
                                                            selectedApplication.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Map
                                                    size={18}
                                                    className="text-gray-500 mr-3"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Headquarters
                                                    </p>
                                                    <p className="font-medium">
                                                        {
                                                            selectedApplication.headquarters_location
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Building
                                                    size={18}
                                                    className="text-gray-500 mr-3"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Sector
                                                    </p>
                                                    <p className="font-medium">
                                                        {
                                                            selectedApplication.sector
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Users
                                                    size={18}
                                                    className="text-gray-500 mr-3"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Team Experience
                                                    </p>
                                                    <p className="font-medium">
                                                        {
                                                            selectedApplication.team_experience_avg_years
                                                        }{" "}
                                                        years average
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <DollarSign
                                                    size={18}
                                                    className="text-gray-500 mr-3"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Revenue (Last 12 Months)
                                                    </p>
                                                    <p className="font-medium">
                                                        $
                                                        {Number(
                                                            selectedApplication.revenue_last_12_months
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Award
                                                    size={18}
                                                    className="text-gray-500 mr-3"
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Company Stage
                                                    </p>
                                                    <p className="font-medium">
                                                        {
                                                            selectedApplication.stage
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Impact Areas */}
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">
                                                Social Impact Areas
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedApplication.social_impact_areas
                                                    .split(",")
                                                    .map((area, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm"
                                                        >
                                                            {area.trim()}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* KPIs and Traction */}
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">
                                                Traction KPIs
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-gray-700">
                                                    {
                                                        selectedApplication.traction_kpis
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Submitted Files */}
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">
                                                Submitted Files
                                            </h4>
                                            <div className="space-y-3">
                                                {/* Business Plan */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="bg-blue-100 p-2 rounded-md mr-3">
                                                            <FileText
                                                                size={18}
                                                                className="text-blue-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                Business Plan
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {getFileName(
                                                                    selectedApplication.business_plan_file
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                        onClick={() =>
                                                            handleViewFile(
                                                                selectedApplication.business_plan_file
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={18}
                                                            className="text-gray-600"
                                                        />
                                                    </button>
                                                </div>

                                                {/* Pitch Deck */}
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="bg-green-100 p-2 rounded-md mr-3">
                                                            <FileText
                                                                size={18}
                                                                className="text-green-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                Pitch Deck
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {getFileName(
                                                                    selectedApplication.pitch_deck_file
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                        onClick={() =>
                                                            handleViewFile(
                                                                selectedApplication.pitch_deck_file
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={18}
                                                            className="text-gray-600"
                                                        />
                                                    </button>
                                                </div>

                                                {/* Pitch Video */}
                                                {selectedApplication.pitch_video && (
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center">
                                                            <div className="bg-red-100 p-2 rounded-md mr-3">
                                                                <FileText
                                                                    size={18}
                                                                    className="text-red-600"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    Pitch Video
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {getFileName(
                                                                        selectedApplication.pitch_video
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                            onClick={() =>
                                                                handleViewFile(
                                                                    selectedApplication.pitch_video
                                                                )
                                                            }
                                                        >
                                                            <Eye
                                                                size={18}
                                                                className="text-gray-600"
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-3">
                                                Contact Information
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">
                                                        Name:
                                                    </span>{" "}
                                                    {
                                                        selectedApplication.contact_person_name
                                                    }
                                                </p>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">
                                                        Email:
                                                    </span>{" "}
                                                    {
                                                        selectedApplication.contact_person_email
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Grant Details */}
                                        {selectedApplication.grant && (
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 mb-3">
                                                    Grant Details
                                                </h4>
                                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">
                                                            Total Grant Amount:
                                                        </span>{" "}
                                                        $
                                                        {Number(
                                                            selectedApplication
                                                                .grant
                                                                .total_grant_amount
                                                        ).toLocaleString()}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-medium">
                                                            Funding Per
                                                            Business:
                                                        </span>{" "}
                                                        $
                                                        {Number(
                                                            selectedApplication
                                                                .grant
                                                                .funding_per_business
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                                        <button
                                            onClick={closeDrawer}
                                            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                                        >
                                            Close Details{" "}
                                            <ChevronRight
                                                size={18}
                                                className="ml-2"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                </main>
            </div>
            {viewingPitchesForGrant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                Grant Pitches
                            </h3>
                            <button
                                onClick={() => setViewingPitchesForGrant(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <PitchesOutlet grantId={viewingPitchesForGrant} />
                    </div>
                </div>
            )}
            {/* Modals */}
            <DocumentPreviewModal
                file={previewFile}
                isOpen={isModalOpen}
                onClose={closeModal}
            />

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4">
                            Confirm Deletion
                        </h2>
                        <p className="mb-6">
                            Are you sure you want to delete this grant?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={cancelDeleteGrant}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteGrant}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedGrant && showCreateModal && (
                <GrantApplicationModal
                    grantId={selectedGrant.id} // or selectedGrant.id depending on your data
                    newGrant={newGrant}
                    setNewGrant={setNewGrant}
                    setShowCreateModal={setShowCreateModal}
                    createNewGrant={createNewGrant}
                    // Amount={Amount}
                    onClose={() => {
                        setShowCreateModal(false);
                        setSelectedGrant(null);
                    }}
                />
            )}
            {isOfferModalOpen && (
                <OfferGrantModal
                    isOpen={isOfferModalOpen}
                    onClose={toggleOfferModal}
                    onSubmit={(formData) => {
                        console.log("Grant offer submitted:", formData);
                        toggleOfferModal();
                    }}
                />
            )}

            {showDisclaimer && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-2">
                            Visibility Disclaimer
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            By toggling this listing’s visibility, you are
                            allowing investors to see or hide it from their
                            dashboard. Make sure this action is intentional.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={cancelToggle}
                                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmToggle}
                                className="px-4 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TujitumeGrantPortal;
