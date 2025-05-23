import React, { useState, useEffect } from 'react';
import { Table, ChevronDown, ChevronUp, Play, Download, Users, BarChart, FileText, Star, Search, Filter, Bell, Calendar, TrendingUp, Clock, Bookmark, CheckCircle, Trash2, Flag, Info } from 'lucide-react';
import axiosClient from "../../../axiosClient";
import { ToastContainer, toast } from 'react-toastify';

const PitchDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [pitches, setPitches] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChanging, setIsChanging] = useState(false);

  // Royalty-free images and video links
  const mediaAssets = {
    thumbnails: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4"
  };

  // Sample data with image URLs
  useEffect(() => {
    const fetchPitches = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First fetch all grants
        const grantsResponse = await axiosClient.get("/grant/grants");

        // Check if the response is valid
        if (!grantsResponse?.data?.grants || !Array.isArray(grantsResponse.data.grants)) {
          throw new Error("Invalid grants data structure from API");
        }

        const grants = grantsResponse.data.grants;

        // Fetch all pitches for all grants in parallel
        const pitchesPromises = grants.map(async (grant) => {
          try {
            const pitchesResponse = await axiosClient.get(`grant/pitches/${grant.id}`);
            return pitchesResponse.data?.pitches || [];
          } catch (error) {
            console.error(`Error fetching pitches for grant ${grant.id}:`, error);
            return []; // Return empty array if pitch fetch fails
          }
        });

        // Wait for all pitch requests to complete
        const allPitchesArrays = await Promise.all(pitchesPromises);

        // Flatten the array of arrays into a single list of pitches
        const combinedPitches = allPitchesArrays.flat();

        // Transform the pitches data (similar to your existing cleaning logic)
        const cleanedPitches = combinedPitches.map((pitch) => ({
          ...pitch,
          grantTitle: pitch.grant_title || "",
          totalGrantAmount: pitch.total_grant_amount
            ? Number(pitch.total_grant_amount).toLocaleString()
            : "N/A",
          applicationDeadline: pitch.application_deadline || "No deadline",
          createdAt: pitch.created_at || "",
          grantFocus: pitch.grant_focus || "",
          eligibilityCriteria: pitch.eligibility_criteria || "",
          evaluationCriteria: pitch.evaluation_criteria || "",
          impactObjectives: pitch.impact_objectives || "",
          grantBriefPdf: pitch.grant_brief_pdf || "",
          fundingPerBusiness:
            pitch.funding_per_business === "N/A"
              ? "N/A"
              : Number(pitch.funding_per_business).toLocaleString(),
          requiredDocuments: pitch.documentsRequired?.length
            ? pitch.documentsRequired.join(", ")
            : "No documents required",
          // Add sample team data for each pitch
          team: [
            { name: "John Smith", role: "CEO & Co-Founder", initials: "JS" },
            { name: "Anna Lee", role: "CTO & Co-Founder", initials: "AL" },
            { name: "Michael Chen", role: "Head of Product", initials: "MC" }
          ],
          // Add sample status and match score if not present
          status: pitch.status || "New",
          matchScore: pitch.match_score || Math.floor(Math.random() * 20) + 80,
          favorite: pitch.favorite || false
        }));

        setPitches(cleanedPitches);
        console.log("Combined Pitches Data:", cleanedPitches);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        const errorMessage =
          err.code === "ECONNABORTED"
            ? "The request timed out. Please try again."
            : err.message || "Failed to load data. Please try again later.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPitches();
  }, []);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewMode('grid'); // Default to grid view on mobile
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openModal = (pitch) => {
    setSelectedPitch(pitch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPitch(null);
  };

 const handleStatusChange = async (pitchId, newStatus) => {
   setIsChanging(true);

   // Get current pitch data for potential rollback
   const currentPitch = pitches.find(pitch => pitch.id === pitchId);
   const previousStatus = currentPitch?.status;

   console.groupCollapsed(`[Pitch Status Change] Starting status update for pitch ${pitchId}`);
   console.log("New Status:", newStatus);
   console.log("Pitch ID:", pitchId);

   try {
     // Determine numeric status value
     const statusCode = newStatus === "Accepted" ? 1 : 2;

     // Update UI immediately (optimistic update)
     if (selectedPitch && selectedPitch.id === pitchId) {
       setSelectedPitch(prev => ({
         ...prev,
         status: statusCode,
         processingStatus: newStatus
       }));
     }

     // Update in main list
     setPitches(prevPitches =>
       prevPitches.map(pitch =>
         pitch.id === pitchId
           ? {
               ...pitch,
               status: statusCode,
               updatedAt: new Date().toISOString()
             }
           : pitch
       )
     );

     // Make API call
     const action = newStatus === "Accepted" ? "accept" : "reject";
     const endpoint = `capital/${action}/${pitchId}`;

     console.log("Making GET request to:", endpoint);
     const response = await axiosClient.get(endpoint);

     console.log("Backend Response:", response.data);
     toast.success(`Pitch ${newStatus.toLowerCase()} successfully`);
     setLastChanged(newStatus);

     // IMPORTANT: Prevent the data refetch from overriding our state
     // by adding a debounce or flag that prevents status reset

   } catch (error) {
     console.error("Error updating pitch status:", error);

     // Revert changes on error
     if (selectedPitch && selectedPitch.id === pitchId) {
       setSelectedPitch(prev => ({
         ...prev,
         status: previousStatus,
         processingStatus: null
       }));
     }

     setPitches(prevPitches =>
       prevPitches.map(pitch =>
         pitch.id === pitchId ? { ...pitch, status: previousStatus } : pitch
       )
     );

     toast.error("Failed to update status. Please try again.");
   } finally {
     setIsChanging(false);
   }
 };
  const toggleFavorite = (id) => {
    setPitches(pitches.map(pitch =>
      pitch.id === id ? { ...pitch, favorite: !pitch.favorite } : pitch
    ));
  };

  const filteredPitches = pitches.filter(pitch => {
    // Filter by search query
    if (
      searchQuery &&
      !pitch.offer_title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !pitch.sectors?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !pitch.startup_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by selected tab
    if (selectedTab === 'favorites' && !pitch.favorite) return false;
    if (selectedTab === 'new' && pitch.status !== 'New') return false;
    if (selectedTab === 'review' && pitch.status !== 'In Review') return false;
    if (selectedTab === 'accepted' && pitch.status !== 'Accepted') return false;
    if (selectedTab === 'rejected' && pitch.status !== 'Rejected') return false;

    return true;
  });

  // Status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-gray-100 text-gray-800';
      case 'In Review': return 'bg-gray-800 text-white';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Match score colors
  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-gray-800 text-white';
    return 'bg-gray-100 text-gray-800';
  };

  // Check if video exists for the pitch
  const hasVideo = (pitch) => {
    return pitch?.video_url || pitch?.pitch_video || mediaAssets.video;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className=" px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-light text-gray-900">Pitch<span className="font-bold">Flow</span></h1>
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </button> */}
              <button className="hidden md:block text-gray-500 hover:text-gray-700">
                <Calendar size={20} />
              </button>
              {/* <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm md:text-base font-medium">JD</span>
              </div> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 md:py-8">
        {/* Dashboard Stats */}
        <div className=" px-4 sm:px-6 lg:px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Pitches</p>
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">42</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Table size={16} className="text-gray-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp size={12} className="mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Average Match</p>
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">86%</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Star size={16} className="text-gray-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp size={12} className="mr-1" />
                <span>+5% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pending Review</p>
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">12</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock size={16} className="text-gray-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <span>2 due today</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Acceptance Rate</p>
                  <p className="text-xl md:text-2xl font-semibold text-gray-800">32%</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <CheckCircle size={16} className="text-gray-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp size={12} className="mr-1" />
                <span>+3% from last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs and Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4">
                <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2 md:space-x-4">
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-lg whitespace-nowrap ${
                      selectedTab === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All Pitches
                  </button>
                  <button
                    onClick={() => setSelectedTab('favorites')}
                    className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-lg whitespace-nowrap ${
                      selectedTab === 'favorites' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Favorites
                  </button>
                  <button
                    onClick={() => setSelectedTab('new')}
                    className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-lg whitespace-nowrap ${
                      selectedTab === 'new' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setSelectedTab('review')}
                    className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-lg whitespace-nowrap ${
                      selectedTab === 'review' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    In Review
                  </button>
                  <button
                    onClick={() => setSelectedTab('accepted')}
                    className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-lg whitespace-nowrap ${
                      selectedTab === 'accepted' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Accepted
                  </button>
                  <button
                    onClick={() => setSelectedTab('rejected')}
                    className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-lg whitespace-nowrap ${
                      selectedTab === 'rejected' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Rejected
                  </button>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 mt-2 md:mt-0">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1 md:p-2 rounded-lg ${viewMode === 'table' ? 'bg-gray-100' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    <Table size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 md:p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    <div className="grid grid-cols-2 gap-0.5 md:gap-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-current rounded-sm"></div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
                <div className="relative w-full md:max-w-md">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={14} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400"
                    placeholder="Search startups or sectors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm text-gray-600 hover:bg-gray-50 flex items-center"
                  >
                    <Filter size={12} className="mr-1 md:mr-2" />
                    Filter
                  </button>
                  <button className="px-3 py-1.5 md:px-4 md:py-2 bg-green-600 rounded-lg text-xs md:text-sm text-white hover:bg-green-700 whitespace-nowrap">
                    Export
                  </button>
                </div>
              </div>

              {/* Advanced Filters (conditionally shown) */}
              {showFilters && (
                <div className="mt-3 p-3 md:p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Match Score</label>
                    <select className="w-full border border-gray-200 rounded-md p-1.5 md:p-2 text-sm">
                      <option>Any</option>
                      <option>90% or higher</option>
                      <option>80% - 90%</option>
                      <option>Below 80%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sector</label>
                    <select className="w-full border border-gray-200 rounded-md p-1.5 md:p-2 text-sm">
                      <option>All Sectors</option>
                      <option>Artificial Intelligence</option>
                      <option>Fintech</option>
                      <option>CleanTech</option>
                      <option>HealthTech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date Received</label>
                    <select className="w-full border border-gray-200 rounded-md p-1.5 md:p-2 text-sm">
                      <option>Any time</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Funding Stage</label>
                    <select className="w-full border border-gray-200 rounded-md p-1.5 md:p-2 text-sm">
                      <option>All Stages</option>
                      <option>Pre-seed</option>
                      <option>Seed</option>
                      <option>Series A</option>
                      <option>Series B+</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Loading or error states */}
            {isLoading && (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
              </div>
            )}

            {error && (
              <div className="flex justify-center items-center p-8">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Error loading pitches</span>
                  </div>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Empty state when no pitches match filters */}
            {!isLoading && !error && filteredPitches.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <Search size={32} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No matches found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  We couldn't find any pitches matching your search criteria. Try adjusting your filters or search query.
                </p>
              </div>
            )}

            {/* Table View */}
            {!isLoading && !error && filteredPitches.length > 0 && viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Startup Name
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sector
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Match Score
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPitches.map((pitch) => {
                      // Calculate derived data once per pitch
                      const statusText = typeof pitch.status === 'number' ?
                        pitch.status === 0 ? 'New' :
                        pitch.status === 1 ? 'In Review' :
                        pitch.status === 2 ? 'Accepted' : 'Rejected' :
                        pitch.status;

                      const formattedDate = new Date(pitch.createdAt || pitch.created_at || new Date()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                      const sectorsDisplay = pitch.sector || pitch.sectors || 'No sector';
                      const truncatedSectors = sectorsDisplay.split(',').slice(0, 2).join(', ');
                      const showEllipsis = sectorsDisplay.split(',').length > 2;

                      return (
                        <tr key={pitch.id} className="hover:bg-gray-50">
                          <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => toggleFavorite(pitch.id)}
                                className={`mr-2 ${pitch.favorite ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                              >
                                <Bookmark size={14} fill={pitch.favorite ? "currentColor" : "none"} />
                              </button>
                              <div className="text-sm font-medium text-gray-900">
                                {pitch.startup_name || 'Unnamed Startup'}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 md:px-6 py-3 whitespace-nowrap max-w-xs overflow-hidden">
                            <div
                              className="text-sm text-gray-600 overflow-hidden text-ellipsis"
                              title={sectorsDisplay}
                            >
                              {truncatedSectors}
                              {showEllipsis && '...'}
                            </div>
                          </td>

                          <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                            <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${getMatchColor(pitch.matchScore)}`}>
                              <span className="text-xs md:text-sm font-medium">
                                {pitch.matchScore ?? 'N/A'}
                              </span>
                            </div>
                            </td>

                          <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(statusText)}`}>
                              {statusText}
                            </span>
                          </td>

                          <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formattedDate}
                          </td>

                          <td className="px-4 md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openModal(pitch)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Download size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {!isLoading && !error && filteredPitches.length > 0 && viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredPitches.map((pitch) => {
                  const statusText = typeof pitch.status === 'number' ?
                    pitch.status === 0 ? 'New' :
                    pitch.status === 1 ? 'In Review' :
                    pitch.status === 2 ? 'Accepted' : 'Rejected' :
                    pitch.status;

                  const formattedDate = new Date(pitch.createdAt || pitch.created_at || new Date()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  const randomThumbnail = mediaAssets.thumbnails[Math.floor(Math.random() * mediaAssets.thumbnails.length)];

                  return (
                    <div key={pitch.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        {hasVideo(pitch) ? (
                          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                            <img
                              src={randomThumbnail}
                              alt="Video thumbnail"
                              className="object-cover w-full h-40"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button className="w-10 h-10 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                                <Play size={16} className="text-gray-800" fill="currentColor" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={randomThumbnail}
                            alt="Startup thumbnail"
                            className="object-cover w-full h-40"
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => toggleFavorite(pitch.id)}
                            className={`p-1.5 rounded-full bg-white bg-opacity-80 shadow-sm ${pitch.favorite ? 'text-green-500' : 'text-gray-400'}`}
                          >
                            <Bookmark size={14} fill={pitch.favorite ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                            {pitch.startup_name || 'Unnamed Startup'}
                          </h3>
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getMatchColor(pitch.matchScore)}`}>
                            <span className="text-xs font-medium">
                              {pitch.matchScore ?? 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center mb-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(statusText)}`}>
                            {statusText}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {formattedDate}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {pitch.sectors || 'No sector information available'}
                        </p>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => openModal(pitch)}
                            className="text-sm font-medium text-green-600 hover:text-green-800"
                          >
                            View details
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

     {/* Pitchgrant Details Modal */}
{/* Pitchgrant Details Modal */}
{isModalOpen && selectedPitch && (
  <div className="fixed inset-0 overflow-y-auto z-50">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-100">
        {/* Header with brand color */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl leading-6 font-semibold text-white">
              {selectedPitch.startup_name || 'Unnamed Startup'}
            </h3>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full bg-white bg-opacity-20 text-white`}>
              {selectedPitch.status === 1 ? "Accepted" :
               selectedPitch.status === 0 ? "Rejected" :
               selectedPitch.status === 2 ? "Milestone Released" : "Pending"}
            </span>
            <span className="text-xs text-gray-100">
              Submitted on {new Date(selectedPitch.createdAt || selectedPitch.created_at).toLocaleDateString()}
            </span>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-white bg-opacity-20`}>
              <span className="text-xs font-medium text-white">
                {selectedPitch.matchScore ?? 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Traction & KPIs */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Pitch Summary</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedPitch.traction_kpis || 'No summary provided.'}
                  </p>
                </div>
              </div>

              {/* Sectors & Impact Areas */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Sectors & Impact Areas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Primary Sector</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.sector || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Social Impact Areas</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.social_impact_areas || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Business Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Business Stage</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.stage || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Headquarters</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.headquarters_location || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Revenue (Last 12 Months)</p>
                    <p className="text-sm font-medium text-gray-800">${parseFloat(selectedPitch.revenue_last_12_months || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Team Experience</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.team_experience_avg_years || 0} years avg.</p>
                  </div>
                </div>
              </div>

              {/* Grant Details */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Grant Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Grant Title</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.grantTitle || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Total Grant Amount</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.totalGrantAmount || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Funding Per Business</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.fundingPerBusiness || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Application Deadline</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPitch.applicationDeadline || 'No deadline'}</p>
                  </div>
                </div>
              </div>

              {/* Pitch Video */}
              {selectedPitch.pitch_video && (
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Pitch Video</h4>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <video
                      controls
                      poster={mediaAssets?.thumbnails?.[0] || '/path/to/default/thumbnail.jpg'}
                      className="w-full h-full object-cover"
                    >
                        {/*+selectedPitch.pitch_video*/}
                      <source src={"https://tujitume.com/files/grantApps/liveChat.mp4"} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-1">
              {/* Contact Person */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 shadow-sm">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Contact Person</h4>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">{selectedPitch.contact_person_name || 'Not provided'}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selectedPitch.contact_person_email || 'No email provided'}
                  </p>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 shadow-sm">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Team Members</h4>
                <div className="space-y-4">
                  {selectedPitch.team?.length > 0 ? (
                    selectedPitch.team.map((member, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-lime-400 flex items-center justify-center mr-3 shadow-sm">
                          <span className="text-xs font-medium text-white">{member.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No team members listed</p>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 shadow-sm">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Documents</h4>
                <div className="space-y-3">
                  {selectedPitch.pitch_deck_file ? (
                    <a href={selectedPitch.pitch_deck_file} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md hover:bg-green-50 transition-colors">
                      <FileText size={16} className="text-green-600 mr-2" />
                      <span className="text-sm text-gray-700 hover:text-green-700">Pitch Deck</span>
                    </a>
                  ) : null}

                  {selectedPitch.business_plan_file ? (
                    <a href={selectedPitch.business_plan_file} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md hover:bg-green-50 transition-colors">
                      <FileText size={16} className="text-green-600 mr-2" />
                      <span className="text-sm text-gray-700 hover:text-green-700">Business Plan</span>
                    </a>
                  ) : null}

                  {selectedPitch.grantBriefPdf ? (
                    <a href={selectedPitch.grantBriefPdf} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-md hover:bg-green-50 transition-colors">
                      <FileText size={16} className="text-green-600 mr-2" />
                      <span className="text-sm text-gray-700 hover:text-green-700">Grant Brief</span>
                    </a>
                  ) : null}

                  {!selectedPitch.pitch_deck_file && !selectedPitch.business_plan_file && !selectedPitch.grantBriefPdf && (
                    <p className="text-xs text-gray-500">No documents provided</p>
                  )}
                </div>
              </div>

              {/* Change Pitch Status */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                <h4 className="text-sm font-semibold text-green-800 mb-3 uppercase tracking-wider">Pitch Status</h4>
                <div className="mb-4">
                  {selectedPitch.status === 1 ? (
                    <div className="flex items-center text-green-600 font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Accepted
                    </div>
                  ) : selectedPitch.status === 0 ? (
                    <div className="flex items-center text-red-600 font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Rejected
                    </div>
                  ) : selectedPitch.status === 2 ? (
                    <div className="flex items-center text-blue-600 font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Milestone Released
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600 font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending
                    </div>
                  )}
                </div>

                {/* Show buttons only if the pitch status is neither 1 (Accepted) nor 0 (Rejected) nor 2 (Milestone Released) */}
                {selectedPitch.status !== 1 && selectedPitch.status !== 0 && selectedPitch.status !== 2 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Accept Button */}
                    <button
                      onClick={() => handleStatusChange(selectedPitch.id, 'Accepted')}
                      disabled={isChanging}
                      className={`
                        px-3 py-2 text-sm rounded-md flex items-center justify-center transition-all
                        bg-white border border-green-200 text-green-700 hover:bg-green-50
                        ${isChanging ? 'opacity-70 cursor-not-allowed' : ''}
                        shadow-sm hover:shadow
                      `}
                    >
                      {isChanging && selectedPitch.processingStatus === 'Accepted' ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      Accept
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => handleStatusChange(selectedPitch.id, 'Rejected')}
                      disabled={isChanging}
                      className={`
                        px-3 py-2 text-sm rounded-md flex items-center justify-center transition-all
                        bg-white border border-red-200 text-red-700 hover:bg-red-50
                        ${isChanging ? 'opacity-70 cursor-not-allowed' : ''}
                        shadow-sm hover:shadow
                      `}
                    >
                      {isChanging && selectedPitch.processingStatus === 'Rejected' ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      Reject
                    </button>
                  </div>
                ) : (
                  /* Status message for already processed pitches */
                  <div className="text-xs text-gray-500 italic mt-2">
                    {selectedPitch.status === 1
                      ? "This pitch has been accepted and cannot be modified."
                      : selectedPitch.status === 0
                      ? "This pitch has been rejected and cannot be modified."
                      : "This pitch's milestone has been released."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
          >
            Download Application
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="ml-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    {/* Toast Container */}
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          className="text-gray-200 hover:text-white focus:outline-none"
        >
          <X size={16} />
        </button>
      )}
      toastClassName={() =>
        "relative bg-green-800 text-white rounded-lg shadow-lg px-4 py-3 mb-3"
      }
      bodyClassName="text-sm font-medium"
      progressClassName="bg-green-300"
    />
  </div>
)}
    </div>
  );
};

export default PitchDashboard;
