import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    Award,
    DollarSign,
    TrendingUp,
    Filter,
    Search,
    ChevronRight,
    MapPin,
    Star,
    Zap,
    Globe,
    Rocket,
    Loader,
    BarChart3,
    Clock,
    Calendar,
    Compass,
    PieChart,
    ArrowUpRight,
    BellRing,
    UserPlus,
    Sparkles,
} from "lucide-react";
import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axiosClient";

const TujitumeDashboard = () => {
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [animateStats, setAnimateStats] = useState(false);
    const [animateHeader, setAnimateHeader] = useState(false);
    const {
        totalFunds,
        availableFunds,
        setTotalFunds,
        setAvailableFunds,
        user,
        setSuccessrate,
        successrate,
        setAvgmatchscore,
        avgmatchscore,
        totalfunds,
        setTotalfunds,
        avgscore,
        setAvgscore,
    } = useStateContext();

    const [grants, setGrants] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    const [capitalOpportunities, setCapitalOpportunities] = useState([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({
        totalFunding: 0,
        successRate: 0,
        avgMatchScore: 0,
        growthRate: 0,
        recentActivity: 0,
    });
    const [isLoading, setIsLoading] = useState({
        grants: true,
        capital: true,
        statsCards: true,
        impactData: true,
    });

    // Refs for animation
    const headerRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        setShowMenu(false); // close dropdown after clicking
    };
    const [grantsData, setGrantsData] = useState(null);
    const [investmentsData, setInvestmentsData] = useState(null);

    // You can use this to trigger re-fetching manually if needed
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const fetchGrantsData = async () => {
        try {
            const response = await axiosClient.get("/grant/analytics");
            return response.data;
        } catch (err) {
            //console.error("Failed to fetch grant analytics:", err);
            throw err;
        }
    };

    const fetchInvestmentsData = async () => {
        try {
            const response = await axiosClient.get("/capital/analytics");
            return response.data;
        } catch (err) {
            //console.error("Failed to fetch investment analytics:", err);
            throw err;
        }
    };

    const fetchAllData = async () => {
        try {
            const grants = await fetchGrantsData();
            const investments = await fetchInvestmentsData();
            setGrantsData(grants);
            setInvestmentsData(investments);

            if (user.investor === 2) {
                setAvgscore(grants?.avg_score || 0);
            } else if (user.investor === 3) {
                setAvgscore(investments?.avg_score || 0);
            }

            // console.log("silewitena:", grants?.breakdown);
            // console.log("Investments Data:", investments);
        } catch (err) {
            // console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [refreshTrigger]); // Only runs on mount or when `refreshTrigger` changes

    // OR use conditional logging
    useEffect(() => {
        if (grantsData) {
            //console.log("silewitena:", grantsData.breakdown);
        }
        if (investmentsData) {
            //console.log("Investments Data:", investmentsData);
        }
    }, [grantsData, investmentsData]);

    // Remove these lines that are causing the error:
    // //console.log("silewitena:", grantsData.breakdown);
    // //console.log("Investments Data:", investmentsData);

    useEffect(() => {
        // Trigger animations
        const statsTimer = setTimeout(() => {
            setAnimateStats(true);
            setIsLoading((prev) => ({ ...prev, statsCards: false }));
        }, 500);

        const headerTimer = setTimeout(() => {
            setAnimateHeader(true);
        }, 100);

        // Fetch data
        fetchGrants();
        fetchCapitalOffers();

        // Simulate loading for impact section
        setTimeout(() => {
            setIsLoading((prev) => ({ ...prev, impactData: false }));
        }, 1000);

        return () => {
            clearTimeout(statsTimer);
            clearTimeout(headerTimer);
        };
    }, []);
    //console.log("GRANTHEFTAOUTO:", grantsData);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axiosClient.get("/checkAuth");

                if (data?.user) {
                    setTotalFunds(data.total_funds || 0);
                    setAvailableFunds(data.available_funds || 0);
                    setSuccessrate(data.success_rate || 0);
                    setAvgmatchscore(data.avg_match_score || 0);
                    setTotalfunds(data.total_funds || 0);

                    if (data.user.investor === 1) {
                        navigate("/dashboard");
                    }
                }
            } catch (error) {
                //console.error("Auth fetch error:", error);
            }
        };

        fetchUserData();
    }, []);

    // Fetch user data

    const fetchGrants = async () => {
        setIsLoading((prev) => ({ ...prev, grants: true }));
        try {
            const response = await axiosClient.get("/grant/grants");
            const rawData = Array.isArray(response.data?.grants)
                ? response.data.grants
                : [];

            const cleanedData = rawData.map((grant) => ({
                id: grant.id,
                type: "grant",
                title: grant.grant_title || "Untitled Grant",
                organization: grant.organization || "Unknown Organization",
                amount: grant.funding_per_business
                    ? parseInt(grant.funding_per_business.replace(/,/g, ""))
                    : grant.total_grant_amount
                    ? parseInt(grant.total_grant_amount.replace(/,/g, ""))
                    : 0,
                sector: grant.grant_focus || "General",
                matchScore: Math.floor(Math.random() * 30) + 70,
                status:
                    grant.application_deadline &&
                    new Date(grant.application_deadline) > new Date()
                        ? "Open"
                        : "Closed",
                impact: [
                    (grant.grant_focus || "").split(",")[0] || "Innovation",
                    "Economic Growth",
                ],
                region: grant.regions?.[0] || "Multiple Regions",
                dateAdded: grant.created_at || new Date().toISOString(),
                deadlineDate: grant.application_deadline || null,
            }));

            setGrants(cleanedData);
        } catch (err) {
            //console.error("Failed to fetch grants:", err);
        } finally {
            setIsLoading((prev) => ({ ...prev, grants: false }));
        }
    };

    const fetchCapitalOffers = async () => {
        setIsLoading((prev) => ({ ...prev, capital: true }));
        try {
            const response = await axiosClient.get("capital/capital-offers");
            const data = response.data?.capital || [];
            //console.log("Raw Grants API Data:", response.data);

            if (Array.isArray(data)) {
                const cleanedData = data.map((opportunity) => ({
                    id: opportunity.id,
                    type: "investment",
                    title: opportunity.offer_title || "Untitled Opportunity",
                    organization: opportunity.user_id || "Unknown Organization",
                    amount:
                        parseFloat(opportunity.total_capital_available) || 0,
                    sector: opportunity.sectors || "General",
                    matchScore: Math.floor(Math.random() * 30) + 70,
                    status: opportunity.visible ? "Open" : "Closed",
                    impact: (opportunity.sectors || "")
                        .split(",")
                        .map((sector) => sector.trim()) || ["General Impact"],
                    region: opportunity.regions || "Multiple Regions",
                    dateAdded:
                        opportunity.created_at || new Date().toISOString(),
                    investmentType: opportunity.investment_type || "Equity",
                }));

                setCapitalOpportunities(cleanedData);
            }
        } catch (err) {
            //console.error("Failed to fetch capital offers:", err);
        } finally {
            setIsLoading((prev) => ({ ...prev, capital: false }));
        }
    };

    const opportunities = useMemo(
        () => [...grants, ...capitalOpportunities],
        [grants, capitalOpportunities]
    );
    //console.log("Opportunities:", opportunities);

    // Process opportunities for dashboard metrics
    useEffect(() => {
        if (opportunities.length > 0) {
            const totalFunding = opportunities.reduce(
                (sum, opp) => sum + (opp.amount || 0),
                0
            );
            const averageMatch = Math.round(
                opportunities.reduce((sum, opp) => sum + opp.matchScore, 0) /
                    opportunities.length
            );

            // Calculate recent activity (opportunities added in last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentOppCount = opportunities.filter(
                (opp) => new Date(opp.dateAdded) > thirtyDaysAgo
            ).length;

            const activeOpps = opportunities.filter(
                (opp) => opp.status === "Open"
            ).length;
            const successRate = Math.round(
                (activeOpps / opportunities.length) * 100
            );

            setDashboardMetrics({
                totalFunding,
                successRate,
                avgMatchScore: averageMatch,
                growthRate: opportunities.length > 3 ? 5.2 : 0.0, // Simulated growth rate
                recentActivity: recentOppCount,
            });
        }
    }, [opportunities]);

    const filteredOpportunities = useMemo(() => {
        // Enforce investor type restrictions first
        const enforcedFilter =
            user.investor === 2
                ? "grant"
                : user.investor === 3
                ? "investment"
                : filter;

        // Select source based on enforced filter
        const source =
            enforcedFilter === "grant"
                ? grants
                : enforcedFilter === "investment"
                ? capitalOpportunities
                : [...grants, ...capitalOpportunities];

        return source
            .filter((opp) =>
                opp.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 3);
    }, [filter, searchTerm, grants, capitalOpportunities, user.investor]);
    console.log("Filtered Opportunities:", filteredOpportunities);

    // Extract sectors from opportunities for impact statistics
    const sectors = useMemo(() => {
        const allSectors = opportunities
            .map((opp) =>
                typeof opp.sector === "string"
                    ? opp.sector.split(",").map((s) => s.trim())
                    : [opp.sector]
            )
            .flat()
            .filter(Boolean);

        const sectorCounts = allSectors.reduce((acc, sector) => {
            acc[sector] = (acc[sector] || 0) + 1;
            return acc;
        }, {});

        // Convert to percentages
        const total = Object.values(sectorCounts).reduce(
            (sum, count) => sum + count,
            0
        );
        return Object.entries(sectorCounts)
            .map(([name, count]) => ({
                name,
                percentage: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3); // Top 3 sectors
    }, [opportunities]);

    // Extract regions from opportunities
    const regions = useMemo(() => {
        const allRegions = opportunities
            .map((opp) => opp.region)
            .filter(Boolean);
        const regionCounts = allRegions.reduce((acc, region) => {
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(regionCounts)
            .map(([name, count]) => ({
                name,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [opportunities]);

    // Upcoming deadlines
    // const upcomingDeadlines = useMemo(() => {
    //     const today = new Date();
    //     return grants
    //         .filter(
    //             (grant) =>
    //                 grant.deadlineDate && new Date(grant.deadlineDate) > today
    //         )
    //         .sort((a, b) => new Date(a.deadlineDate) - new Date(b.deadlineDate))
    //         .slice(0, 2);
    // }, [grants]);
   

    
    const upcomingDeadlines = [
        {
            title: "AgriFund 2025",
            deadlineDate: "2025-07-10",
            organization: "Kenya AgriCapital",
            amount: 15000,
            link: "https://example.com/agri-fund",
        },
        {
            title: "Youth Empowerment Grant",
            deadlineDate: "2025-07-15",
            organization: "YouthBank Africa",
            amount: 10000,
            link: "https://example.com/youth-grant",
        },
    ];
    

    const sortedDeadlines = [...upcomingDeadlines].sort(
        (a, b) =>
            new Date(a.deadlineDate).getTime() -
            new Date(b.deadlineDate).getTime()
    );

    const [currentIndex, setCurrentIndex] = useState(0);

    const futureDeadlines = upcomingDeadlines
        .filter((d) => new Date(d.deadlineDate) > new Date())
        .sort((a, b) => new Date(a.deadlineDate) - new Date(b.deadlineDate));

    useEffect(() => {
        if (futureDeadlines.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % futureDeadlines.length
            );
        }, 15000);

        return () => clearInterval(interval);
    }, [futureDeadlines]);

    const current = futureDeadlines[currentIndex];
  

    const statsCards = [
        {
            icon: <Award className="text-blue-600" />,
            title: "Total Opportunities",
            value: opportunities.length.toString(),
            subtext: `${
                new Set(opportunities.map((o) => o.sector)).size
            } Active Sectors`,
            trend: "+3 this month",
            trendUp: true,
        },
        {
            icon: <DollarSign className="text-green-600" />,
            title: !user.investor
                ? "Total Funding Accepted"
                : "Total Funding Disbursed",

            value: `$${(!user.investor
                ? totalfunds
                : totalFunds
            ).toLocaleString()}`, // Show relevant total based on user type

            subtext: "Available Capital",
            trend: `+${dashboardMetrics.growthRate}%`,
            trendUp: dashboardMetrics.growthRate > 0,
        },
        !user.investor
            ? {
                  icon: <Star className="text-yellow-600" />,
                  title: "Success Rate",
                  value: `${successrate}%`,
                  subtext: "Average Match Score",
                  trend: `${avgmatchscore}% match`,
                  trendUp: dashboardMetrics.avgMatchScore > 70,
              }
            : {
                  icon: <Star className="text-emerald-600" />,
                  title: "Match Score",
                  value: `${avgscore}%`,
                  subtext: "Your Average Match",
                  trend: `${avgscore}% match`,
                  trendUp: dashboardMetrics.avgMatchScore > 70,
              },
    ];

    // Skeleton loaders
    const CardSkeleton = () => (
        <div className="bg-white rounded-xl p-5 flex items-start space-x-4 border border-gray-100 animate-pulse">
            <div className="bg-gray-200 p-3 rounded-lg h-12 w-12"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                <div className="h-6 bg-gray-200 rounded mb-1 w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    );

    const OpportunityCardSkeleton = () => (
        <div className="bg-white border border-neutral-100 rounded-lg p-4 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="w-3/4">
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="mb-4 flex space-x-1">
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="border-t pt-3 flex justify-between">
                <div>
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div>
                    <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
    

    const ImpactSectionSkeleton = () => (
        <div className="p-4 rounded-lg border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-slate-50 via-neutral-50 to-neutral-100 text-neutral-900 min-h-screen">
            {/* Futuristic Header Section */}
            <div
                ref={headerRef}
                className={`relative bg-gradient-to-r from-slate-900 via-green-950 to-slate-800 text-white py-8 px-6 rounded-3xl overflow-hidden transition-all duration-700 transform ${
                    animateHeader
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-10 opacity-0"
                }`}
            >
                {/* Background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div className="animate-fadeIn">
                            <div className="flex items-center mb-1">
                                <Sparkles
                                    className="text-yellow-400 mr-3"
                                    size={22}
                                />
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-yellow-300">
                                    {user.investor === 2
                                        ? "Tujitume Grants Hub"
                                        : user.investor === 3
                                        ? "Tujitume Capital Hub"
                                        : "Tujitume Funding Hub"}
                                </h1>
                            </div>
                            <div className="flex items-center ml-1">
                                <div className="h-8 w-1 bg-gradient-to-b from-green-500 to-transparent rounded-full mr-3"></div>
                                <div>
                                    <div className="text-slate-300 text-sm flex items-center">
                                        {user.investor === 2
                                            ? "Empowering African Social Impact"
                                            : user.investor === 3
                                            ? "Fueling African Business Growth"
                                            : "Powering African Startup Ecosystems"}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 flex items-center">
                                        <Clock size={12} className="mr-1" />{" "}
                                        Last updated:{" "}
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-1.5 border border-white border-opacity-20">
                <div className="flex items-center text-xs">
                  <div className="px-3 py-1.5 rounded-lg flex items-center">
                    <BellRing size={14} className="text-yellow-300 mr-1.5" />
                    <span className="text-green-100">{dashboardMetrics.recentActivity} New</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg flex items-center">
                    <UserPlus size={14} className="text-blue-300 mr-1.5" />
                    <span className="text-green-100">5 Matches</span>
                  </div>
                </div>
              </div> */}

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={
                                        user.investor === 2
                                            ? "Search grants..."
                                            : user.investor === 3
                                            ? "Search investments..."
                                            : "Search opportunities"
                                    }
                                    className="pl-9 pr-4 py-2.5 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-sm w-64 shadow-sm focus:ring-2 focus:ring-green-400 focus:bg-opacity-20 backdrop-filter backdrop-blur-lg text-white transition"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <Search
                                    className="absolute left-3 top-3 text-green-300"
                                    size={16}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick stats row */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-md rounded-lg p-3 border border-white border-opacity-10 flex items-center">
                            <div className="bg-white bg-opacity-10 p-2 rounded-lg mr-3">
                                <BarChart3
                                    size={16}
                                    className="text-green-400"
                                />
                            </div>
                            <div>
                                <div className="text-xs text-slate-300">
                                    Opportunities
                                </div>
                                <div className="text-lg font-semibold text-white">
                                    {opportunities.length}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-md rounded-lg p-3 border border-white border-opacity-10 flex items-center">
                            <div className="bg-white bg-opacity-10 p-2 rounded-lg mr-3">
                                <DollarSign
                                    size={16}
                                    className="text-yellow-400"
                                />
                            </div>
                            <div>
                                <div className="text-xs text-slate-300">
                                    Available Funding
                                </div>
                                <div className="text-lg font-semibold text-white">
                                    ${availableFunds.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-md rounded-lg p-3 border border-white border-opacity-10 flex items-center relative">
                            <div className="bg-white bg-opacity-10 p-2 rounded-lg mr-3">
                                <Calendar size={16} className="text-blue-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-300">
                                    Upcoming Deadline
                                </div>
                                {current ? (
                                    <>
                                        <div className="text-sm font-semibold text-white line-clamp-1">
                                            {current.title}
                                        </div>
                                        <div className="text-xs text-blue-200 mt-0.5">
                                            {new Date(
                                                current.deadlineDate
                                            ).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            })}{" "}
                                            —{" "}
                                            {Math.ceil(
                                                (new Date(
                                                    current.deadlineDate
                                                ) -
                                                    new Date()) /
                                                    (1000 * 60 * 60 * 24)
                                            )}{" "}
                                            day
                                            {Math.ceil(
                                                (new Date(
                                                    current.deadlineDate
                                                ) -
                                                    new Date()) /
                                                    (1000 * 60 * 60 * 24)
                                            ) !== 1
                                                ? "s"
                                                : ""}{" "}
                                            left
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-white text-sm mt-1">
                                        No upcoming deadlines
                                    </div>
                                )}
                            </div>

                            {/* Dotted separator at the bottom */}
                            <div className="absolute bottom-0 left-3 right-3 border-t border-dotted border-white/30 mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="container mx-auto py-6 mt-2">
                {/* Stats Cards */}
                <section className="grid md:grid-cols-3 gap-5 mb-8">
                    {isLoading.statsCards ? (
                        <>
                            <CardSkeleton />
                            <CardSkeleton />
                            <CardSkeleton />
                        </>
                    ) : (
                        statsCards.map((card, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl p-5 flex items-start space-x-4 border border-gray-100 hover:border-green-100 hover:shadow-md transition-all duration-300 ${
                                    animateStats
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-4 opacity-0"
                                } ${index === 1 ? "ring-1 ring-green-50" : ""}`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <div
                                    className={`p-3 rounded-lg ${
                                        index === 0
                                            ? "bg-blue-50 text-blue-600"
                                            : index === 1
                                            ? "bg-green-50 text-green-600"
                                            : "bg-yellow-50 text-yellow-600"
                                    } shadow-xs`}
                                >
                                    {React.cloneElement(card.icon, {
                                        size: 20,
                                    })}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        {card.title}
                                    </p>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-0.5">
                                        {card.value}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            {card.subtext}
                                        </p>
                                        <span
                                            className={`text-xs font-normal px-1.5 py-0.5 rounded inline-flex items-center ${
                                                card.trendUp
                                                    ? "text-green-600 bg-green-50"
                                                    : "text-red-600 bg-red-50"
                                            }`}
                                        >
                                            {card.trendUp ? (
                                                <svg
                                                    className="w-3 h-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-3 h-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                    />
                                                </svg>
                                            )}
                                            {card.trend}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>

                {/* Opportunities Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex items-center">
                            <Zap className="mr-2 text-yellow-500" size={20} />
                            Active Opportunities
                        </h2>
                        <div className="flex space-x-2">
                            {["all", "grant", "investment"].map((type) =>
                                (user.investor === 2 &&
                                    type === "investment") ||
                                (user.investor === 3 &&
                                    type === "grant") ? null : (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider transition ${
                                            filter === type
                                                ? "bg-gradient-to-r from-slate-600 to-green-600 text-white shadow-sm"
                                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {isLoading.grants || isLoading.capital ? (
                        <div className="grid md:grid-cols-3 gap-4">
                            <OpportunityCardSkeleton />
                            <OpportunityCardSkeleton />
                            <OpportunityCardSkeleton />
                        </div>
                    ) : filteredOpportunities.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-4">
                            {filteredOpportunities.map((opp, idx) => (
                                <div
                                    key={opp.id}
                                    className="bg-white border border-neutral-100 rounded-lg p-4 hover:shadow-xl transition transform hover:-translate-y-2 group relative overflow-hidden"
                                    style={{ transitionDelay: `${idx * 75}ms` }}
                                >
                                    {/* Status indicator line */}
                                    <div
                                        className={`absolute top-0 left-0 w-1 h-full ${
                                            opp.status === "Open"
                                                ? "bg-green-500"
                                                : opp.status === "Closed"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }`}
                                    ></div>

                                    <div className="flex justify-between items-start mb-4 pl-2">
                                        <div>
                                            <h3 className="font-semibold text-neutral-800 mb-1 group-hover:text-blue-600 transition line-clamp-1">
                                                {opp.title}
                                            </h3>
                                            <span className="text-xs text-neutral-500 uppercase flex items-center">
                                                <MapPin
                                                    size={12}
                                                    className="mr-1 text-neutral-400"
                                                />
                                                {opp.region}
                                            </span>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                opp.status === "Open"
                                                    ? "bg-green-50 text-green-700"
                                                    : opp.status === "Closed"
                                                    ? "bg-red-50 text-red-700"
                                                    : "bg-yellow-50 text-yellow-700"
                                            }`}
                                        >
                                            {opp.status}
                                        </span>
                                    </div>

                                    <div className="mb-4 pl-2">
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {opp.impact
                                                .slice(0, 2)
                                                .map((impact, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                                                    >
                                                        {impact}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center border-t pt-3 pl-2">
                                        <div className="text-sm">
                                            <div className="text-neutral-600 flex items-center">
                                                <DollarSign
                                                    size={14}
                                                    className="mr-1 text-green-500"
                                                />
                                                Amount
                                            </div>
                                            <div className="font-semibold">
                                                ${opp.amount.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <div className="text-neutral-600 flex items-center">
                                                <Star
                                                    size={14}
                                                    className="mr-1 text-yellow-500"
                                                />
                                                Match
                                            </div>
                                            <div className="font-semibold text-neutral-800">
                                                {opp.matchScore}%
                                            </div>
                                        </div>
                                        <button className="p-2 text-neutral-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg border border-neutral-100">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-neutral-100 mb-4">
                                <Search
                                    className="text-neutral-400"
                                    size={24}
                                />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-800 mb-2">
                                No opportunities found
                            </h3>
                            <p className="text-neutral-500 text-sm">
                                Try adjusting your search or filters to find
                                more opportunities
                            </p>
                        </div>
                    )}
                </section>

                {/* Enhanced Impact Snapshot Section */}
                <section className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-5 pointer-events-none">
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                <pattern
                                    id="grid"
                                    width="8"
                                    height="8"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <path
                                        d="M 8 0 L 0 0 0 8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="0.5"
                                    />
                                </pattern>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#grid)"
                            />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-1 flex items-center">
                                    <Globe
                                        className="mr-2 text-yellow-600"
                                        size={18}
                                    />
                                    Impact Snapshot
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Funding impact across sectors and regions
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                {/* <div className="text-xs text-gray-500 flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                                    Grants
                                </div>
                                <div className="text-xs text-gray-500 flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                                    Investments
                                </div> */}
                            </div>
                        </div>

                        {isLoading.impactData ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <ImpactSectionSkeleton />
                                <ImpactSectionSkeleton />
                                <ImpactSectionSkeleton />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                {/* Sector Impact */}
                                {/* First Performance Metrics Section */}
                                <div className="border border-gray-100 rounded-lg p-4 bg-gradient-to-br from-white to-gray-50">
                                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                                        <PieChart
                                            className="mr-2 text-blue-500"
                                            size={16}
                                        />
                                        Performance Metrics
                                    </h3>

                                    <div className="space-y-3">
                                        {/* Sector */}
                                        <div className="flex items-center">
                                            <div className="w-full">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">
                                                        Sector
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {user.investor === 2
                                                            ? grantsData
                                                                  ?.breakdown
                                                                  ?.sector || 0
                                                            : investmentsData
                                                                  ?.breakdown
                                                                  ?.sector || 0}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                user.investor ===
                                                                2
                                                                    ? grantsData
                                                                          ?.breakdown
                                                                          ?.sector ||
                                                                      0
                                                                    : investmentsData
                                                                          ?.breakdown
                                                                          ?.sector ||
                                                                      0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Geography */}
                                        <div className="flex items-center">
                                            <div className="w-full">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">
                                                        Geography
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {user.investor === 2
                                                            ? grantsData
                                                                  ?.breakdown
                                                                  ?.geo || 0
                                                            : investmentsData
                                                                  ?.breakdown
                                                                  ?.geo || 0}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                user.investor ===
                                                                2
                                                                    ? grantsData
                                                                          ?.breakdown
                                                                          ?.geo ||
                                                                      0
                                                                    : investmentsData
                                                                          ?.breakdown
                                                                          ?.geo ||
                                                                      0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stage */}
                                        <div className="flex items-center">
                                            <div className="w-full">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">
                                                        Stage
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {user.investor === 2
                                                            ? grantsData
                                                                  ?.breakdown
                                                                  ?.stage || 0
                                                            : investmentsData
                                                                  ?.breakdown
                                                                  ?.stage || 0}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                user.investor ===
                                                                2
                                                                    ? grantsData
                                                                          ?.breakdown
                                                                          ?.stage ||
                                                                      0
                                                                    : investmentsData
                                                                          ?.breakdown
                                                                          ?.stage ||
                                                                      0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Second Performance Metrics Section */}
                                <div className="border border-gray-100 rounded-lg p-4 bg-gradient-to-br from-white to-gray-50">
                                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                                        <PieChart
                                            className="mr-2 text-blue-500"
                                            size={16}
                                        />
                                        Performance Metrics
                                    </h3>

                                    <div className="space-y-3">
                                        {/* Revenue */}
                                        <div className="flex items-center">
                                            <div className="w-full">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">
                                                        Revenue
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {user.investor === 2
                                                            ? grantsData
                                                                  ?.breakdown
                                                                  ?.revenue || 0
                                                            : investmentsData
                                                                  ?.breakdown
                                                                  ?.revenue ||
                                                              0}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                user.investor ===
                                                                2
                                                                    ? grantsData
                                                                          ?.breakdown
                                                                          ?.revenue ||
                                                                      0
                                                                    : investmentsData
                                                                          ?.breakdown
                                                                          ?.revenue ||
                                                                      0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Team */}
                                        <div className="flex items-center">
                                            <div className="w-full">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">
                                                        Team
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {user.investor === 2
                                                            ? grantsData
                                                                  ?.breakdown
                                                                  ?.team || 0
                                                            : investmentsData
                                                                  ?.breakdown
                                                                  ?.team || 0}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                user.investor ===
                                                                2
                                                                    ? grantsData
                                                                          ?.breakdown
                                                                          ?.team ||
                                                                      0
                                                                    : investmentsData
                                                                          ?.breakdown
                                                                          ?.team ||
                                                                      0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Impact */}
                                        <div className="flex items-center">
                                            <div className="w-full">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">
                                                        Impact
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {user.investor === 2
                                                            ? grantsData
                                                                  ?.breakdown
                                                                  ?.impact || 0
                                                            : investmentsData
                                                                  ?.breakdown
                                                                  ?.impact || 0}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                user.investor ===
                                                                2
                                                                    ? grantsData
                                                                          ?.breakdown
                                                                          ?.impact ||
                                                                      0
                                                                    : investmentsData
                                                                          ?.breakdown
                                                                          ?.impact ||
                                                                      0
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Upcoming Deadlines */}
                                <div className="border border-gray-100 rounded-lg p-4 bg-gradient-to-br from-white to-gray-50 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                                        <Clock
                                            className="mr-2 text-yellow-500"
                                            size={16}
                                        />
                                        Upcoming Deadlines
                                    </h3>

                                    {sortedDeadlines.length > 0 ? (
                                        <div className="max-h-40 overflow-y-auto pr-1 divide-y divide-dotted divide-gray-200">
                                            {sortedDeadlines.map(
                                                (deadline, idx) => {
                                                    const date = new Date(
                                                        deadline.deadlineDate
                                                    );
                                                    const daysLeft = Math.ceil(
                                                        (date.getTime() -
                                                            Date.now()) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24)
                                                    );
                                                    const status =
                                                        daysLeft <= 0
                                                            ? "Closed"
                                                            : daysLeft <= 3
                                                            ? "Closing Soon"
                                                            : "Open";

                                                    const statusClass =
                                                        status === "Closed"
                                                            ? "bg-red-100 text-red-600"
                                                            : status ===
                                                              "Closing Soon"
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : "bg-green-100 text-green-600";

                                                    return (
                                                        <div
                                                            key={idx}
                                                            onClick={() =>
                                                                navigate(
                                                                    "/dashboard/overview/grants/discover"
                                                                )
                                                            }
                                                            className="flex items-start space-x-3 py-3 cursor-pointer hover:bg-gray-50 rounded-md px-1 transition"
                                                        >
                                                            <div className="bg-gray-100 rounded-lg p-2 text-center flex-shrink-0 w-12">
                                                                <div className="text-xs text-gray-500">
                                                                    {date.toLocaleDateString(
                                                                        undefined,
                                                                        {
                                                                            month: "short",
                                                                        }
                                                                    )}
                                                                </div>
                                                                <div className="text-base font-semibold text-gray-800">
                                                                    {date.getDate()}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-medium line-clamp-1 text-gray-800">
                                                                    {
                                                                        deadline.title
                                                                    }
                                                                </h4>
                                                                <p className="text-xs text-gray-500">
                                                                    {
                                                                        deadline.organization
                                                                    }
                                                                </p>
                                                                <div className="mt-1 flex items-center space-x-2">
                                                                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                                                                        $
                                                                        {deadline.amount.toLocaleString()}
                                                                    </span>
                                                                    <span
                                                                        className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}
                                                                    >
                                                                        {status}
                                                                    </span>
                                                                    {daysLeft >
                                                                        0 && (
                                                                        <span className="text-xs text-gray-400">
                                                                            (
                                                                            {
                                                                                daysLeft
                                                                            }{" "}
                                                                            days
                                                                            left)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-yellow-50 mb-3">
                                                <Calendar
                                                    className="text-yellow-500"
                                                    size={18}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                No upcoming deadlines
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Actions Footer */}
                {user.investor !== 1 &&
                    user.investor !== 2 &&
                    user.investor !== 3 && (
                        <section className="mt-8 pb-8">
                            <div className="bg-gradient-to-r from-slate-800 to-green-800 text-white rounded-xl p-5 shadow-md">
                                <div className="flex flex-wrap items-center justify-between">
                                    <div className="mb-4 md:mb-0 md:w-1/2">
                                        <h3 className="font-semibold text-xl mb-1">
                                            Ready to grow your impact?
                                        </h3>
                                        <p className="text-slate-200 text-sm">
                                            Let our smart-matching system find
                                            the perfect funding opportunities
                                            for your project
                                        </p>
                                    </div>
                                    {/* <div className="flex space-x-3">
                <button className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-gray-100 transition">
                  <Rocket size={16} className="mr-2" />
                  Find Opportunities
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-green-700 transition">
                  <ArrowUpRight size={16} className="mr-2" />
                  Submit Application
                </button>
              </div> */}
                                    <div className="relative" ref={dropdownRef}>
                                        <div className="flex space-x-3">
                                            {/* Toggle Button */}
                                            <button
                                                className="bg-white dark:bg-gray-900 text-green-800 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                                onClick={() =>
                                                    setShowMenu(true)
                                                }
                                            >
                                                <Rocket
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                Find Opportunities
                                            </button>

                                            {showMenu && (
                                                <>
                                                    {/* Backdrop */}
                                                    <div
                                                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                                                        onClick={() =>
                                                            setShowMenu(false)
                                                        }
                                                    ></div>

                                                    {/* Modal */}
                                                    <div className="fixed inset-0 flex items-center justify-center z-50">
                                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 max-w-full p-4 relative">
                                                            {/* Close button (X icon) */}
                                                            <button
                                                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                                onClick={() =>
                                                                    setShowMenu(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-x"
                                                                >
                                                                    <path d="M18 6 6 18" />
                                                                    <path d="m6 6 12 12" />
                                                                </svg>
                                                            </button>

                                                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                                                Explore
                                                                Opportunities
                                                            </h2>

                                                            <button
                                                                className="w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm rounded-md flex items-center"
                                                                onClick={() => {
                                                                    handleNavigate(
                                                                        "/Dashboard/overview/grants/discover"
                                                                    );
                                                                    setShowMenu(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-wallet mr-2"
                                                                >
                                                                    <path d="M19 7V4a1 1 0 0 0-1-1H4a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                                                                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                                                                </svg>
                                                                Looking for
                                                                Grants
                                                            </button>

                                                            <button
                                                                className="w-full text-left mt-2 px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm rounded-md flex items-center"
                                                                onClick={() => {
                                                                    handleNavigate(
                                                                        "/Dashboard/overview/funding/investments"
                                                                    );
                                                                    setShowMenu(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-trending-up mr-2"
                                                                >
                                                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                                                    <polyline points="16 7 22 7 22 13" />
                                                                </svg>
                                                                Looking for
                                                                Investment
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Submit Button */}
                                            {/* <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-green-700 transition">
                                                <ArrowUpRight
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                Submit Application
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
            </div>
        </div>
    );
};

export default TujitumeDashboard;
