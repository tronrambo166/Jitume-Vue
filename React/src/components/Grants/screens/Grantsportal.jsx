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
} from "lucide-react";
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axiosClient";
import DocumentPreviewModal from "../components/DocumentPreviewModal";
const TujitumeGrantPortal = () => {
    const [activeView, setActiveView] = useState("dashboard");
    const [selectedGrant, setSelectedGrant] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [grants, setGrants] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);


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
    


    // Delete Grant
    const handleDeleteGrant = (id) => {
        setPendingDeleteId(id);  // Store the grant ID to delete
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
   const filteredGrants = grantOpportunities.filter((grant) => {
    const grantTitle = grant.title || grant.grant_title || "";
    const matchesSearch =
        grantTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (grant.organization || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSectors =
        filters.sectors.length === 0 ||
        (grant.sectors && Array.isArray(grant.sectors) && 
         filters.sectors.some((sector) => grant.sectors.includes(sector)));
    
    const matchesRegions =
        filters.regions.length === 0 ||
        (grant.regions && Array.isArray(grant.regions) && 
         filters.regions.some((region) => grant.regions.includes(region)));
    
    const fundingAmount = grant.funding_per_business || grant.maxGrantPerStartup;
    const parsedAmount = parseFloat(fundingAmount);
    const matchesAmount =
        !isNaN(parsedAmount) &&
        parsedAmount >= filters.amountRange[0] &&
        parsedAmount <= filters.amountRange[1];
    
    const matchesDeadline =
        !filters.deadline ||
        (grant.application_deadline && new Date(grant.application_deadline) <= new Date(filters.deadline));

    return (
        matchesSearch &&
        matchesSectors &&
        matchesRegions &&
        matchesAmount &&
        matchesDeadline
    );
});
console.log("filteredGrants", filteredGrants);

// Dashboard metrics
const dashboardMetrics = {
    activeApplications: grantApplications.length,
    totalFundingPotential: grantApplications.reduce(
        (sum, app) => {
            const fundingAmount = app.grant?.funding_per_business || app.grant?.maxGrantPerStartup;
            const parsedAmount = parseFloat(fundingAmount);
            return sum + (!isNaN(parsedAmount) ? parsedAmount : 0);
        },
        0
    ),
    countriesCovered: new Set(
        grantApplications.flatMap((app) => 
            app.grant?.regions && Array.isArray(app.grant.regions) ? app.grant.regions : []
        )
    ).size,
    matchingGrants: filteredGrants.length,
    highTechGrants: grantOpportunities.filter((g) =>
        g.techLevel && ["high", "very-high", "cutting-edge"].includes(g.techLevel)
    ).length,
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
        <div className="space-y-8">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-green-400 transition-all hover:shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-50 rounded-full text-green-600">
                            <Rocket size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Active Applications
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboardMetrics.activeApplications}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-green-400 transition-all hover:shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-50 rounded-full text-green-600">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Funding Potential
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                $
                                {dashboardMetrics.totalFundingPotential.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-green-400 transition-all hover:shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-50 rounded-full text-green-600">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Matching Grants
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboardMetrics.matchingGrants}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-green-400 transition-all hover:shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-50 rounded-full text-green-600">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                High-Tech Grants
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboardMetrics.highTechGrants}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Grants - Futuristic Cards */}
            <div>
                

                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Featured Futuristic Grants
                        </h2>
                        <button
                            onClick={() => setActiveView("opportunities")}
                            className="flex items-center text-green-600 hover:text-green-800"
                        >
                            View all <ArrowRight size={16} className="ml-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGrants.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 text-center p-6 col-span-full">
                                <p className="text-gray-600">
                                    No grants available
                                </p>
                            </div>
                        ) : (
                            filteredGrants.map((grant) => (
                                <div
                                    key={grant.id}
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                                        {grant.title ||
                                                            grant.grant_title ||
                                                            "Untitled Grant"}
                                                    </h3>
                                                    {grant.techLevel ===
                                                        "cutting-edge" && (
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                            Cutting Edge
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {grant.organization ||
                                                        "No organization specified"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-900">
                                                    $
                                                    {parseInt(
                                                        grant.funding_per_business ||
                                                            grant.maxGrantPerStartup ||
                                                            0
                                                    ).toLocaleString()}
                                                </p>
                                                <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                                                    <Calendar
                                                        size={12}
                                                        className="mr-1"
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

                                        <div className="mt-4">
                                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                {grant.impact ||
                                                    grant.impact_objectives ||
                                                    "No impact description"}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {grant.grant_focus && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                        {grant.grant_focus}
                                                    </span>
                                                )}
                                                {grant.startup_stage_focus && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                        {
                                                            grant.startup_stage_focus
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                                                        Eligibility:
                                                    </h4>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {grant.eligibility_criteria ||
                                                            "Not specified"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                                                        Documents:
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {grant.required_documents ||
                                                            "Not specified"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex space-x-3">
                                            {grant.grant_brief_pdf && (
                                                <button
                                                    onClick={() => {
                                                        const fileName =
                                                            grant.grant_brief_pdf
                                                                .split("/")
                                                                .pop() ||
                                                            "grant_details.pdf";
                                                        setCurrentPreviewFile({
                                                            name: fileName,
                                                            url: grant.grant_brief_pdf,
                                                        });
                                                        setPreviewModalOpen(
                                                            true
                                                        );
                                                    }}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                                                >
                                                    <FileText size={16} />
                                                    <span>Details</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setSelectedGrant(grant)
                                                }
                                                className={`flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 ${
                                                    !grant.grant_brief_pdf
                                                        ? "w-full"
                                                        : ""
                                                }`}
                                            >
                                                <Upload size={16} />
                                                <span>Apply</span>
                                            </button>
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
        <div className="bg-white p-5 rounded-xl border border-gray-200 mb-6">
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

    




    // Futuristic Grant Cards
    const renderGrantOpportunities = () => (
        <div className="space-y-6">
          {grantOpportunities.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600 font-medium">
                No grant opportunities available
              </p>
            </div>
          ) : (
            grantOpportunities.map((grant) => (
              <div
                key={grant.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header Section with improved layout */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h2 className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors">
                          {grant.title || grant.grant_title}
                        </h2>
                        {grant.techLevel === "cutting-edge" && (
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
                            <Zap size={12} className="mr-1" />
                            Cutting Edge
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 font-medium">
                        {grant.organization || "No organization specified"}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                        <MapPin className="text-green-600" size={16} />
                        <span className="text-gray-700 font-medium text-sm">
                          {grant.regions.length > 0
                            ? grant.regions.join(", ")
                            : "All regions"}
                        </span>
                      </div>
                      
                      <div className="group relative">
                        <button
                          onClick={() => handleDeleteGrant(grant.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                          aria-label="Delete grant"
                        >
                          <Trash size={18} />
                        </button>
                        <span className="absolute -bottom-12 -left-12 w-32 py-1 px-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
                          Delete this grant
                        </span>
                      </div>
                    </div>
                  </div>
      
                  {/* Divider with gradient */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>
      
                  {/* Content Section with improved layout */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        Grant Focus
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {grant.grant_focus || "Not specified"}
                      </p>
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-500 mb-1">
                          Startup Stage:
                        </h4>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs inline-flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                          {grant.startup_stage_focus || "Not specified"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Funding Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 bg-white p-2 rounded-md">
                          <div className="p-1.5 bg-green-100 rounded-md">
                            <DollarSign className="text-green-600" size={14} />
                          </div>
                          <span className="text-sm">
                            Total Grant: <span className="font-medium">${grant.total_grant_amount || "N/A"}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white p-2 rounded-md">
                          <div className="p-1.5 bg-green-100 rounded-md">
                            <Briefcase className="text-green-600" size={14} />
                          </div>
                          <span className="text-sm">
                            Per Business: <span className="font-medium">${grant.funding_per_business || "N/A"}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white p-2 rounded-md">
                          <div className="p-1.5 bg-green-100 rounded-md">
                            <Calendar className="text-green-600" size={14} />
                          </div>
                          <span className="text-sm">
                            Deadline:{" "}
                            <span className="font-medium">
                              {grant.application_deadline
                                ? new Date(grant.application_deadline).toLocaleDateString()
                                : "No deadline"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Required Documents
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {grant.required_documents || "Not specified"}
                      </p>
                      {grant.documentsRequired.length > 0 && (
                        <ul className="space-y-2 mt-2">
                          {grant.documentsRequired.map((doc, index) => (
                            <li
                              key={index}
                              className="flex items-center bg-white p-2 rounded-md"
                            >
                              <div className="p-1 bg-gray-100 rounded-md mr-2">
                                <FileText className="text-gray-500" size={14} />
                              </div>
                              <span className="text-sm text-gray-600">
                                {doc}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
      
                  {/* Footer Section with improved actions */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                            <span className="inline-block w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
                            Eligibility Criteria:
                          </h4>
                          <p className="text-sm text-gray-600">
                            {grant.eligibility_criteria || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                            <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full mr-1.5"></span>
                            Impact Objectives:
                          </h4>
                          <p className="text-sm text-gray-600">
                            {grant.impact_objectives || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-end gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <button
                        onClick={() => {
                          // Create a file object from the PDF URL
                          const fileName =
                            grant.grant_brief_pdf
                              .split("/")
                              .pop() || "grant_brief.pdf";
                          const file = {
                            name: fileName,
                            url: grant.grant_brief_pdf,
                          };
                          setCurrentPreviewFile(file);
                          setPreviewModalOpen(true);
                        }}
                        disabled={!grant.grant_brief_pdf}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 w-full md:w-auto justify-center"
                      >
                        <FileText size={16} />
                        <span>View Document</span>
                      </button>
                      <button
                        onClick={() => setSelectedGrant(grant)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-green-600 hover:to-green-500 transition-all flex items-center space-x-2 w-full md:w-auto justify-center shadow-sm"
                      >
                        <Upload size={16} />
                        <span>Apply Now</span>
                      </button>
                    </div>
                  </div>
                </div>
                
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
    // Futuristic Application Modal
    const renderApplicationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Apply for {selectedGrant.title}
                        </h2>
                        <button
                            onClick={() => setSelectedGrant(null)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                Required Documents
                            </h3>
                            <div className="space-y-3">
                                {selectedGrant.documentsRequired.map((doc) => {
                                    const docKey = `${selectedGrant.id}-${doc}`;
                                    return (
                                        <div
                                            key={doc}
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <FileText
                                                        className="text-green-600"
                                                        size={20}
                                                    />
                                                    <span className="font-medium">
                                                        {doc}
                                                    </span>
                                                </div>
                                                {uploadedDocuments[docKey] ? (
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm text-gray-600">
                                                            {
                                                                uploadedDocuments[
                                                                    docKey
                                                                ].name
                                                            }{" "}
                                                            (
                                                            {
                                                                uploadedDocuments[
                                                                    docKey
                                                                ].size
                                                            }
                                                            )
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleDocumentUpload(
                                                                    selectedGrant.id,
                                                                    doc
                                                                )
                                                            }
                                                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            Replace
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleDocumentUpload(
                                                                selectedGrant.id,
                                                                doc
                                                            )
                                                        }
                                                        className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
                                                    >
                                                        <Upload
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        Upload
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-900 mb-3">
                                Project Summary
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-4 h-40 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Describe your project's innovative approach and expected impact..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setSelectedGrant(null)}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center space-x-2"
                                onClick={() => submitApplication(selectedGrant)}
                            >
                                <Upload size={18} />
                                <span>Submit Application</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Futuristic Header */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Tujitume{" "}
                                <span className="text-green-600">Grants</span>
                            </h1>
                            <p className="text-gray-600">
                                Empowering Africa's Futuristic Entrepreneurs
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-md"
                            >
                                <Plus size={18} />
                                <span>Create Grant</span>
                            </button>
                        </div>
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
                    {activeView === "status" && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                My Applications
                            </h2>
                            {grantApplications.length === 0 ? (
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
                                        You haven't applied to any grants yet
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
                                    {grantApplications.map((application) => (
                                        <div
                                            key={application.id}
                                            className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {
                                                            application.grant
                                                                .title
                                                        }
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Submitted on{" "}
                                                        {new Date(
                                                            application.date
                                                        ).toLocaleDateString()}{" "}
                                                        • Estimated review:{" "}
                                                        {
                                                            application.estimatedReviewTime
                                                        }{" "}
                                                        days
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            application.status ===
                                                            "Accepted"
                                                                ? "bg-green-100 text-green-800"
                                                                : application.status ===
                                                                  "Rejected"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {application.status}
                                                    </span>
                                                    <button className="text-green-600 hover:text-green-800 flex items-center text-sm">
                                                        <ExternalLink
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modals */}
            
    {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to delete this grant?</p>
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
            {selectedGrant && renderApplicationModal()}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Create New Grant
                                </h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Grant Title*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={newGrant.title}
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Organization*
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={newGrant.organization}
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    organization:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Impact Statement
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        value={newGrant.impact}
                                        onChange={(e) =>
                                            setNewGrant({
                                                ...newGrant,
                                                impact: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Fund Amount*
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={newGrant.totalFund}
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    totalFund: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Max Grant Per Startup*
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={newGrant.maxGrantPerStartup}
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    maxGrantPerStartup:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Technology Level
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={newGrant.techLevel}
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    techLevel: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="emerging">
                                                Emerging Tech
                                            </option>
                                            <option value="high">
                                                High Tech
                                            </option>
                                            <option value="cutting-edge">
                                                Cutting Edge
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deadline
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={newGrant.deadline}
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    deadline: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sectors
                                        </label>
                                        <select
                                            multiple
                                            className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    sectors: Array.from(
                                                        e.target
                                                            .selectedOptions,
                                                        (option) => option.value
                                                    ),
                                                })
                                            }
                                        >
                                            <option value="AI">
                                                Artificial Intelligence
                                            </option>
                                            <option value="Blockchain">
                                                Blockchain
                                            </option>
                                            <option value="IoT">
                                                Internet of Things
                                            </option>
                                            <option value="Renewable Energy">
                                                Renewable Energy
                                            </option>
                                            <option value="AgriTech">
                                                AgriTech
                                            </option>
                                            <option value="Fintech">
                                                Fintech
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Regions
                                        </label>
                                        <select
                                            multiple
                                            className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            onChange={(e) =>
                                                setNewGrant({
                                                    ...newGrant,
                                                    regions: Array.from(
                                                        e.target
                                                            .selectedOptions,
                                                        (option) => option.value
                                                    ),
                                                })
                                            }
                                        >
                                            <option value="East Africa">
                                                East Africa
                                            </option>
                                            <option value="West Africa">
                                                West Africa
                                            </option>
                                            <option value="Southern Africa">
                                                Southern Africa
                                            </option>
                                            <option value="North Africa">
                                                North Africa
                                            </option>
                                            <option value="Pan-African">
                                                Pan-African
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Key Focus Areas (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        value={newGrant.keyFocus.join(", ")}
                                        onChange={(e) =>
                                            setNewGrant({
                                                ...newGrant,
                                                keyFocus: e.target.value
                                                    .split(",")
                                                    .map((item) => item.trim()),
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Required Documents (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        value={newGrant.documentsRequired.join(
                                            ", "
                                        )}
                                        onChange={(e) =>
                                            setNewGrant({
                                                ...newGrant,
                                                documentsRequired:
                                                    e.target.value
                                                        .split(",")
                                                        .map((item) =>
                                                            item.trim()
                                                        ),
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        onClick={() =>
                                            setShowCreateModal(false)
                                        }
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                                        onClick={createNewGrant}
                                    >
                                        <Plus size={18} />
                                        <span>Create Grant</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TujitumeGrantPortal;
