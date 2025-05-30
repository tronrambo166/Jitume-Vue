import React, { useState, useMemo, useEffect } from "react";
import {
    MapPin,
    Filter,
    ArrowUpRight,
    Eye,
    PlusCircle,
    Search,
    X,
    BadgePercent,
    Venus,
    Clock,
    Home,
    LocateFixed,
    RefreshCcw,
    Trash,
    Edit3,
} from "lucide-react";
import { Link } from "react-router-dom";
import InvestmentModal from "../Utils/Modals/Opportunityform";
import axiosClient from "../../../axiosClient";
import { useStateContext } from "../../../contexts/contextProvider";
import InvestmentApplicationModal from "../Utils/Modals/InvestmentModal";
import CapitalEditModal from "../Utils/Modals/CapitalEditModal";

const calculateMatchScore = (opportunity, investorPreferences) => {
    let score = 0;

    // Only use actual data from API
    const sector = opportunity.sectors?.split(",")[0] || "";
    const location = opportunity.regions?.split(",")[0] || "";
    const stage = opportunity.startup_stage || "";

    // Compare with investor preferences if available
    if (investorPreferences.sector && sector === investorPreferences.sector)
        score += 30;
    if (
        investorPreferences.location &&
        location === investorPreferences.location
    )
        score += 15;
    if (investorPreferences.stage && stage === investorPreferences.stage)
        score += 10;

    // Add impact scores if available (only using real data flags)
    if (opportunity.is_female_led) score += 10;
    if (opportunity.is_youth_led) score += 10;
    if (opportunity.is_rural_based) score += 10;
    if (opportunity.uses_local_sourcing) score += 10;

    // Normalize to 100
    return Math.min(score, 100);
};

const InvestmentOpportunities = () => {
    // Get investor preferences from API or user profile instead of hardcoding
    const [investorPreferences, setInvestorPreferences] = useState({
        sector: "",
        location: "",
        stage: "",
    });

    const [filters, setFilters] = useState({
        sector: "All",
        minInvestment: "",
        maxInvestment: "",
        stage: "All",
        visibility: false, // New visibility filter
        priorities: {
            femaleLed: false,
            youthLed: false,
            ruralBased: false,
            localSourcing: false,
        },
    });

    const [opportunities, setOpportunities] = useState([]);
    const [isAddingOpportunity, setIsAddingOpportunity] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("discover");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModes, setshowModes] = useState(false);
    const [visibilityStates, setVisibilityStates] = useState({});
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [pendingToggleId, setPendingToggleId] = useState(null);
    const [isCapitalEditModalOpen, setIsCapitalEditModalOpen] = useState(false);
    const [selectedCapital, setSelectedCapital] = useState(null);
    const [pitchCounts, setPitchCount] = useState(0);
    const toggleVisibility = (id) => {
        // Show disclaimer modal before toggling
        setPendingToggleId(id);
        setShowDisclaimer(true);
      };

      const confirmToggle = async () => {
        // Update visibility state locally
        setVisibilityStates(prev => ({
          ...prev,
          [pendingToggleId]: !prev[pendingToggleId],
        }));

        try {
          // Send the request to the backend to persist visibility change
          const response = await axiosClient.get('capital/visibility/'+ pendingToggleId);

          // Optionally, handle the response (like updating the UI or showing a success message)
        //   console.log('Visibility toggled successfully:', response);

        } catch (error) {
          console.error('Error toggling visibility:', error);
          // Optionally, restore the previous state if the toggle fails
          setVisibilityStates(prev => ({
            ...prev,
            [pendingToggleId]: !prev[pendingToggleId], // Revert the state
          }));
        }

        // Hide the disclaimer modal and reset pending toggle ID
        setShowDisclaimer(false);
        setPendingToggleId(null);
      };

      const cancelToggle = () => {
        // Cancel the toggle and close the disclaimer modal
        setShowDisclaimer(false);
        setPendingToggleId(null);
      };



    const handleEditCapital = (capital) => {
        setSelectedCapital(capital);
        setIsCapitalEditModalOpen(true);
      };

      const handleCapitalUpdate = (updatedCapital) => {
        // console.log('Capital updated:', updatedCapital);
        // Update your state or make API call here
        setIsCapitalEditModalOpen(false);
      };

    const handleSuccess = () => {
        // Handle successful submission (e.g., show success message)
        console.log("Application submitted successfully!");
    };

    const toggleModal = () => {
        setIsAddingOpportunity(!isAddingOpportunity);
    };

    const [deleteId, setDeleteId] = useState(null);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowModal2(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosClient.get(
                `capital/delete-capital/${deleteId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            // console.log("Delete response:", response);

            if (response.status === 200 || response.status === 204) {
                setOpportunities((prev) =>
                    prev.filter((opp) => opp.id !== deleteId)
                );
                // console.log("Successfully deleted opportunity");
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (err) {
            console.error("Delete error:", err.response?.data || err.message);
            setError(
                err.response?.data?.message || "Failed to delete opportunity"
            );
        } finally {
            setIsLoading(false);
            setShowModal2(false);
            setDeleteId(null);
        }
    };

    // Fetch investor preferences


    useEffect(() => {
        const fetchCapitalOffers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // console.log("Fetching capital offers...");
                const response = await axiosClient.get(
                    "capital/capital-offers"
                );
                // console.log("API Response:", response);

                // Check for both response.data.capital and response.data directly
                const data = response.data?.capital || response.data;

                if (data && Array.isArray(data)) {
                    // console.log("Capital offers received:", data);
                    setOpportunities(data);
                } else {
                    console.warn("Unexpected response format:", response.data);
                    setError("Received unexpected data format from server");
                }
            } catch (error) {
                console.error("Error fetching capital offers:", error);
                setError("Failed to fetch investment opportunities");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCapitalOffers();
    }, []);
    // Adapt API response to component structure - only using real data
    const processedOpportunities = useMemo(() => {
        // console.log("Processing opportunities:", opportunities);

        if (!Array.isArray(opportunities)) {
            // console.warn("Opportunities is not an array:", opportunities);
            return [];
        }

        return opportunities
            .filter((opp) => {
                const isValid = opp && typeof opp === "object";
                if (!isValid) {
                    console.warn("Invalid opportunity data:", opp);
                }
                return isValid;
            })
            .map((opp) => {
                // console.log("Processing opportunity:", opp);
                return {
                    id: opp.id,
                    name: opp.offer_title || "Untitled Offer",
                    sector: opp.sectors?.split(",")[0] || "Unknown",
                    allSectors: opp.sectors || "",
                    location: opp.regions?.split(",")[0] || "Unknown",
                    allRegions: opp.regions || "",
                    amount: parseFloat(opp.total_capital_available) || 0,
                    perStartupAmount:
                        parseFloat(opp.per_startup_allocation) || 0,
                    stage: opp.startup_stage || "Unknown",
                    isFemaleLed: opp.is_female_led || false,
                    isYouthLed: opp.is_youth_led || false,
                    isRuralBased: opp.is_rural_based || false,
                    usesLocalSourcing: opp.uses_local_sourcing || false,
                    requiredDocs: opp.required_docs?.split(",") || [],
                    milestoneRequirements:
                        opp.milestone_requirements || "None specified",
                    createdAt: opp.created_at || new Date().toISOString(),
                    updatedAt: opp.updated_at || new Date().toISOString(),
                    pitch_count: opp.pitch_count ?? 0,
                    visible: opp.visible,
                };
            });
    }, [opportunities]);

    const scoredOpportunities = useMemo(() => {
        // console.log(
        //     "Calculating match scores with preferences:",
        //     investorPreferences
        // );

        return processedOpportunities.map((opp) => {
            const matchScore = calculateMatchScore(opp, investorPreferences);
            let status = "Potential Match";
            if (matchScore >= 80) status = "Ideal Match";
            else if (matchScore >= 60) status = "Strong Match";
            else if (matchScore >= 40) status = "Good Match";

            // console.log(`Opportunity ${opp.id} match score:`, matchScore);

            return {
                ...opp,
                matchScore,
                status,
            };
        });
    }, [processedOpportunities, investorPreferences]);

    const filteredOpportunities = useMemo(() => {
        return scoredOpportunities.filter((opp) => {
            const matchesSector =
                filters.sector === "All" ||
                opp.allSectors.includes(filters.sector);
            const matchesMinInvestment =
                !filters.minInvestment ||
                opp.amount >= parseFloat(filters.minInvestment);
            const matchesMaxInvestment =
                !filters.maxInvestment ||
                opp.amount <= parseFloat(filters.maxInvestment);
            const matchesStage =
                filters.stage === "All" || opp.stage === filters.stage;
            const matchesSearch =
                !searchTerm ||
                opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                opp.allSectors.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriorities =
                (!filters.priorities.femaleLed || opp.isFemaleLed) &&
                (!filters.priorities.youthLed || opp.isYouthLed) &&
                (!filters.priorities.ruralBased || opp.isRuralBased) &&
                (!filters.priorities.localSourcing || opp.usesLocalSourcing);
            const matchesVisibility = !filters.visibility || opp.visible;

            return (
                matchesSector &&
                matchesMinInvestment &&
                matchesMaxInvestment &&
                matchesStage &&
                matchesSearch &&
                matchesPriorities &&
                matchesVisibility // <- Add this line
            );
        });
    }, [scoredOpportunities, filters, searchTerm]);
    const getStatusColor = (status) => {
        switch (status) {
            case "Ideal Match":
                return "bg-green-100 text-green-800";
            case "Strong Match":
                return "bg-yellow-100 text-yellow-800";
            case "Good Match":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Extract actual sectors and stages from the data for filters
    const availableSectors = useMemo(() => {
        const sectors = new Set(["All"]);
        opportunities.forEach((opp) => {
            if (opp.sectors) {
                opp.sectors.split(",").forEach((sector) => {
                    const trimmedSector = sector.trim();
                    if (trimmedSector) sectors.add(trimmedSector);
                });
            }
        });
        const sectorsArray = Array.from(sectors);
        // console.log("Available sectors:", sectorsArray);
        return sectorsArray;
    }, [opportunities]);
    const { user } = useStateContext();

    const availableStages = useMemo(() => {
        const stages = new Set(["All"]);
        opportunities.forEach((opp) => {
            if (opp.startup_stage) {
                const trimmedStage = opp.startup_stage.trim();
                if (trimmedStage) stages.add(trimmedStage);
            }
        });
        const stagesArray = Array.from(stages);
        // console.log("Available stages:", stagesArray);
        return stagesArray;
    }, [opportunities]);

    // console.log("Rendering with state:", {
    //     isLoading,
    //     error,
    //     opportunities,
    //     processedOpportunities,
    //     scoredOpportunities,
    //     filteredOpportunities,
    // });

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
            <div className="container px-4 py-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extralight tracking-tight text-neutral-800 mb-2">
                            Investment Portal
                        </h1>
                        <p className="text-neutral-500 text-sm">
                            Discover and manage impact-driven investments
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto gap-4">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search opportunities"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-600 transition-colors w-full"
                            />
                            <Search
                                className="absolute left-0 top-3 text-neutral-400"
                                size={18}
                            />
                        </div>

                        {user.investor && (
                            <button
                                onClick={toggleModal}
                                className="px-4 py-2 bg-gradient-to-r from-green-700 to-yellow-500
         text-white font-medium rounded-md hover:brightness-110
         transition-all duration-200 flex items-center gap-2
         shadow-md hover:shadow-green-200/30 active:scale-[0.98]"
                            >
                                {isAddingOpportunity ? (
                                    <>
                                        <X size={18} /> Cancel
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle size={18} /> Add Opportunity
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </header>

                {/* Investment Modal */}
                <InvestmentModal
                    isOpen={isAddingOpportunity}
                    onClose={() => setIsAddingOpportunity(false)}
                    onSuccess={() => {
                        // Remove the newOpp parameter since we don't want to handle it here
                        console.log("Opportunity submission successful");
                        setIsAddingOpportunity(false);

                        // Optionally, you might want to refresh the opportunities list
                        // You would need to implement fetchCapitalOffers() as a standalone function
                        // fetchCapitalOffers();
                    }}
                />
                {/* Tabs */}
                <div className="flex border-b border-neutral-200 mb-6">
                    <button
                        onClick={() => setActiveTab("discover")}
                        className={`px-4 py-2 font-medium text-sm ${
                            activeTab === "discover"
                                ? "text-emerald-600 border-b-2 border-emerald-600"
                                : "text-neutral-500 hover:text-neutral-700"
                        }`}
                    >
                        Discover
                    </button>
                    <button
                        onClick={() => setActiveTab("watchlist")}
                        className={`px-4 py-2 font-medium text-sm ${
                            activeTab === "watchlist"
                                ? "text-emerald-600 border-b-2 border-emerald-600"
                                : "text-neutral-500 hover:text-neutral-700"
                        }`}
                    >
                        Watchlist
                    </button>
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`px-4 py-2 font-medium text-sm ${
                            activeTab === "active"
                                ? "text-emerald-600 border-b-2 border-emerald-600"
                                : "text-neutral-500 hover:text-neutral-700"
                        }`}
                    >
                        Active Investments
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6 shadow-xs">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium text-neutral-700">
                            Filters:
                        </span>

                        {/* Sector Filter */}
                        <div className="relative">
                            <select
                                value={filters.sector}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        sector: e.target.value,
                                    }))
                                }
                                className="pl-3 pr-8 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                {availableSectors.map((sector) => (
                                    <option key={sector} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Stage Filter */}
                        <div className="relative">
                            <select
                                value={filters.stage}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        stage: e.target.value,
                                    }))
                                }
                                className="pl-3 pr-8 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                {availableStages.map((stage) => (
                                    <option key={stage} value={stage}>
                                        {stage}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Min Investment */}
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="Min $"
                                value={filters.minInvestment}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        minInvestment: e.target.value,
                                    }))
                                }
                                className="pl-3 pr-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 w-24"
                            />
                        </div>

                        {/* Max Investment */}
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="Max $"
                                value={filters.maxInvestment}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        maxInvestment: e.target.value,
                                    }))
                                }
                                className="pl-3 pr-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 w-24"
                            />
                        </div>
                    </div>

                    {/* Priority Filters */}
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <span className="text-sm font-medium text-neutral-700">
                            Priority Filters:
                        </span>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={filters.priorities.femaleLed}
                                onChange={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priorities: {
                                            ...prev.priorities,
                                            femaleLed:
                                                !prev.priorities.femaleLed,
                                        },
                                    }))
                                }
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="flex items-center gap-1">
                                <Venus size={14} /> Female-Led
                            </span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={filters.priorities.youthLed}
                                onChange={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priorities: {
                                            ...prev.priorities,
                                            youthLed: !prev.priorities.youthLed,
                                        },
                                    }))
                                }
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="flex items-center gap-1">
                                <Clock size={14} /> Youth-Led
                            </span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={filters.priorities.ruralBased}
                                onChange={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priorities: {
                                            ...prev.priorities,
                                            ruralBased:
                                                !prev.priorities.ruralBased,
                                        },
                                    }))
                                }
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="flex items-center gap-1">
                                <Home size={14} /> Rural-Based
                            </span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={filters.priorities.localSourcing}
                                onChange={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priorities: {
                                            ...prev.priorities,
                                            localSourcing:
                                                !prev.priorities.localSourcing,
                                        },
                                    }))
                                }
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="flex items-center gap-1">
                                <LocateFixed size={14} /> Local Sourcing
                            </span>
                        </label>
                    </div>
                </div>

                {/* Main Content */}
                {isLoading ? (
                    <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                        <p className="text-neutral-500">
                            Loading investment opportunities...
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={() => {
                                setIsLoading(true);
                                setError(null);
                                // console.log("Retrying fetch...");
                                axiosClient
                                    .get("capital/capital-offers")
                                    .then((response) => {
                                        console.log(
                                            "Retry response:",
                                            response
                                        );
                                        if (
                                            response.data &&
                                            Array.isArray(response.data.capital)
                                        ) {
                                            console.log(
                                                "Retry successful, setting opportunities"
                                            );
                                            setOpportunities(
                                                response.data.capital
                                            );
                                            setError(null);
                                        } else {
                                            console.warn(
                                                "Unexpected data format in retry"
                                            );
                                            setError("Unexpected data format");
                                        }
                                    })
                                    .catch((err) => {
                                        console.error(
                                            "Error retrying fetch:",
                                            err
                                        );
                                        setError("Failed to fetch data");
                                    })
                                    .finally(() => {
                                        console.log("Retry completed");
                                        setIsLoading(false);
                                    });
                            }}
                            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : activeTab === "discover" ? (
                    <div className="space-y-4 sm:space-y-6">
                        {filteredOpportunities.length > 0 ? (
                            filteredOpportunities.map((opp) => (
                                <div
                                    key={opp.id}
                                    className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow"
                                >
                                    {/* Header section - actions and basic info */}
                                    <div className="flex justify-between items-start gap-4">
                                        {/* Edit/Delete buttons - only for investors */}
                                        {user?.investor && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditCapital(
                                                            opp.id
                                                        )
                                                    }
                                                    className="text-yellow-500 bg-neutral-100 rounded-full font-semibold p-2 sm:p-4"
                                                >
                                                    <Edit3
                                                        size={14}
                                                        className="sm:text-[10px]"
                                                    />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            opp.id
                                                        )
                                                    }
                                                    className="text-red-500 bg-neutral-100 rounded-full font-semibold p-2 sm:p-4"
                                                >
                                                    <Trash size={14} />
                                                </button>
                                            </div>
                                        )}

                                        {isCapitalEditModalOpen && (
                                            <CapitalEditModal
                                                capitalData={selectedCapital}
                                                onClose={() =>
                                                    setIsCapitalEditModalOpen(
                                                        false
                                                    )
                                                }
                                                onSave={handleCapitalUpdate}
                                            />
                                        )}

                                        {/* Title and status */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <h2 className="text-lg sm:text-xl font-medium truncate">
                                                    {opp.name}
                                                </h2>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                                            opp.status
                                                        )}`}
                                                    >
                                                        {opp.status}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-neutral-500 flex items-center">
                                                        <MapPin
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        {opp.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags and metadata */}
                                    <div className="flex flex-wrap gap-2 sm:gap-4 text-neutral-600 text-xs sm:text-sm">
                                        <span className="flex items-center gap-1 text-emerald-700">
                                            <span className="bg-emerald-100 p-1 rounded-full">
                                                <Eye
                                                    size={12}
                                                    className="text-emerald-600"
                                                />
                                            </span>
                                            {opp.pitch_count ?? 0} Pitches
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BadgePercent size={12} />{" "}
                                            {opp.sector}
                                        </span>
                                        <span>{opp.stage}</span>
                                        <span className="font-semibold">
                                            ${opp.amount.toLocaleString()}
                                        </span>
                                        {opp.isFemaleLed && (
                                            <span className="flex items-center gap-1 text-emerald-600">
                                                <Venus size={12} /> Female-Led
                                            </span>
                                        )}
                                        {opp.isYouthLed && (
                                            <span className="flex items-center gap-1 text-emerald-600">
                                                <Clock size={12} /> Youth-Led
                                            </span>
                                        )}
                                        {opp.isRuralBased && (
                                            <span className="flex items-center gap-1 text-emerald-600">
                                                <Home size={12} /> Rural
                                            </span>
                                        )}
                                        {opp.usesLocalSourcing && (
                                            <span className="flex items-center gap-1 text-emerald-600">
                                                <LocateFixed size={12} /> Local
                                                Sourcing
                                            </span>
                                        )}
                                    </div>

                                    {/* Details grid - single column on mobile */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-sm text-neutral-700">
                                        <div>
                                            <span className="block text-neutral-500 uppercase text-xs mb-1">
                                                Required Documents
                                            </span>
                                            <span className="font-medium">
                                                {opp.requiredDocs.length > 0
                                                    ? opp.requiredDocs
                                                          .slice(0, 2)
                                                          .join(", ") +
                                                      (opp.requiredDocs.length >
                                                      2
                                                          ? "..."
                                                          : "")
                                                    : "None specified"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-neutral-500 uppercase text-xs mb-1">
                                                Per Startup Allocation
                                            </span>
                                            <span className="font-medium">
                                                $
                                                {opp.perStartupAmount
                                                    ? opp.perStartupAmount.toLocaleString()
                                                    : "Not specified"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-neutral-500 uppercase text-xs mb-1">
                                                Listed Date
                                            </span>
                                            <span className="font-medium">
                                                {new Date(
                                                    opp.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer section - stats and actions */}
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 pt-2 border-t border-neutral-100">
                                        {/* Stats */}
                                        <div className="flex justify-between sm:justify-start sm:gap-6 w-full sm:w-auto">
                                            <div>
                                                <span className="text-xs sm:text-sm text-neutral-500">
                                                    Match Score
                                                </span>
                                                <div className="text-xl sm:text-2xl font-light">
                                                    {opp.matchScore}%
                                                </div>
                                            </div>
                                            <div className="hidden sm:block border-l border-neutral-200"></div>
                                            <div className="flex flex-col">
                                                <span className="text-xs sm:text-sm text-neutral-500">
                                                    Total Capital
                                                </span>
                                                <div className="text-xl sm:text-2xl font-light">
                                                    $
                                                    {opp.amount.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                            <Link
                                                to={`/dashboard/overview/funding/${opp.id}`}
                                                state={{ capitalData: opp }}
                                                className="flex-1 sm:flex-none text-neutral-700 whitespace-nowrap hover:text-neutral-900 transition-colors flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 text-sm sm:text-base"
                                            >
                                                <Eye size={14} /> View Details
                                            </Link>

                                            {user.investor === 3 ? (
                                                <>
                                                    <label className="inline-flex items-center cursor-pointer gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                visibilityStates[
                                                                    opp.id
                                                                ] ??
                                                                opp.visible ===
                                                                    1
                                                            }
                                                            onChange={() =>
                                                                toggleVisibility(
                                                                    opp.id
                                                                )
                                                            }
                                                            className="hidden"
                                                        />
                                                        <div
                                                            className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full relative transition-all duration-300 ease-in-out"
                                                            style={{
                                                                backgroundColor:
                                                                    visibilityStates[
                                                                        opp.id
                                                                    ] ??
                                                                    opp.visible ===
                                                                        1
                                                                        ? "#fbbf24"
                                                                        : "#e5e7eb",
                                                            }}
                                                        >
                                                            <div
                                                                className="absolute top-0.5 sm:top-1 w-4 h-4 sm:w-4 sm:h-4 bg-white rounded-full transition-all duration-300 ease-in-out"
                                                                style={{
                                                                    transform:
                                                                        visibilityStates[
                                                                            opp
                                                                                .id
                                                                        ] ??
                                                                        opp.visible ===
                                                                            1
                                                                            ? "translateX(1.5rem)"
                                                                            : "translateX(0.25rem)",
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs sm:text-sm text-gray-700">
                                                            {visibilityStates[
                                                                opp.id
                                                            ] ??
                                                            opp.visible === 1
                                                                ? "Visible"
                                                                : "Hidden"}
                                                        </span>
                                                    </label>

                                                    <Link
                                                        to={`/Dashboard/overview/funding/deals/${opp.id}`}
                                                        state={{
                                                            opportunity: opp,
                                                        }}
                                                        className="flex-1 text-white whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base"
                                                    >
                                                        <ArrowUpRight
                                                            size={14}
                                                        />{" "}
                                                        Open Deal Room
                                                    </Link>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOpportunity(
                                                            opp.id
                                                        );
                                                        setshowModes(true);
                                                    }}
                                                    className="px-3 sm:px-4 py-2 bg-green-600 whitespace-nowrap text-white rounded-md hover:bg-green-700 text-sm sm:text-base"
                                                >
                                                    Apply for Investment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
                                <p className="text-neutral-500">
                                    No matching opportunities found. Try
                                    adjusting your filters.
                                </p>
                            </div>
                        )}
                    </div>
                ) : activeTab === "watchlist" ? (
                    <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                        <p className="text-neutral-500">
                            Your watchlist is currently empty. Save
                            opportunities to track them here.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                        <p className="text-neutral-500">
                            You don't have any active investments yet.
                        </p>
                    </div>
                )}
            </div>
            {showModal2 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                        {isLoading ? (
                            <div className="flex flex-col items-center">
                                <svg
                                    className="animate-spin h-8 w-8 text-red-500 mb-4"
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
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                <p className="text-gray-700">
                                    Deleting opportunity...
                                </p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-800 mb-4">
                                    Are you sure you want to delete this
                                    opportunity?
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowModal2(false)}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {showModes && selectedOpportunity && (
                <InvestmentApplicationModal
                    capitalId={selectedOpportunity}
                    onClose={() => {
                        setshowModes(false);
                        setSelectedOpportunity(null);
                    }}
                    onSuccess={handleSuccess}
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
                                className="px-4 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-500"
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

export default InvestmentOpportunities;
