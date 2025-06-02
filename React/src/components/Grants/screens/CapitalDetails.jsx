import { useLocation } from "react-router-dom";
import { useState } from "react";
import {
    FileText,
    Globe,
    Layers,
    DollarSign,
    Calendar,
    CheckCircle,
    Users,
    MapPin,
    TrendingUp,
    Award,
    Target,
    ArrowLeft,
    Building2,
    Clock,
    Send,
} from "lucide-react";
import InvestmentApplicationModal from "../Utils/Modals/InvestmentModal";
import { useStateContext } from "../../../contexts/contextProvider";

function CapitalDetailsPage() {
    const location = useLocation();
    const capitalData = location.state?.capitalData;
    const [showModes, setshowModes] = useState(false);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const { user } = useStateContext();

    const handleSuccess = () => {
        // Handle successful application submission
        //console.log("Application submitted successfully");
    };

    const handleApply = () => {
        setSelectedOpportunity(capitalData.id);
        setshowModes(true);
    };

    if (!capitalData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="text-center text-gray-600">
                        No capital data found
                    </div>
                </div>
            </div>
        );
    }

    //console.log("Capital Data:", capitalData);

    // Helper function to safely split comma-separated strings
    const safeSplit = (value) => {
        if (!value || typeof value !== "string") return [];
        return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "potential match":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "matched":
                return "bg-green-50 text-green-700 border-green-200";
            case "reviewing":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </button>
                </div>

                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {capitalData.name || "Investment Opportunity"}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>
                                        {capitalData.location || "Global"}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-1" />
                                    <span>{capitalData.sector}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {capitalData.stage && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    {capitalData.stage}
                                </span>
                            )}
                            {capitalData.status && (
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                        capitalData.status
                                    )}`}
                                >
                                    <Award className="h-4 w-4 mr-1" />
                                    {capitalData.status}
                                </span>
                            )}
                            {capitalData.matchScore > 0 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <Target className="h-4 w-4 mr-1" />
                                    {capitalData.matchScore}% Match
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Apply Button - Show only if user is not an investor */}
                    {!user.investor && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleApply}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Apply for Investment
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Main Information */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Capital Overview */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <DollarSign className="mr-2 h-5 w-5 text-emerald-600" />
                                Capital Overview
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {formatCurrency(capitalData.amount)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Total Available
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {formatCurrency(
                                            capitalData.perStartupAmount
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Per Startup
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {capitalData.pitch_count || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Active Pitches
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Target Focus */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Globe className="mr-2 h-5 w-5 text-emerald-600" />
                                Target Focus
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Sectors
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {safeSplit(capitalData.allSectors).map(
                                            (sector, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md border border-gray-200"
                                                >
                                                    {sector}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Regions
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {safeSplit(capitalData.allRegions).map(
                                            (region, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md border border-gray-200"
                                                >
                                                    {region}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Investment Requirements */}
                        {capitalData.milestoneRequirements && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <Layers className="mr-2 h-5 w-5 text-emerald-600" />
                                    Investment Requirements
                                </h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 leading-relaxed">
                                        {capitalData.milestoneRequirements}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Additional Information */}
                    <div className="space-y-8">
                        {/* Investment Preferences */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Users className="mr-2 h-5 w-5 text-emerald-600" />
                                Investment Preferences
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        key: "isFemaleLed",
                                        label: "Female-Led Startups",
                                    },
                                    {
                                        key: "isYouthLed",
                                        label: "Youth-Led Startups",
                                    },
                                    {
                                        key: "isRuralBased",
                                        label: "Rural-Based Startups",
                                    },
                                    {
                                        key: "usesLocalSourcing",
                                        label: "Local Sourcing Focus",
                                    },
                                ].map(({ key, label }) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <span className="text-sm text-gray-700">
                                            {label}
                                        </span>
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                capitalData[key]
                                                    ? "bg-emerald-500"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Required Documents */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-emerald-600" />
                                Required Documents
                            </h2>
                            {capitalData.requiredDocs &&
                            capitalData.requiredDocs.length > 0 ? (
                                <ul className="space-y-2">
                                    {capitalData.requiredDocs.map(
                                        (doc, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center text-sm text-gray-700"
                                            >
                                                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                                                {doc}
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    No specific documents required
                                </p>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-emerald-600" />
                                Timeline
                            </h2>
                            <div className="space-y-4">
                                {capitalData.createdAt && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                                Created
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(
                                                capitalData.createdAt
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        </div>
    );
}

export default CapitalDetailsPage;
