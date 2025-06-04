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
    Video,
    DownloadCloud,
    Eye,
    Layers,
    Layers2,
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
    const [count,setCount] = useState(0)
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

        // console.log("🔍 Fetching pitches for opportunityId:", opportunityId);
        setIsLoadingPitches(true);

        try {
            const response = await axiosClient.get(
                `/capital/pitches/${opportunityId}`
            );

            // Log raw response
            console.log("✅ Full response object:", response);
            // console.log("📦 Fetched pitch data:", response.data);

            // Try multiple possible data structures while keeping the API endpoint the same
            const pitchesArray = response?.data?.pitches
                ? response.data.pitches
                : Array.isArray(response?.data)
                ? response.data
                : response?.data?.data
                ? response.data.data
                : [];

            // console.log("📊 Extracted pitches array:", pitchesArray);
            setCount(pitchesArray.length);


            if (Array.isArray(pitchesArray)) {
                if (pitchesArray.length === 0) {
                    console.warn(
                        "⚠️ Pitches array is empty for opportunityId:",
                        opportunityId
                    );
                } else {
                    // console.log(`✅ ${pitchesArray.length} pitches loaded.`);
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
  const fetchDealData = async () => {
    try {
      // Fetch pitch data from your API
      const response = await axios.get(`/api/pitches/${opportunityId}`);
      const pitchData = response.data;

      // Transform the API data to match your expected structure
      const dealData = {
        id: pitchData.id,
        name: pitchData.startup_name,
        stage: pitchData.stage,
        amount: pitchData.total_amount_requested || 0,
        valuation: null, // Not in your data structure
        equityOffered: null, // Not in your data structure
        sector: pitchData.sector,
        location: pitchData.headquarters_location,
        revenue: pitchData.revenue_last_12_months,
        teamExperience: pitchData.team_experience_avg_years,
        impactScore: null, // Not in your data structure
        milestoneSuccess: null, // Not in your data structure
        documents: [
          pitchData.pitch_deck_file && {
            id: 1,
            name: "Pitch Deck",
            type: "pdf",
            uploaded: pitchData.created_at,
            size: "N/A", // You might need to get this from the server
            url: pitchData.pitch_deck_file
          },
          pitchData.business_plan && {
            id: 2,
            name: "Business Plan",
            type: "pdf",
            uploaded: pitchData.created_at,
            size: "N/A",
            url: pitchData.business_plan
          },
          pitchData.pitch_video && {
            id: 3,
            name: "Pitch Video",
            type: "mp4",
            uploaded: pitchData.created_at,
            size: "N/A",
            url: pitchData.pitch_video
          }
        ].filter(Boolean), // Remove null/undefined entries
        timeline: [], // Not in your data structure
        team: [] // Not in your data structure
      };

      setDeal(dealData);
      setDocuments(dealData.documents);
      
      // For fields not in your data structure, you might want to:
      // 1. Fetch additional data from other endpoints
      // 2. Set default values
      // 3. Leave them empty if not required
      
      setTeamMembers([]); // You might need to fetch this separately
      setTimeline([]); // You might need to fetch this separately

      // Fetch investors (this would come from a separate endpoint)
      const investorsResponse = await axios.get('/api/investors');
      setInvestors(investorsResponse.data);

      // Fetch messages (this would come from a separate endpoint)
      const messagesResponse = await axios.get(`/api/pitches/${opportunityId}/messages`);
      setMessages(messagesResponse.data);

    } catch (error) {
      console.error("Error fetching deal data:", error);
      // Fallback to mock data if API fails (optional)
      // ... your existing mock data logic ...
    }
  };

  if (opportunityFromState) {
    // If data is passed via state, use that
    const dealData = {
      ...opportunityFromState,
      documents: [
        opportunityFromState.pitch_deck_file && {
          id: 1,
          name: "Pitch Deck",
          type: "pdf",
          uploaded: opportunityFromState.created_at,
          url: opportunityFromState.pitch_deck_file
        },
        // ... other documents ...
      ].filter(Boolean)
    };
    setDeal(dealData);
    setDocuments(dealData.documents);
  } else {
    // Otherwise fetch from API
    fetchDealData();
  }

  // Fetch pitches list (if needed)
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
// console.log(filteredPitches)

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
                                to="/dashboard/overview/funding/investments"
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
                            },{
                                name: "pitches",
                                icon: Presentation,
                                label: (
                                    <>
                                        Pitches{" "}
                                        <span className="text-green-600 font-semibold">
                                            {count}
                                        </span>
                                    </>
                                ),
                            },
                           
                           
                            {
                                name: "documents",
                                icon: FileText,
                                label: "Documents",
                            },
                            { name: "team", icon: Users, label: "Team" },
                           
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
  <div className=" rounded-xl  overflow-hidden">
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                    {filteredPitches.map((pitch) => (
                        <PitchCard
                            key={pitch.id}
                            pitch={pitch}
                            onStatusChange={(id, newStatus) => {
                                setPitches((prev) =>
                                    prev.map((p) =>
                                        p.id === id
                                            ? {
                                                  ...p,
                                                  status:
                                                      newStatus === "accepted"
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
    <div className="grid bg-slate-300/50 md:grid-cols-3 divide-x divide-gray-200">
      {/* Key Metrics */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Match Score</p>
            <p className="text-xl font-semibold">
              {filteredPitches[0]?.score || 'N/A'}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sector</p>
            <p className="text-xl font-semibold">
              {filteredPitches[0]?.sector || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Stage</p>
            <p className="text-xl font-semibold">
              <span className={`px-2 py-1 rounded-full text-xs ${
                filteredPitches[0]?.stage === "Seed" ? "bg-green-100 text-green-800" :
                filteredPitches[0]?.stage === "Series A" ? "bg-blue-100 text-blue-800" :
                filteredPitches[0]?.stage === "Series B" ? "bg-purple-100 text-purple-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {filteredPitches[0]?.stage || 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Timeline - Using Real Date Information */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Dates</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <Calendar size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-xs text-gray-500">
                {filteredPitches[0]?.created_at ? new Date(filteredPitches[0].created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <Clock size={16} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-xs text-gray-500">
                {filteredPitches[0]?.updated_at ? new Date(filteredPitches[0].updated_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <Star size={16} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-gray-500">
                {filteredPitches[0]?.status === 1 ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Startup Details */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Startup Details</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <FileText size={16} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Startup Name</p>
              <p className="text-xs text-gray-500">
                {filteredPitches[0]?.startup_name || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <MapPin size={16} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-gray-500">
                {filteredPitches[0]?.headquarters_location || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <DollarSign size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Revenue (12M)</p>
              <p className="text-xs text-gray-500">
                ${filteredPitches[0]?.revenue_last_12_months ? parseFloat(filteredPitches[0].revenue_last_12_months).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



                {/* Investors Tab */}
                {/* {activeTab === "investors" && (
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
                )} */}

        {activeTab === "pitches" && (
    <>
        {/* Pitches Tab */}
        {isLoadingPitches ? (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        ) : (
            <>
                <h2 className="text-xl font-bold">Investor Pitches</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPitches.map((pitch) => (
                        <PitchCard
                            key={pitch.id}
                            pitch={pitch}
                            onStatusChange={(id, newStatus) => {
                                setPitches((prev) =>
                                    prev.map((p) =>
                                        p.id === id
                                            ? {
                                                  ...p,
                                                  status:
                                                      newStatus === "accepted"
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
    </>
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
  {filteredPitches.map((pitch) => (
    <tr key={pitch.id} className="hover:bg-gray-50">
      <td className="px-3 py-3 text-sm font-medium text-gray-900 max-w-0 min-w-0">
        <div className="truncate">{pitch.startup_name}</div>
      </td>
      
      <td className="px-3 py-3 text-sm text-gray-500 max-w-0 min-w-0">
        <div className="truncate">{pitch.sector}</div>
      </td>
      
      <td className="px-3 py-3 text-sm text-gray-500 max-w-0 min-w-0">
        <div className="truncate">{pitch.stage}</div>
      </td>
      
      <td className="px-3 py-3 text-sm text-gray-500 max-w-0 min-w-0">
        <div className="truncate">${pitch.revenue_last_12_months}</div>
      </td>
      
      <td className="px-3 py-3 max-w-0 min-w-0">
        <div className="flex flex-wrap gap-1">
          {pitch.pitch_deck_file && (
            <a
              href={`https://tujitume.com/${pitch.pitch_deck_file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
            >
              <FileText size={12} className="mr-1" />
              Deck
            </a>
          )}
          {pitch.business_plan && (
            <a
              href={`https://tujitume.com/${pitch.business_plan}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
            >
              <FileText size={12} className="mr-1" />
              Plan
            </a>
          )}
          {pitch.pitch_video && (
            <a
              href={`https://tujitume.com/${pitch.pitch_video}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
            >
              <Video size={12} className="mr-1" />
              Video
            </a>
          )}
        </div>
      </td>
      
      <td className="px-3 py-3 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleDownloadAll(pitch)}
            className="text-green-600 hover:text-green-900"
            title="Download all documents"
          >
            <DownloadCloud size={16} />
          </button>
          <button
            onClick={() => handleViewDetails(pitch.id)}
            className="text-blue-600 hover:text-blue-900"
            title="View details"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  ))}
  
  {filteredPitches.length === 0 && (
    <tr>
      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
        No pitch documents found
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

         
            </div>
        </div>
    );
};

export default DealRoomLayout;
