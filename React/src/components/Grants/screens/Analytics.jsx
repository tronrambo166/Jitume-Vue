import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Search, Bell, Filter, Zap, ArrowRight, Download, ChevronRight, MoreHorizontal, 
  TrendingUp, Award, DollarSign, ChevronDown, ChevronLeft, List, X 
} from 'lucide-react';
import axiosClient from "../../../axiosClient";
import { useStateContext } from "../../../contexts/contextProvider";

const TujitumeWhiteThemeDashboard = () => {
    const [activeTab, setActiveTab] = useState("grants");
    const [hoveredItem, setHoveredItem] = useState(null);
    const [timeRange, setTimeRange] = useState("monthly");
    const [pulsing, setPulsing] = useState(false);
    const [animateValue, setAnimateValue] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAllMatches, setShowAllMatches] = useState(false);
    const [expandedMatch, setExpandedMatch] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSectors, setSelectedSectors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true); // This was missing
    const [error, setError] = useState(null); //
    const [avgScore, setAvgScore] = useState(0);
    const [fundedCount, setFundedCount] = useState(0);
    const [totalMatch, setTotalMatch] = useState(0);
    const [distributionData, setDistributionData] = useState([]);
    const [breakdown, setBreakdown] = useState({});
    // Add to your component's state declarations
    const [topStartups, setTopStartups] = useState([]); // Add this with your other state declarations
    const [highPotential, setHighPotential] = useState(0);
    const { user, setUser, setAvgscore } = useStateContext();

    // Updated color palette - Sophisticated neutrals with green accents
    const COLORS = {
        // Neutral grayscale
        background: "#ffffff",
        panelBg: "#f8f9fa",
        cardBg: "#ffffff",
        border: "#e0e0e0",
        lightBorder: "#ebebeb",
        text: "#2a2a2a",
        dimText: "#6c757d",
        mutedText: "#9e9e9e",

        // Accents (green for important features)
        primary: "#4caf50", // Green
        primaryLight: "#e8f5e9",
        primaryDark: "#388e3c",

        // Supporting neutrals
        highlight: "#757575", // Medium gray
        highlightLight: "#e0e0e0",

        // Status colors
        success: "#4caf50", // Green
        warning: "#ff9800", // Amber
        danger: "#f44336", // Red

        // Chart colors
        chart1: "#9e9e9e", // Gray
        chart2: "#757575", // Darker gray
        chart3: "#616161", // Even darker gray
        chartHighlight: "#4caf50", // Green
    };

    // Define role-based API fetching functions - Insert these before your fetchMatches function
    const fetchDashboardData = async (user) => {
        // console.log("Fetching dashboard data for user role:", user?.investor);

        // Add a small delay to ensure user context is loaded (if needed)
        if (!user || user.investor === undefined) {
            // console.log(
            //     "User or investor role not available yet, using default API"
            // );
            return await fetchGrantsData();
        }

        if (user.investor === 2) {
            return await fetchGrantsData();
        } else if (user.investor === 3) {
            return await fetchInvestmentsData();
        } else {
            // Default case or fallback
            // console.log("Unknown investor role, defaulting to grants API");
            return await fetchGrantsData();
        }
    };

    // Function to fetch grants data
    const fetchGrantsData = async () => {
        try {
            // console.log("Fetching grants data");
            const response = await axiosClient.get("/grant/analytics");
            // console.log("Grants data received:", response.data);
            // Set the avgscore in context
            setAvgscore(response.data.avg_score);
            // Set the user in context
            return response.data;
        } catch (err) {
            console.error("Failed to fetch grant analytics:", err);
            throw err;
        }
    };
    // console.log("topStartups", topStartups);

    // Function to fetch investments data
    const fetchInvestmentsData = async () => {
        try {
            // console.log("Fetching investments data");
            const response = await axiosClient.get("/capital/analytics");
            // console.log("Investments data received:", response.data);
            return response.data;
        } catch (err) {
            console.error("Failed to fetch investment analytics:", err);
            throw err;
        }
    };
    const fetchMatches = async () => {
        try {
            // Use the role-based function to get the appropriate data
            const data = await fetchDashboardData(user);
            // console.log("Fetched Analytics:", data);
            // Set the top startups data
            setTopStartups(data.top_startups || []);
            // Update important metrics with fallback to 0 if null/undefined
            setAvgScore(data.avg_score?.toFixed(1) || "0.0"); // Format to 1 decimal place
            setFundedCount(data.funded || 0);
            setTotalMatch(data.total_match || 0);

            // Start animation for score value
            animateScoreValue(data.avg_score || 0);

            // Prepare distribution data for charts
            const distributionData = Object.entries(
                data.distribution || {}
            ).map(([range, count]) => ({
                label: range,
                value: Number(count),
            }));

            // Calculate high potential matches count
            const highPotentialCount = Object.entries(data.distribution || {})
                .filter(([range]) => range >= "80")
                .reduce((sum, [, count]) => sum + Number(count), 0);

            setHighPotential(highPotentialCount);
            setDistributionData(distributionData);

            // Set the breakdown data
            setBreakdown(data.breakdown || {});

            // Prepare Matching Metrics from Breakdown
            const matchingMetrics = [
                { metric: "Sector Fit", value: data.breakdown?.sector ?? 0 },
                { metric: "Geographic Fit", value: data.breakdown?.geo ?? 0 },
                { metric: "Stage Match", value: data.breakdown?.stage ?? 0 },
                { metric: "Revenue", value: data.breakdown?.revenue ?? 0 },
                { metric: "Team", value: data.breakdown?.team ?? 0 },
                { metric: "Impact", value: data.breakdown?.impact ?? 0 },
            ];
            setMatchingMetrics(matchingMetrics);

            // Prepare Performance Data from Monthly Stats
            const performanceMonth = data.performance_month || {};
            const performanceData = Object.entries(performanceMonth).map(
                ([month, values]) => ({
                    month,
                    applications: values?.applications ?? 0,
                    matches: Number(values?.match ?? 0),
                    conversion: values?.conversion ?? 0,
                })
            );
            setPerformanceData(performanceData);
        } catch (err) {
            console.error("Failed to fetch analytics data:", err);
            setError("Something went wrong fetching analytics data.");
        } finally {
            setLoading(false);
        }
    };

    // Function to animate score value with smooth transition
    const animateScoreValue = (targetScore) => {
        let start = 0;
        const interval = setInterval(() => {
            start += 2;
            setAnimateValue(start);
            if (start >= targetScore) {
                setAnimateValue(targetScore);
                clearInterval(interval);
            }
        }, 40);
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    // Mock data declarations (will be overridden by API data if available)
    const [allMatches, setAllMatches] = useState([
        {
            id: 1,
            name: "AgriTech Solutions",
            sector: "Agriculture",
            score: 94,
            funding: "$250K",
            employees: 24,
            contact: "mary@agritech.com",
            stage: "Series A",
            location: "Nairobi",
        },
        {
            id: 2,
            name: "Renewa Energy",
            sector: "Energy",
            score: 91,
            funding: "$1.8M",
            employees: 42,
            contact: "james@renewa.com",
            stage: "Seed",
            location: "Kampala",
        },
        {
            id: 3,
            name: "AquaPure Systems",
            sector: "Water",
            score: 89,
            funding: "$750K",
            employees: 18,
            contact: "david@aquapure.com",
            stage: "Pre-Seed",
            location: "Dar es Salaam",
        },
        {
            id: 4,
            name: "UrbanFarm Tech",
            sector: "Agriculture",
            score: 87,
            funding: "$350K",
            employees: 12,
            contact: "sarah@urbanfarm.com",
            stage: "Series A",
            location: "Nairobi",
        },
        {
            id: 5,
            name: "EcoBuild Materials",
            sector: "Construction",
            score: 85,
            funding: "$2.1M",
            employees: 56,
            contact: "peter@ecobuild.com",
            stage: "Series B",
            location: "Johannesburg",
        },
        {
            id: 6,
            name: "MediQuick",
            sector: "Health",
            score: 84,
            funding: "$1.2M",
            employees: 32,
            contact: "grace@mediquick.com",
            stage: "Series A",
            location: "Lagos",
        },
        {
            id: 7,
            name: "EduTech Africa",
            sector: "Education",
            score: 82,
            funding: "$500K",
            employees: 28,
            contact: "john@edutech.com",
            stage: "Seed",
            location: "Cape Town",
        },
        {
            id: 8,
            name: "SolarGrid",
            sector: "Energy",
            score: 81,
            funding: "$3.5M",
            employees: 64,
            contact: "michael@solar.com",
            stage: "Series C",
            location: "Accra",
        },
        {
            id: 9,
            name: "CleanWater",
            sector: "Water",
            score: 80,
            funding: "$900K",
            employees: 22,
            contact: "linda@cleanwater.com",
            stage: "Series A",
            location: "Kigali",
        },
        {
            id: 10,
            name: "AgroFinance",
            sector: "Agriculture",
            score: 79,
            funding: "$1.5M",
            employees: 38,
            contact: "robert@agro.com",
            stage: "Series B",
            location: "Nairobi",
        },
    ]);

    const [matchingMetrics, setMatchingMetrics] = useState([
        { metric: "Sector Fit", value: 82 },
        { metric: "Stage Match", value: 75 },
        { metric: "Revenue", value: 68 },
        { metric: "Team", value: 79 },
        { metric: "Impact", value: 88 },
    ]);

    const [performanceData, setPerformanceData] = useState([
        { month: "Jan", applications: 18, matches: 12, conversion: 67 },
        { month: "Feb", applications: 22, matches: 15, conversion: 68 },
        { month: "Mar", applications: 25, matches: 18, conversion: 72 },
        { month: "Apr", applications: 28, matches: 20, conversion: 71 },
        { month: "May", applications: 30, matches: 22, conversion: 73 },
        { month: "Jun", applications: 32, matches: 25, conversion: 78 },
    ]);

    // Filtering and pagination logic
    const filteredMatches = allMatches.filter((match) => {
        const matchesSearch =
            match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.sector.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector =
            selectedSectors.length === 0 ||
            selectedSectors.includes(match.sector);
        return matchesSearch && matchesSector;
    });

    const matchesPerPage = 5;
    const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
    const currentMatches = showAllMatches
        ? filteredMatches
        : filteredMatches.slice(
              (currentPage - 1) * matchesPerPage,
              currentPage * matchesPerPage
          );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedSectors]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPulsing(true);
            setTimeout(() => setPulsing(false), 1500);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const targetAvgScore = 83.5;
        const timer = setTimeout(() => {
            let start = 0;
            const interval = setInterval(() => {
                start += 2;
                setAnimateValue(start);
                if (start >= targetAvgScore) clearInterval(interval);
            }, 40);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="p-3 rounded-lg border shadow-lg"
                    style={{
                        backgroundColor: COLORS.background,
                        borderColor: COLORS.border,
                    }}
                >
                    <p
                        className="font-medium mb-1"
                        style={{ color: COLORS.primary }}
                    >
                        {label}
                    </p>
                    {payload.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center">
                                <div
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{
                                        backgroundColor:
                                            item.color ||
                                            (item.name === "applications"
                                                ? COLORS.chart1
                                                : item.name === "matches"
                                                ? COLORS.primary
                                                : COLORS.chart2),
                                    }}
                                />
                                <span
                                    className="text-xs capitalize"
                                    style={{ color: COLORS.dimText }}
                                >
                                    {item.name}:
                                </span>
                            </div>
                            <span
                                className="text-xs font-medium ml-4"
                                style={{ color: COLORS.text }}
                            >
                                {item.value}
                                {item.name === "conversion" ? "%" : ""}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const Speedometer = ({ value, color, max = 100, size = 160, label }) => {
        const angle = (value / max) * 180;
        const gradient = `conic-gradient(${color} ${angle}deg, ${COLORS.border} ${angle}deg 180deg, transparent 180deg 360deg)`;

        return (
            <div className="flex flex-col items-center justify-center">
                <div
                    className="relative"
                    style={{ width: size, height: size / 2 }}
                >
                    <div
                        className="absolute top-0 rounded-t-full overflow-hidden"
                        style={{
                            width: size,
                            height: size / 2,
                            background: gradient,
                            transformOrigin: "bottom center",
                        }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center pb-2">
                        <div className="text-center">
                            <div
                                className="text-2xl font-bold"
                                style={{ color: COLORS.text }}
                            >
                                {value}%
                            </div>
                            <div
                                className="text-xs mt-1"
                                style={{ color: COLORS.dimText }}
                            >
                                {label}
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute bottom-0 left-1/2 w-1 h-6 rounded-b-full"
                        style={{ backgroundColor: COLORS.text }}
                    ></div>
                </div>
            </div>
        );
    };

    const LEDIndicator = ({ value, threshold, label, size = 80 }) => {
        let color = COLORS.danger;
        let intensity = "0 0 8px";

        if (value >= threshold.high) {
            color = COLORS.primary;
            intensity = "0 0 12px";
        } else if (value >= threshold.medium) {
            color = COLORS.warning;
            intensity = "0 0 10px";
        }

        return (
            <div className="flex flex-col items-center">
                <div
                    className="rounded-full flex items-center justify-center transition-all duration-500 mb-2"
                    style={{
                        width: size,
                        height: size,
                        background: `radial-gradient(circle, ${color} 0%, ${COLORS.background} 70%)`,
                        boxShadow: `${intensity} ${color}`,
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    <span className="text-lg font-bold text-white">
                        {value}
                    </span>
                </div>
                <span className="text-xs" style={{ color: COLORS.dimText }}>
                    {label}
                </span>
            </div>
        );
    };

    const Card = ({ title, value, icon, change, color }) => {
        return (
            <div
                className="relative overflow-hidden rounded-lg p-4 cursor-pointer group transition-all duration-300 hover:shadow-md"
                style={{
                    backgroundColor: COLORS.cardBg,
                    borderLeft: `3px solid ${color}`,
                    boxShadow: `0 2px 8px rgba(0,0,0,0.03)`,
                    border: `1px solid ${COLORS.lightBorder}`,
                }}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p
                            className="text-xs font-medium"
                            style={{ color: COLORS.dimText }}
                        >
                            {title}
                        </p>
                        <p
                            className="text-xl font-semibold mt-1"
                            style={{ color: COLORS.text }}
                        >
                            {value}
                        </p>
                    </div>
                    <div
                        className="p-2 rounded-full transition-colors"
                        style={{
                            backgroundColor: `${color}20`,
                            color: color,
                        }}
                    >
                        {icon}
                    </div>
                </div>
                <div
                    className="text-xs mt-4 rounded-full px-2 py-1 inline-flex items-center justify-center opacity-90"
                    style={{
                        backgroundColor: COLORS.primaryLight,
                        color: COLORS.primary,
                    }}
                >
                    <ArrowRight size={10} className="mr-1" />
                    {change} from last month
                </div>
            </div>
        );
    };

    const toggleSector = (sector) => {
        setSelectedSectors((prev) =>
            prev.includes(sector)
                ? prev.filter((s) => s !== sector)
                : [...prev, sector]
        );
    };

    const handleExport = () => {
        // Determine export type based on user role rather than activeTab
        if (user?.investor === 2) {
            alert("Exporting Grant data...");
            // Your grant export logic here
        } else if (user?.investor === 3) {
            alert("Exporting Investment data...");
            // Your investment export logic here
        } else {
            // Default fallback
            alert(
                `Exporting ${
                    activeTab === "grants" ? "Grant" : "Investment"
                } data...`
            );
        }
    };

    const renderPagination = () => {
        if (filteredMatches.length <= matchesPerPage) return null;

        const maxVisiblePages = 3;
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
            const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

            if (currentPage <= maxPagesBeforeCurrent) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
            }
        }

        const pages = Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );

        return (
            <div
                className="px-4 py-3 flex items-center justify-between border-t"
                style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.panelBg,
                }}
            >
                <div
                    className="flex items-center text-xs"
                    style={{ color: COLORS.dimText }}
                >
                    <span>
                        Showing {(currentPage - 1) * matchesPerPage + 1}-
                        {Math.min(
                            currentPage * matchesPerPage,
                            filteredMatches.length
                        )}{" "}
                        of {filteredMatches.length} matches
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        className="px-2 py-1 text-xs rounded hover:bg-gray-100 disabled:opacity-50"
                        style={{ color: COLORS.dimText }}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                    >
                        <ChevronLeft size={14} className="mr-1" /> First
                    </button>
                    <button
                        className="px-2 py-1 text-xs rounded hover:bg-gray-100 disabled:opacity-50"
                        style={{ color: COLORS.dimText }}
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                    >
                        <ChevronLeft size={14} />
                    </button>

                    {startPage > 1 && (
                        <span
                            className="px-1"
                            style={{ color: COLORS.dimText }}
                        >
                            ...
                        </span>
                    )}

                    {pages.map((page) => (
                        <button
                            key={page}
                            className={`px-2 py-1 text-xs rounded ${
                                currentPage === page
                                    ? "text-white"
                                    : "hover:bg-gray-100"
                            }`}
                            style={{
                                backgroundColor:
                                    currentPage === page
                                        ? COLORS.primary
                                        : "transparent",
                                color:
                                    currentPage === page
                                        ? "white"
                                        : COLORS.dimText,
                            }}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <span
                            className="px-1"
                            style={{ color: COLORS.dimText }}
                        >
                            ...
                        </span>
                    )}

                    <button
                        className="px-2 py-1 text-xs rounded hover:bg-gray-100 disabled:opacity-50"
                        style={{ color: COLORS.dimText }}
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                    >
                        <ChevronRight size={14} />
                    </button>
                    <button
                        className="px-2 py-1 text-xs rounded hover:bg-gray-100 disabled:opacity-50"
                        style={{ color: COLORS.dimText }}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        Last <ChevronRight size={14} className="ml-1" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: COLORS.background }}
        >
            {/* Header */}
            <div
                className="px-6 py-4 rounded-xl mb-6 relative overflow-hidden"
                style={{
                    background: `linear-gradient(to right, ${COLORS.panelBg}, ${COLORS.background})`,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    border: `1px solid ${COLORS.border}`,
                }}
            >
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                        <h1
                            className="text-xl font-bold flex items-center"
                            style={{ color: COLORS.text }}
                        >
                            <Zap
                                size={20}
                                className="mr-2"
                                style={{ color: COLORS.primary }}
                            />
                            Tujitume AI Match Engine
                        </h1>
                        <div
                            className="hidden md:flex space-x-1 p-0.5 rounded-md"
                            style={{ backgroundColor: COLORS.panelBg }}
                        >
                            {/* Only show Grants tab for investor type 2 or if no specific role */}
                            {(user?.investor === 2 || !user?.investor) && (
                                <button
                                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                                        activeTab === "grants"
                                            ? "text-white shadow-md"
                                            : "hover:text-gray-900"
                                    }`}
                                    style={{
                                        backgroundColor:
                                            activeTab === "grants"
                                                ? COLORS.primary
                                                : "transparent",
                                        color:
                                            activeTab === "grants"
                                                ? "white"
                                                : COLORS.dimText,
                                    }}
                                    onClick={() => setActiveTab("grants")}
                                >
                                    Grants
                                </button>
                            )}

                            {/* Only show Investments tab for investor type 3 or if no specific role */}
                            {(user?.investor === 3 || !user?.investor) && (
                                <button
                                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                                        activeTab === "investments"
                                            ? "text-white shadow-md"
                                            : "hover:text-gray-900"
                                    }`}
                                    style={{
                                        backgroundColor:
                                            activeTab === "investments"
                                                ? COLORS.primary
                                                : "transparent",
                                        color:
                                            activeTab === "investments"
                                                ? "white"
                                                : COLORS.dimText,
                                    }}
                                    onClick={() => setActiveTab("investments")}
                                >
                                    Investments
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                style={{ color: COLORS.dimText }}
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-3 py-1.5 w-40 text-sm rounded-lg focus:outline-none focus:ring-1 focus:border-transparent"
                                style={{
                                    border: `1px solid ${COLORS.border}`,
                                    backgroundColor: COLORS.background,
                                    color: COLORS.text,
                                }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* <button 
              className="p-1.5 rounded-lg hover:bg-gray-100 relative border" 
              style={{ 
                backgroundColor: COLORS.background,
                borderColor: COLORS.border,
                color: COLORS.dimText
              }}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.primary }}></span>
            </button> */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-4">
                {/* Dashboard Header */}
                <div className="mb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2
                                className="text-base font-semibold flex items-center"
                                style={{ color: COLORS.text }}
                            >
                                <span>
                                    {activeTab === "grants"
                                        ? "Grant Matching Overview"
                                        : "Investment Matching Overview"}
                                </span>
                                <span
                                    className="ml-2 px-2 py-0.5 text-xs rounded-full border"
                                    style={{
                                        backgroundColor: COLORS.primaryLight,
                                        color: COLORS.primary,
                                        borderColor: COLORS.primary,
                                    }}
                                >
                                    AI Powered
                                </span>
                            </h2>
                            <p
                                className="text-xs mt-1"
                                style={{ color: COLORS.dimText }}
                            >
                                {activeTab === "grants"
                                    ? "Track your grant matching performance and opportunities"
                                    : "Monitor investment matches and potential funding"}
                            </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex space-x-2">
                            {/* <button 
                className="flex items-center text-xs px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                style={{ 
                  borderColor: COLORS.border,
                  color: COLORS.dimText,
                  backgroundColor: COLORS.background
                }}
                onClick={handleExport}
              >
                <Download size={14} className="mr-1.5" />Export
              </button> */}
                            <button
                                className="flex items-center text-xs px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                                style={{
                                    borderColor: COLORS.border,
                                    color: COLORS.dimText,
                                    backgroundColor: COLORS.background,
                                }}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={14} className="mr-1.5" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>

                {showFilters && (
                    <div
                        className="mb-5 p-4 rounded-lg border shadow-sm"
                        style={{
                            backgroundColor: COLORS.background,
                            borderColor: COLORS.border,
                        }}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3
                                className="text-sm font-medium"
                                style={{ color: COLORS.text }}
                            >
                                Filter Options
                            </h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                style={{ color: COLORS.dimText }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label
                                    className="block text-xs font-medium mb-1"
                                    style={{ color: COLORS.dimText }}
                                >
                                    Sectors
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Agriculture",
                                        "Energy",
                                        "Water",
                                        "Construction",
                                        "Health",
                                        "Education",
                                    ].map((sector) => (
                                        <button
                                            key={sector}
                                            className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                                selectedSectors.includes(sector)
                                                    ? "border"
                                                    : "border hover:bg-gray-50"
                                            }`}
                                            style={{
                                                backgroundColor:
                                                    selectedSectors.includes(
                                                        sector
                                                    )
                                                        ? COLORS.primaryLight
                                                        : COLORS.background,
                                                color: selectedSectors.includes(
                                                    sector
                                                )
                                                    ? COLORS.primary
                                                    : COLORS.dimText,
                                                borderColor:
                                                    selectedSectors.includes(
                                                        sector
                                                    )
                                                        ? COLORS.primary
                                                        : COLORS.border,
                                            }}
                                            onClick={() => toggleSector(sector)}
                                        >
                                            {sector}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <button
                                    className="text-xs hover:underline"
                                    style={{ color: COLORS.primary }}
                                    onClick={() => {
                                        setSelectedSectors([]);
                                        setSearchQuery("");
                                    }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    <Card
                        title="Total Matches"
                        value={totalMatch} // Using the actual total_match from API
                        change="+12.7%"
                        icon={<TrendingUp size={16} />}
                        color={COLORS.primary}
                    />
                    <Card
                        title="Average Score"
                        value={`${avgScore}%`} // Using the actual avg_score from API
                        change="+3.2%"
                        icon={<Award size={16} />}
                        color={COLORS.primary}
                    />
                    <Card
                        title="Top Matches"
                        value={
                            distributionData.find((d) => d.label === "80-89")
                                ?.value || 0
                        } // Using distribution data
                        change="+9.1%"
                        icon={<Zap size={16} />}
                        color={COLORS.primary}
                    />
                    <Card
                        title="Funded"
                        value={fundedCount} // Using the actual funded count from API
                        change="+6.8%"
                        icon={<DollarSign size={16} />}
                        color={COLORS.primary}
                    />
                </div>

                {/* Visualization Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                    {/* Speedometer Panel */}
                    <div
                        className="p-4 rounded-xl border flex flex-col items-center justify-center"
                        style={{
                            backgroundColor: COLORS.background,
                            borderColor: COLORS.border,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        }}
                    >
                        <div className="flex justify-between items-center w-full mb-3">
                            <h3
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: COLORS.dimText }}
                            >
                                Matching Efficiency
                            </h3>
                            {/* <button
                                className="text-xs font-medium flex items-center hover:underline"
                                style={{ color: COLORS.primary }}
                                onClick={() =>
                                    alert("Showing matching efficiency details")
                                }
                            >
                                Details{" "}
                                <ChevronRight size={14} className="ml-0.5" />
                            </button> */}
                        </div>
                        <div className="flex flex-col items-center justify-center py-4">
                            {/* Main Speedometer - Uses your API's avg_score */}
                            <Speedometer
                                value={Math.round(avgScore)} // From API: data.avg_score (61.8)
                                color={COLORS.primary}
                                label="Average Match Score"
                            />

                            {/* LED Indicators - Derived from your API data */}
                            <div className="mt-6 w-full grid grid-cols-3 gap-2">
                                <LEDIndicator
                                    value={
                                        distributionData.find(
                                            (d) => d.label === "80-89"
                                        )?.value || 0
                                    } // High Potential (count of 80-89 scores)
                                    threshold={{ medium: 1, high: 2 }} // Adjust based on your needs
                                    label="Top Matches"
                                    size={60}
                                />
                                <LEDIndicator
                                    value={breakdown?.stage ?? 0} // From API: data.breakdown.stage (55)
                                    threshold={{ medium: 50, high: 70 }}
                                    className="text-center"
                                    label="Stage Alignment"
                                    size={60}
                                />
                                <LEDIndicator
                                    value={breakdown?.sector ?? 0} // From API: data.breakdown.sector (30)
                                    threshold={{ medium: 40, high: 60 }}
                                    label="Sector Fit"
                                    size={60}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Performance Trend Chart */}
                    <div
                        className="p-4 rounded-xl border col-span-2"
                        style={{
                            backgroundColor: COLORS.background,
                            borderColor: COLORS.border,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        }}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: COLORS.dimText }}
                            >
                                Performance Trends
                            </h3>
                            <div
                                className="flex space-x-1 p-0.5 rounded-md"
                                style={{ backgroundColor: COLORS.panelBg }}
                            >
                                <button
                                    className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                                        timeRange === "monthly"
                                            ? "text-white"
                                            : "hover:text-gray-900"
                                    }`}
                                    style={{
                                        backgroundColor:
                                            timeRange === "monthly"
                                                ? COLORS.primary
                                                : "transparent",
                                        color:
                                            timeRange === "monthly"
                                                ? "white"
                                                : COLORS.dimText,
                                    }}
                                    onClick={() => setTimeRange("monthly")}
                                >
                                    Monthly
                                </button>
                                <button
                                    className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                                        timeRange === "quarterly"
                                            ? "text-white"
                                            : "hover:text-gray-900"
                                    }`}
                                    style={{
                                        backgroundColor:
                                            timeRange === "quarterly"
                                                ? COLORS.primary
                                                : "transparent",
                                        color:
                                            timeRange === "quarterly"
                                                ? "white"
                                                : COLORS.dimText,
                                    }}
                                    onClick={() => setTimeRange("quarterly")}
                                >
                                    Quarterly
                                </button>
                            </div>
                        </div>
                        <div className="h-60 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={performanceData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        bottom: 5,
                                        left: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke={COLORS.border}
                                        opacity={0.5}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 11,
                                            fill: COLORS.dimText,
                                        }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 11,
                                            fill: COLORS.dimText,
                                        }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="applications"
                                        stroke={COLORS.chart1}
                                        strokeWidth={2}
                                        dot={{
                                            stroke: COLORS.chart1,
                                            strokeWidth: 2,
                                            r: 4,
                                            fill: COLORS.background,
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: COLORS.chart1,
                                            stroke: COLORS.background,
                                        }}
                                        name="Applications"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="matches"
                                        stroke={COLORS.primary}
                                        strokeWidth={2}
                                        dot={{
                                            stroke: COLORS.primary,
                                            strokeWidth: 2,
                                            r: 4,
                                            fill: COLORS.background,
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: COLORS.primary,
                                            stroke: COLORS.background,
                                        }}
                                        name="Matches"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="conversion"
                                        stroke={COLORS.chart2}
                                        strokeWidth={2}
                                        dot={{
                                            stroke: COLORS.chart2,
                                            strokeWidth: 2,
                                            r: 4,
                                            fill: COLORS.background,
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: COLORS.chart2,
                                            stroke: COLORS.background,
                                        }}
                                        name="Conversion"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Score Distribution & Sector Focus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {/* Score Distribution */}
                    <div
                        className="p-4 rounded-xl border"
                        style={{
                            backgroundColor: COLORS.background,
                            borderColor: COLORS.border,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        }}
                    >
                        {/* <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.dimText }}>Match Score Distribution</h3>
              <button 
                className="text-xs font-medium flex items-center hover:underline"
                style={{ color: COLORS.primary }}
                onClick={() => alert('Showing score distribution details')}
              >
                Details <ChevronRight size={14} className="ml-0.5" />
              </button>
            </div> */}

                        <div className="grid grid-cols-1 gap-2 mt-4">
                            {distributionData.length > 0 ? (
                                distributionData.map((item, index) => {
                                    // Determine color based on score range
                                    const color = item.label.includes("90")
                                        ? COLORS.primary
                                        : item.label.includes("80")
                                        ? COLORS.chart1
                                        : item.label.includes("70")
                                        ? COLORS.chart2
                                        : item.label.includes("60")
                                        ? COLORS.warning
                                        : COLORS.danger;

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <div
                                                className="w-16 text-xs"
                                                style={{
                                                    color: COLORS.dimText,
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div
                                                className="flex-1 h-8 rounded-md overflow-hidden relative"
                                                style={{
                                                    backgroundColor:
                                                        COLORS.panelBg,
                                                }}
                                            >
                                                <div
                                                    className="h-full absolute left-0 top-0 flex items-center px-2 justify-end transition-all duration-1000 ease-out rounded-md"
                                                    style={{
                                                        width: `${
                                                            (item.value /
                                                                Math.max(
                                                                    1,
                                                                    totalMatch
                                                                )) *
                                                            100
                                                        }%`,
                                                        backgroundColor: color,
                                                        boxShadow: `0 0 6px ${color}40`,
                                                    }}
                                                >
                                                    <span className="text-xs font-medium text-white">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div
                                    className="text-center py-4 text-sm"
                                    style={{ color: COLORS.dimText }}
                                >
                                    No distribution data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sector Focus */}
                    <div
                        className="p-4 rounded-xl border"
                        style={{
                            backgroundColor: COLORS.background,
                            borderColor: COLORS.border,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        }}
                    >
                        {/* <div className="flex justify-between items-center mb-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.dimText }}>Sector Focus</h3>
    <button 
      className="text-xs font-medium flex items-center hover:underline"
      style={{ color: COLORS.primary }}
      onClick={() => setShowFilters(true)}
    >
      Filter <Filter size={14} className="ml-0.5" />
    </button>
  </div> */}

                        <div className="h-48 flex justify-center items-center">
                            {loading ? (
                                <div
                                    className="text-center text-sm"
                                    style={{ color: COLORS.dimText }}
                                >
                                    Loading sector data...
                                </div>
                            ) : error ? (
                                <div
                                    className="text-center text-sm"
                                    style={{ color: COLORS.danger }}
                                >
                                    {error}
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: "Agriculture",
                                                    value:
                                                        breakdown.sector || 0,
                                                },
                                                {
                                                    name: "Energy",
                                                    value: breakdown.geo || 0,
                                                },
                                                {
                                                    name: "Water",
                                                    value: breakdown.stage || 0,
                                                },
                                                {
                                                    name: "Construction",
                                                    value:
                                                        breakdown.revenue || 0,
                                                },
                                                {
                                                    name: "Other",
                                                    value: breakdown.team || 0,
                                                },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            <Cell
                                                key="agriculture"
                                                fill={COLORS.primary}
                                            />
                                            <Cell
                                                key="energy"
                                                fill={COLORS.chart1}
                                            />
                                            <Cell
                                                key="water"
                                                fill={COLORS.chart2}
                                            />
                                            <Cell
                                                key="construction"
                                                fill={COLORS.chart3}
                                            />
                                            <Cell
                                                key="other"
                                                fill={COLORS.highlight}
                                            />
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name) => [
                                                `${value}% match`,
                                                name,
                                            ]}
                                            contentStyle={{
                                                backgroundColor:
                                                    COLORS.background,
                                                borderColor: COLORS.border,
                                                borderRadius: "0.5rem",
                                                color: COLORS.text,
                                            }}
                                            itemStyle={{ color: COLORS.text }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            <div className="flex items-center text-xs">
                                <div
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{ backgroundColor: COLORS.primary }}
                                ></div>
                                <span style={{ color: COLORS.dimText }}>
                                    Agriculture: {breakdown.sector || 0}%
                                </span>
                            </div>
                            <div className="flex items-center text-xs">
                                <div
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{ backgroundColor: COLORS.chart1 }}
                                ></div>
                                <span style={{ color: COLORS.dimText }}>
                                    Energy: {breakdown.geo || 0}%
                                </span>
                            </div>
                            <div className="flex items-center text-xs">
                                <div
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{ backgroundColor: COLORS.chart2 }}
                                ></div>
                                <span style={{ color: COLORS.dimText }}>
                                    Water: {breakdown.stage || 0}%
                                </span>
                            </div>
                            <div className="flex items-center text-xs">
                                <div
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{ backgroundColor: COLORS.chart3 }}
                                ></div>
                                <span style={{ color: COLORS.dimText }}>
                                    Construction: {breakdown.revenue || 0}%
                                </span>
                            </div>
                            <div className="flex items-center text-xs">
                                <div
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{
                                        backgroundColor: COLORS.highlight,
                                    }}
                                ></div>
                                <span style={{ color: COLORS.dimText }}>
                                    Other: {breakdown.team || 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Matches Table */}
                <div
                    className="rounded-xl overflow-hidden border"
                    style={{
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        backgroundColor: COLORS.background,
                        borderColor: COLORS.border,
                    }}
                >
                    <div
                        className="p-4 border-b flex justify-between items-center"
                        style={{ borderColor: COLORS.border }}
                    >
                        <h3
                            className="text-xs font-semibold uppercase tracking-wider flex items-center"
                            style={{ color: COLORS.dimText }}
                        >
                            <Zap
                                size={14}
                                className="mr-2"
                                style={{ color: COLORS.primary }}
                            />
                            {showAllMatches
                                ? "All Matching Startups"
                                : "Top Matching Startups"}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table
                            className="min-w-full divide-y"
                            style={{ borderColor: COLORS.border }}
                        >
                            <thead
                                className=""
                                style={{ backgroundColor: COLORS.panelBg }}
                            >
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ color: COLORS.dimText }}
                                    >
                                        Startup
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ color: COLORS.dimText }}
                                    >
                                        Sector
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ color: COLORS.dimText }}
                                    >
                                        Match Score
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ color: COLORS.dimText }}
                                    >
                                        Location
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ color: COLORS.dimText }}
                                    >
                                        Stage
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                        style={{ color: COLORS.dimText }}
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className="divide-y"
                                style={{ borderColor: COLORS.border }}
                            >
                                {topStartups.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-4 text-center text-sm"
                                            style={{ color: COLORS.dimText }}
                                        >
                                            No matching startups found
                                        </td>
                                    </tr>
                                ) : (
                                    topStartups.map((startup) => (
                                        <React.Fragment key={startup.id}>
                                            <tr
                                                className={`transition-colors cursor-pointer ${
                                                    hoveredItem === startup.id
                                                        ? "bg-gray-50"
                                                        : ""
                                                }`}
                                                style={{
                                                    backgroundColor:
                                                        hoveredItem ===
                                                        startup.id
                                                            ? COLORS.panelBg
                                                            : COLORS.background,
                                                }}
                                                onMouseEnter={() =>
                                                    setHoveredItem(startup.id)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredItem(null)
                                                }
                                                onClick={() =>
                                                    setExpandedMatch(
                                                        expandedMatch ===
                                                            startup.id
                                                            ? null
                                                            : startup.id
                                                    )
                                                }
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)`,
                                                                boxShadow: `0 2px 6px ${COLORS.primaryDark}20`,
                                                            }}
                                                        >
                                                            <span className="text-white font-medium">
                                                                {startup.startup_name?.charAt(
                                                                    0
                                                                ) || "?"}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div
                                                                className="text-sm font-medium"
                                                                style={{
                                                                    color: COLORS.text,
                                                                }}
                                                            >
                                                                {startup.startup_name ||
                                                                    "Unnamed Startup"}
                                                            </div>
                                                            <div
                                                                className="text-xs"
                                                                style={{
                                                                    color: COLORS.dimText,
                                                                }}
                                                            >
                                                                {
                                                                    startup.contact_person_email
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span
                                                        className="inline-flex px-2 py-0.5 text-xs rounded-full border"
                                                        style={{
                                                            backgroundColor: `${COLORS.primaryLight}`,
                                                            color: COLORS.primary,
                                                            borderColor:
                                                                COLORS.primary,
                                                        }}
                                                    >
                                                        {startup.sector ||
                                                            "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-10 h-10 relative flex items-center justify-center"
                                                            style={{
                                                                filter:
                                                                    hoveredItem ===
                                                                    startup.id
                                                                        ? "drop-shadow(0 0 4px rgba(76, 175, 80, 0.2))"
                                                                        : "none",
                                                            }}
                                                        >
                                                            <svg
                                                                width="40"
                                                                height="40"
                                                                viewBox="0 0 40 40"
                                                            >
                                                                <circle
                                                                    cx="20"
                                                                    cy="20"
                                                                    r="18"
                                                                    fill="none"
                                                                    stroke={
                                                                        COLORS.border
                                                                    }
                                                                    strokeWidth="4"
                                                                />
                                                                <circle
                                                                    cx="20"
                                                                    cy="20"
                                                                    r="18"
                                                                    fill="none"
                                                                    stroke={
                                                                        COLORS.primary
                                                                    }
                                                                    strokeWidth="4"
                                                                    strokeDasharray={`${
                                                                        (startup.score /
                                                                            100) *
                                                                        113
                                                                    } 113`}
                                                                    strokeDashoffset="28"
                                                                    transform="rotate(-90 20 20)"
                                                                />
                                                            </svg>
                                                            <span
                                                                className="absolute text-xs font-medium"
                                                                style={{
                                                                    color: COLORS.text,
                                                                }}
                                                            >
                                                                {startup.score}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`ml-2 h-2 rounded-full transition-all duration-500 ${
                                                                hoveredItem ===
                                                                startup.id
                                                                    ? "w-16"
                                                                    : "w-12"
                                                            }`}
                                                            style={{
                                                                backgroundImage:
                                                                    startup.score >=
                                                                    90
                                                                        ? `linear-gradient(to right, ${COLORS.primary}, ${COLORS.primaryLight})`
                                                                        : startup.score >=
                                                                          80
                                                                        ? `linear-gradient(to right, ${COLORS.primary}, ${COLORS.highlightLight})`
                                                                        : `linear-gradient(to right, ${COLORS.warning}, ${COLORS.highlightLight})`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>
                                                <td
                                                    className="px-4 py-3 whitespace-nowrap text-sm"
                                                    style={{
                                                        color: COLORS.text,
                                                    }}
                                                >
                                                    {startup.headquarters_location ||
                                                        "N/A"}
                                                </td>
                                                <td
                                                    className="px-4 py-3 whitespace-nowrap text-sm"
                                                    style={{
                                                        color: COLORS.text,
                                                    }}
                                                >
                                                    {startup.stage || "N/A"}
                                                </td>
                                                <td
                                                    className="px-4 py-3 whitespace-nowrap text-sm"
                                                    style={{
                                                        color: COLORS.text,
                                                    }}
                                                >
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                                                            style={{
                                                                color: COLORS.dimText,
                                                            }}
                                                            title="More Options"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setExpandedMatch(
                                                                    expandedMatch ===
                                                                        startup.id
                                                                        ? null
                                                                        : startup.id
                                                                );
                                                            }}
                                                        >
                                                            <MoreHorizontal
                                                                size={16}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedMatch === startup.id && (
                                                <tr
                                                    className=""
                                                    style={{
                                                        backgroundColor:
                                                            COLORS.panelBg,
                                                    }}
                                                >
                                                    <td
                                                        colSpan="6"
                                                        className="px-4 py-3"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                            <div>
                                                                <p
                                                                    className="font-medium"
                                                                    style={{
                                                                        color: COLORS.text,
                                                                    }}
                                                                >
                                                                    Contact
                                                                    Person
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        color: COLORS.dimText,
                                                                    }}
                                                                >
                                                                    {startup.contact_person_name ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p
                                                                    className="font-medium"
                                                                    style={{
                                                                        color: COLORS.text,
                                                                    }}
                                                                >
                                                                    Revenue
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        color: COLORS.dimText,
                                                                    }}
                                                                >
                                                                    $
                                                                    {startup.revenue_last_12_months ||
                                                                        "0"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p
                                                                    className="font-medium"
                                                                    style={{
                                                                        color: COLORS.text,
                                                                    }}
                                                                >
                                                                    Impact Areas
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        color: COLORS.dimText,
                                                                    }}
                                                                >
                                                                    {startup.social_impact_areas ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>
                                                            <div className="md:col-span-3 flex justify-end space-x-2 pt-2">
                                                                <button
                                                                    className="px-3 py-1 text-xs rounded-md transition-colors"
                                                                    style={{
                                                                        backgroundColor:
                                                                            COLORS.primary,
                                                                        color: "white",
                                                                    }}
                                                                    onClick={() =>
                                                                        (window.location.href = `mailto:${startup.contact_person_email}`)
                                                                    }
                                                                >
                                                                    Contact
                                                                </button>
                                                                <button
                                                                    className="px-3 py-1 text-xs border rounded-md transition-colors hover:bg-gray-50"
                                                                    style={{
                                                                        borderColor:
                                                                            COLORS.border,
                                                                        color: COLORS.text,
                                                                    }}
                                                                    onClick={() =>
                                                                        alert(
                                                                            `Saving ${startup.startup_name}...`
                                                                        )
                                                                    }
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Metric Breakdown */}
                <div
                    className="mt-5 rounded-xl overflow-hidden border"
                    style={{
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        backgroundColor: COLORS.background,
                        borderColor: COLORS.border,
                    }}
                >
                    <div
                        className="p-4 border-b"
                        style={{ borderColor: COLORS.border }}
                    >
                        <h3
                            className="text-xs font-semibold uppercase tracking-wider flex items-center"
                            style={{ color: COLORS.dimText }}
                        >
                            <ChevronDown
                                size={14}
                                className="mr-2"
                                style={{ color: COLORS.primary }}
                            />
                            Detailed Metric Breakdown
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            {matchingMetrics.map((metric, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className={`w-full h-2 rounded-full mb-2 transition-all duration-1000 ease-out ${
                                            pulsing && index === 3
                                                ? "scale-110"
                                                : ""
                                        }`}
                                        style={{
                                            background: `linear-gradient(to right, ${
                                                metric.value >= 80
                                                    ? COLORS.primary
                                                    : metric.value >= 70
                                                    ? COLORS.chart1
                                                    : metric.value >= 60
                                                    ? COLORS.warning
                                                    : COLORS.danger
                                            } ${metric.value}%, ${
                                                COLORS.border
                                            } ${metric.value}%)`,
                                            boxShadow:
                                                pulsing && index === 3
                                                    ? `0 0 8px ${COLORS.primary}40`
                                                    : "none",
                                        }}
                                    ></div>
                                    <div
                                        className="text-sm font-medium text-center"
                                        style={{ color: COLORS.text }}
                                    >
                                        {metric.metric}
                                    </div>
                                    <div
                                        className="text-xs text-center"
                                        style={{ color: COLORS.dimText }}
                                    >
                                        {metric.value}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TujitumeWhiteThemeDashboard;