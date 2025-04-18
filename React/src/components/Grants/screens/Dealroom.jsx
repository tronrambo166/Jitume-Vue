import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    FileText,
    Users,
    MessageSquare,
    BarChart2,
    Settings,
    Download,
    Upload,
    Clock,
    Calendar,
    CheckCircle,
    XCircle,
    DollarSign,
    Percent,
    Globe,
    Lock,
    Send,
    Star,
    User,
    Award,
    MapPin,
    Leaf,
    Briefcase,
    Presentation,
} from "lucide-react";
import { useParams, Link, useLocation } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import { useStateContext } from "../../../contexts/contextProvider";
import PitchCard from "../components/pitchCard";

const DealRoomLayout = () => {
    const { opportunityId } = useParams();
    const location = useLocation();
    const [deal, setDeal] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [documents, setDocuments] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [investors, setInvestors] = useState([]);
    const [pitches, setPitches] = useState([]);
    const [isLoadingPitches, setIsLoadingPitches] = useState(false);
    const { user } = useStateContext();

    const [priorityFilters, setPriorityFilters] = useState({
        isWomenLed: false,
        isYouthLed: false,
        isRuralBased: false,
        usesLocalSourcing: false,
    });

    // Get opportunity data from location state if available
    const opportunityFromState = location.state?.opportunity;

    // Fetch pitches from API
    const fetchPitches = async () => {
        if (!opportunityId) {
            console.warn("⛔ No opportunityId found in route params");
            return;
        }

        console.log("🔍 Fetching pitches for opportunityId:", opportunityId);
        setIsLoadingPitches(true);

        try {
            const response = await axiosClient.get(
                `/capital/pitches/${opportunityId}`
            );

            // Log raw response
            console.log("✅ Full response object:", response);
            console.log("📦 Fetched pitch data:", response.data);

            // Try multiple possible data structures while keeping the API endpoint the same
            const pitchesArray = response?.data?.pitches
                ? response.data.pitches
                : Array.isArray(response?.data)
                ? response.data
                : response?.data?.data
                ? response.data.data
                : [];

            console.log("📊 Extracted pitches array:", pitchesArray);

            if (Array.isArray(pitchesArray)) {
                if (pitchesArray.length === 0) {
                    console.warn(
                        "⚠️ Pitches array is empty for opportunityId:",
                        opportunityId
                    );
                } else {
                    console.log(`✅ ${pitchesArray.length} pitches loaded.`);
                }

                setPitches(pitchesArray);
            } else {
                console.error(
                    "❌ Unexpected pitch response format. Data:",
                    response.data
                );
                setPitches([]);
            }
        } catch (error) {
            console.error("🚨 Error fetching pitches:", error);

            // Fallback dummy data for development
            setPitches([
                {
                    id: 1,
                    offer_title: "Seed Funding Pitch",
                    sectors: "AI,Healthcare",
                    date: "2023-04-15",
                    matchScore: 85,
                    status: "New",
                    favorite: false,
                },
                {
                    id: 2,
                    offer_title: "Series A Investment Deck",
                    sectors: "Fintech,SaaS",
                    date: "2023-09-22",
                    matchScore: 92,
                    status: "In Review",
                    favorite: true,
                },
            ]);
        } finally {
            setIsLoadingPitches(false);
        }
    };

    // Mock data fetch with investors and matching criteria
    useEffect(() => {
        let mockDeal;

        if (opportunityFromState) {
            // Use the opportunity data passed from the investor portal
            mockDeal = {
                ...opportunityFromState,
                id: opportunityFromState.id || opportunityId,
                name: opportunityFromState.name,
                stage: opportunityFromState.stage || "Seed",
                amount: opportunityFromState.amount || 250000,
                valuation: opportunityFromState.valuation || 1000000,
                equityOffered: opportunityFromState.equityOffered || "25%",
                sector: opportunityFromState.sector || "Agriculture",
                location: opportunityFromState.location || "Kenya",
                revenue: opportunityFromState.revenue || 75000,
                teamExperience: opportunityFromState.teamExperience || 5,
                impactScore: opportunityFromState.impactScore || 8,
                milestoneSuccess: opportunityFromState.milestoneSuccess || 75,
                documents: opportunityFromState.documents || [
                    {
                        id: 1,
                        name: "Pitch Deck",
                        type: "pdf",
                        uploaded: "2023-05-15",
                        size: "2.4 MB",
                    },
                    {
                        id: 2,
                        name: "Financial Model",
                        type: "xlsx",
                        uploaded: "2023-05-20",
                        size: "1.8 MB",
                    },
                    {
                        id: 3,
                        name: "Cap Table",
                        type: "pdf",
                        uploaded: "2023-06-01",
                        size: "3.2 MB",
                    },
                ],
                timeline: opportunityFromState.timeline || [
                    {
                        id: 1,
                        event: "Initial Pitch",
                        date: "2023-05-10",
                        completed: true,
                    },
                    {
                        id: 2,
                        event: "Due Diligence",
                        date: "2023-06-15",
                        completed: false,
                    },
                    {
                        id: 3,
                        event: "Term Sheet",
                        date: "2023-07-01",
                        completed: false,
                    },
                ],
                team: opportunityFromState.team || [
                    {
                        id: 1,
                        name: "Jane Muthoni",
                        role: "CEO",
                        joined: "2020",
                        email: "jane@example.com",
                    },
                    {
                        id: 2,
                        name: "David Omondi",
                        role: "CTO",
                        joined: "2021",
                        email: "david@example.com",
                    },
                ],
            };
        } else {
            // Fallback to mock data if no state was passed
            mockDeal = {
                id: opportunityId,
                name:
                    opportunityId === "1"
                        ? "Solar Farm Kenya"
                        : "AgriTech Tanzania",
                stage: opportunityId === "1" ? "Series A" : "Seed",
                amount: opportunityId === "1" ? 500000 : 250000,
                valuation: opportunityId === "1" ? 2500000 : 1000000,
                equityOffered: opportunityId === "1" ? "20%" : "25%",
                sector:
                    opportunityId === "1" ? "Renewable Energy" : "Agriculture",
                location: "Kenya",
                revenue: opportunityId === "1" ? 120000 : 75000,
                teamExperience: 5,
                impactScore: 8,
                milestoneSuccess: 75,
                documents: [
                    {
                        id: 1,
                        name: "Pitch Deck",
                        type: "pdf",
                        uploaded: "2023-05-15",
                        size: "2.4 MB",
                    },
                    {
                        id: 2,
                        name: "Financial Model",
                        type: "xlsx",
                        uploaded: "2023-05-20",
                        size: "1.8 MB",
                    },
                    {
                        id: 3,
                        name: "Cap Table",
                        type: "pdf",
                        uploaded: "2023-06-01",
                        size: "3.2 MB",
                    },
                ],
                timeline: [
                    {
                        id: 1,
                        event: "Initial Pitch",
                        date: "2023-05-10",
                        completed: true,
                    },
                    {
                        id: 2,
                        event: "Due Diligence",
                        date: "2023-06-15",
                        completed: false,
                    },
                    {
                        id: 3,
                        event: "Term Sheet",
                        date: "2023-07-01",
                        completed: false,
                    },
                ],
                team: [
                    {
                        id: 1,
                        name: "Jane Muthoni",
                        role: "CEO",
                        joined: "2020",
                        email: "jane@example.com",
                    },
                    {
                        id: 2,
                        name: "David Omondi",
                        role: "CTO",
                        joined: "2021",
                        email: "david@example.com",
                    },
                ],
            };
        }

        const mockInvestors = [
            {
                id: 1,
                name: "Green Energy Ventures",
                type: "VC Firm",
                sectors: ["Renewable Energy", "Agriculture"],
                investmentRange: "$100k - $1M",
                stage: ["Seed", "Series A"],
                location: ["Kenya", "Tanzania"],
                minRevenue: 50000,
                teamThreshold: 3,
                impactThreshold: 5,
                contactEmail: "contact@greenenergy.vc",
            },
            {
                id: 2,
                name: "AgriTech Angels",
                type: "Angel Network",
                sectors: ["Agriculture", "Tech"],
                investmentRange: "$50k - $500k",
                stage: ["Idea", "MVP", "Seed"],
                location: ["East Africa"],
                minRevenue: 0,
                teamThreshold: 2,
                impactThreshold: 7,
                contactEmail: "invest@agritechangels.com",
            },
            {
                id: 3,
                name: "Afrika Impact Fund",
                type: "Impact Investor",
                sectors: ["Agriculture", "Renewable Energy", "Tech"],
                investmentRange: "$200k - $2M",
                stage: ["Seed", "Growth"],
                location: ["Africa"],
                minRevenue: 100000,
                teamThreshold: 4,
                impactThreshold: 8,
                contactEmail: "info@afrikaimpact.org",
            },
        ];

        setDeal(mockDeal);
        setDocuments(mockDeal.documents || []);
        setTeamMembers(mockDeal.team || []);
        setTimeline(mockDeal.timeline || []);
        setInvestors(mockInvestors);

        // Initial mock messages
        setMessages([
            {
                id: 1,
                sender: "Jane Muthoni",
                text: "Hi team, I've updated the financial model. Please review.",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: 2,
                sender: "David Omondi",
                text: "Looks good. We should discuss the next steps.",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
        ]);

        // Fetch pitches
        fetchPitches();
    }, [opportunityId, opportunityFromState]);

    // Message sending handler
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: messages.length + 1,
                sender: "You",
                text: newMessage,
                timestamp: new Date().toISOString(),
            };
            setMessages([...messages, message]);
            setNewMessage("");

            // Simulate reply after 1-3 seconds
            if (Math.random() > 0.3) {
                const replyDelay = 1000 + Math.random() * 2000;
                setTimeout(() => {
                    const replies = [
                        "Thanks for your message!",
                        "We'll look into this and get back to you.",
                        "Can you provide more details?",
                        "That's an important point. Let's discuss in our next meeting.",
                        "I've noted this down for follow-up.",
                    ];
                    const randomReply =
                        replies[Math.floor(Math.random() * replies.length)];

                    const replyMessage = {
                        id: messages.length + 2,
                        sender:
                            Math.random() > 0.5
                                ? "Jane Muthoni"
                                : "David Omondi",
                        text: randomReply,
                        timestamp: new Date().toISOString(),
                    };
                    setMessages((prev) => [...prev, replyMessage]);
                }, replyDelay);
            }
        }
    };

    // Document upload handler
    const handleDocumentUpload = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf,.doc,.docx,.xlsx,.pptx";

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setUploading(true);

                // Simulate upload delay
                setTimeout(() => {
                    const newDoc = {
                        id: documents.length + 1,
                        name: file.name,
                        type: file.name.split(".").pop(),
                        uploaded: new Date().toISOString().split("T")[0],
                        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    };

                    setDocuments([...documents, newDoc]);
                    setUploading(false);

                    // Add system message about the upload
                    const systemMessage = {
                        id: messages.length + 1,
                        sender: "System",
                        text: `New document uploaded: ${file.name}`,
                        timestamp: new Date().toISOString(),
                    };
                    setMessages((prev) => [...prev, systemMessage]);
                }, 1500);
            }
        };

        fileInput.click();
    };

    // Document download handler
    const handleDocumentDownload = (doc) => {
        // In a real app, this would download the actual file
        // For demo purposes, we'll just show a message
        const activityMessage = {
            id: messages.length + 1,
            sender: "System",
            text: `You downloaded: ${doc.name}`,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, activityMessage]);

        alert(`Downloading ${doc.name}`);
    };

    // Document remove handler
    const handleDocumentRemove = (doc) => {
        if (window.confirm(`Are you sure you want to remove ${doc.name}?`)) {
            setDocuments(documents.filter((d) => d.id !== doc.id));

            const systemMessage = {
                id: messages.length + 1,
                sender: "System",
                text: `Document removed: ${doc.name}`,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, systemMessage]);
        }
    };

    // Toggle timeline item completion
    const toggleTimelineCompletion = (itemId) => {
        setTimeline(
            timeline.map((item) =>
                item.id === itemId
                    ? { ...item, completed: !item.completed }
                    : item
            )
        );
    };

    // Add new team member
    const addTeamMember = () => {
        const newMember = {
            id: teamMembers.length + 1,
            name: `New Member ${teamMembers.length + 1}`,
            role: "Team Member",
            joined: new Date().getFullYear().toString(),
            email: `newmember${teamMembers.length + 1}@example.com`,
        };
        setTeamMembers([...teamMembers, newMember]);

        const systemMessage = {
            id: messages.length + 1,
            sender: "System",
            text: `New team member added: ${newMember.name}`,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, systemMessage]);
    };

    // Contact investor
    const contactInvestor = (investorEmail) => {
        const subject = `Interest in ${deal.name} Investment Opportunity`;
        const body = `Dear Investor,\n\nI'm reaching out regarding potential investment in our ${deal.name} project.\n\nBest regards,\n[Your Name]`;
        window.open(
            `mailto:${investorEmail}?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`
        );
    };

    // Matching Algorithm (SWSF)
    const calculateMatchScore = (business, fund) => {
        let score = 0;

        // Sector Alignment (30%)
        if (fund.sectors.includes(business.sector)) {
            score += 30;
        }

        // Geographic Fit (15%)
        if (
            fund.location.includes(business.location) ||
            fund.location.includes("Africa")
        ) {
            score += 15;
        }

        // Startup Stage Compatibility (10%)
        if (fund.stage.includes(business.stage)) {
            score += 10;
        }

        // Revenue/Traction (10%)
        if (business.revenue >= fund.minRevenue) {
            score += 10;
        }

        // Team Experience (10%)
        if (business.teamExperience >= fund.teamThreshold) {
            score += 10;
        }

        // Impact Score (10%)
        if (business.impactScore >= fund.impactThreshold) {
            score += 10;
        }

        // Milestone Success (10%)
        if (business.milestoneSuccess >= 50) {
            score += 10;
        }

        // Documents Complete (5%)
        if (business.documents.length >= 3) {
            score += 5;
        }

        // Priority Filters Bonuses (max +20%)
        if (priorityFilters.isWomenLed) score += 5;
        if (priorityFilters.isYouthLed) score += 5;
        if (priorityFilters.isRuralBased) score += 5;
        if (priorityFilters.usesLocalSourcing) score += 5;

        return Math.min(score, 100);
    };

    const getMatchTier = (score) => {
        if (score >= 80) return "Ideal Match";
        if (score >= 60) return "Strong Match";
        return "Needs Revision";
    };
     const filteredPitches = pitches.filter((pitch) => {
         if (activeTab === "pending") return pitch.status === 0;
         if (activeTab === "accepted") return pitch.status === 1;
         return true;
     });

    // View pitch handler
    const viewPitch = (pitch) => {
        alert(`Viewing pitch: ${pitch.title}`);
        // In a real app, this would open the pitch details or presentation
    };

    // Investor Card Component
    const InvestorCard = ({ investor }) => {
        const score = calculateMatchScore(deal, investor);
        const tier = getMatchTier(score);

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{investor.name}</h3>
                        <p className="text-gray-600 text-sm">{investor.type}</p>
                    </div>
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tier === "Ideal Match"
                                ? "bg-green-50 text-green-700"
                                : tier === "Strong Match"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                        }`}
                    >
                        {score}% Match
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                        <Briefcase size={14} className="mr-1 text-gray-500" />
                        <span>{investor.investmentRange}</span>
                    </div>
                    <div className="flex items-center">
                        <Award size={14} className="mr-1 text-gray-500" />
                        <span>{investor.stage.join(", ")}</span>
                    </div>
                    <div className="flex items-center">
                        <Globe size={14} className="mr-1 text-gray-500" />
                        <span>{investor.location.join(", ")}</span>
                    </div>
                    <div className="flex items-center">
                        <Leaf size={14} className="mr-1 text-gray-500" />
                        <span>{investor.sectors.join(", ")}</span>
                    </div>
                </div>

                <button
                    onClick={() => contactInvestor(investor.contactEmail)}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                    Contact Investor
                </button>
            </div>
        );
    };

    {
        isLoadingPitches ? (
            <p>Loading pitches...</p>
        ) : Array.isArray(pitches) && pitches.length > 0 ? (
            pitches.map((pitch) => <PitchCard key={pitch.id} pitch={pitch} />)
        ) : (
            <p>No pitches available.</p>
        );
    }

    // Priority Filters Component
    const PriorityFilters = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
                Priority Filters (+5% each)
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={priorityFilters.isWomenLed}
                        onChange={() =>
                            setPriorityFilters((prev) => ({
                                ...prev,
                                isWomenLed: !prev.isWomenLed,
                            }))
                        }
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm flex items-center">
                        <User size={14} className="mr-1" /> Women-led
                    </span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={priorityFilters.isYouthLed}
                        onChange={() =>
                            setPriorityFilters((prev) => ({
                                ...prev,
                                isYouthLed: !prev.isYouthLed,
                            }))
                        }
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm flex items-center">
                        <Award size={14} className="mr-1" /> Youth-led
                    </span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={priorityFilters.isRuralBased}
                        onChange={() =>
                            setPriorityFilters((prev) => ({
                                ...prev,
                                isRuralBased: !prev.isRuralBased,
                            }))
                        }
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm flex items-center">
                        <MapPin size={14} className="mr-1" /> Rural-based
                    </span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={priorityFilters.usesLocalSourcing}
                        onChange={() =>
                            setPriorityFilters((prev) => ({
                                ...prev,
                                usesLocalSourcing: !prev.usesLocalSourcing,
                            }))
                        }
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm flex items-center">
                        <Leaf size={14} className="mr-1" /> Local sourcing
                    </span>
                </label>
            </div>
        </div>
    );

    if (!deal)
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 text-gray-900">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/grants-overview/funding/investments"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft size={20} />
                            </Link>

                            <div>
                                <h1 className="text-2xl font-bold">
                                    {deal.name} Deal Room
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {deal.stage} • $
                                    {deal.amount.toLocaleString()} •{" "}
                                    {deal.equityOffered} Equity
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Active
                            </span>
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <nav className="flex space-x-8 overflow-x-auto">
                        {[
                            {
                                name: "overview",
                                icon: BarChart2,
                                label: "Overview",
                            },
                            {
                                name: "investors",
                                icon: Briefcase,
                                label: "Investors",
                            },
                            {
                                name: "pitches",
                                icon: Presentation,
                                label: "Pitches",
                            },
                            {
                                name: "documents",
                                icon: FileText,
                                label: "Documents",
                            },
                            { name: "team", icon: Users, label: "Team" },
                            {
                                name: "communication",
                                icon: MessageSquare,
                                label: "Communication",
                            },
                        ].map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.name
                                        ? "border-green-500 text-green-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <tab.icon size={16} />
                                    <span>{tab.label}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-4 py-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="grid md:grid-cols-3 divide-x divide-gray-200">
                            {/* Key Metrics */}
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Key Metrics
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Valuation
                                        </p>
                                        <p className="text-xl font-semibold">
                                            ${deal.valuation.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Equity Offered
                                        </p>
                                        <p className="text-xl font-semibold">
                                            {deal.equityOffered}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Investment Amount
                                        </p>
                                        <p className="text-xl font-semibold">
                                            ${deal.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Deal Timeline
                                </h3>
                                <div className="space-y-4">
                                    {timeline.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start cursor-pointer"
                                            onClick={() =>
                                                toggleTimelineCompletion(
                                                    item.id
                                                )
                                            }
                                        >
                                            <div className="mr-3 mt-1">
                                                {item.completed ? (
                                                    <CheckCircle
                                                        size={16}
                                                        className="text-green-500"
                                                    />
                                                ) : (
                                                    <Clock
                                                        size={16}
                                                        className="text-yellow-500"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {item.event}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {messages
                                        .slice(-2)
                                        .reverse()
                                        .map((msg) => (
                                            <div
                                                key={msg.id}
                                                className="flex items-start"
                                            >
                                                <div className="mr-3 mt-1">
                                                    <MessageSquare
                                                        size={16}
                                                        className="text-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {msg.sender === "System"
                                                            ? "System notification"
                                                            : `${msg.sender}: ${msg.text}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(
                                                            msg.timestamp
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Investors Tab */}
                {activeTab === "investors" && (
                    <div className="space-y-6">
                        <PriorityFilters />
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {investors.map((investor) => (
                                <InvestorCard
                                    key={investor.id}
                                    investor={investor}
                                />
                            ))}
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">
                                Investment Matching Explanation
                            </h3>
                            <div className="space-y-3 text-sm">
                                <p>
                                    Our SWSF (Sector-Weighted Smart Filtering)
                                    algorithm matches your venture with
                                    potential investors based on:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <strong>Sector Alignment (30%):</strong>{" "}
                                        How well your business sector matches
                                        investor focus
                                    </li>
                                    <li>
                                        <strong>Geographic Fit (15%):</strong>{" "}
                                        Compatibility with investor's geographic
                                        preferences
                                    </li>
                                    <li>
                                        <strong>
                                            Stage Compatibility (10%):
                                        </strong>{" "}
                                        If your stage matches what the investor
                                        typically funds
                                    </li>
                                    <li>
                                        <strong>Revenue/Traction (10%):</strong>{" "}
                                        Meeting minimum revenue requirements
                                    </li>
                                    <li>
                                        <strong>Team Experience (10%):</strong>{" "}
                                        Team expertise and track record
                                    </li>
                                    <li>
                                        <strong>Impact Score (10%):</strong>{" "}
                                        Social/environmental impact rating
                                    </li>
                                    <li>
                                        <strong>
                                            Milestone Success (10%):
                                        </strong>{" "}
                                        Track record of meeting business
                                        milestones
                                    </li>
                                    <li>
                                        <strong>
                                            Documents Complete (5%):
                                        </strong>{" "}
                                        Having all required documentation
                                    </li>
                                </ul>
                                <p className="font-medium mt-3">
                                    Priority Filters can boost your match score
                                    by up to 20% with impact-focused investors.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pitches Tab */}
                {isLoadingPitches ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Investor Pitches
                            </h2>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab("pending")}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        activeTab === "pending"
                                            ? "bg-white shadow-sm text-gray-900"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setActiveTab("accepted")}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        activeTab === "accepted"
                                            ? "bg-white shadow-sm text-gray-900"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Accepted
                                </button>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPitches.map((pitch) => (
                                <PitchCard
                                    key={pitch.id}
                                    pitch={pitch}
                                    onStatusChange={(id, newStatus) => {
                                        // Update the pitch status in local state
                                        setPitches((prev) =>
                                            prev.map((p) =>
                                                p.id === id
                                                    ? {
                                                          ...p,
                                                          status:
                                                              newStatus ===
                                                              "accepted"
                                                                  ? 1
                                                                  : 0,
                                                      }
                                                    : p
                                            )
                                        );
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
                {filteredPitches.length === 0 && !isLoadingPitches && (
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
                        <Presentation
                            size={48}
                            className="mx-auto text-gray-400 mb-3"
                        />
                        <h3 className="text-lg font-medium mb-2">
                            {activeTab === "pending"
                                ? "No Pending Pitches"
                                : "No Accepted Pitches"}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {activeTab === "pending"
                                ? "You don't have any pending pitches at the moment."
                                : "You haven't accepted any pitches yet."}
                        </p>
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">
                                    Deal Documents
                                </h3>
                                <button
                                    onClick={handleDocumentUpload}
                                    disabled={uploading}
                                    className={`px-4 py-2 ${
                                        uploading
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                    } text-white rounded-md text-sm font-medium transition-colors flex items-center`}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>{" "}
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload
                                                size={16}
                                                className="mr-2"
                                            />{" "}
                                            Upload Document
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Size
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documents.map((doc) => (
                                            <tr
                                                key={doc.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {doc.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                                                    {doc.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doc.uploaded}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doc.size}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleDocumentDownload(
                                                                doc
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDocumentRemove(
                                                                doc
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {documents.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No documents uploaded yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {documents.length > 0 && (
                                <div className="mt-4 text-sm text-gray-500"></div>
                            )}
                        </div>
                    </div>
                )}

                {/* Team Tab */}
                {activeTab === "team" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">
                                    Team Members
                                </h3>
                                <button
                                    onClick={addTeamMember}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
                                >
                                    <Users size={16} className="mr-2" /> Add
                                    Team Member
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Join Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {teamMembers.map((member) => (
                                            <tr
                                                key={member.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-green-600 font-medium">
                                                            {member.name
                                                                .split(" ")
                                                                .map(
                                                                    (name) =>
                                                                        name[0]
                                                                )
                                                                .join("")}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {member.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {member.role}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {member.joined}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {member.email}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Communication Tab */}
                {activeTab === "communication" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium">
                                Deal Room Chat
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${
                                            msg.sender === "You"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`rounded-lg p-3 max-w-md ${
                                                msg.sender === "System"
                                                    ? "bg-gray-100 text-gray-700"
                                                    : msg.sender === "You"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-200 text-gray-800"
                                            }`}
                                        >
                                            {msg.sender !== "You" &&
                                                msg.sender !== "System" && (
                                                    <div className="font-bold text-sm">
                                                        {msg.sender}
                                                    </div>
                                                )}
                                            <p className="text-sm">
                                                {msg.text}
                                            </p>
                                            <div className="text-xs mt-1 opacity-70">
                                                {new Date(
                                                    msg.timestamp
                                                ).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
                                    className="flex-1 border-gray-300 focus:ring-green-500 focus:border-green-500 block w-full rounded-md sm:text-sm border p-2"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <Send size={16} className="mr-1" /> Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealRoomLayout;
