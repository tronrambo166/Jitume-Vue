import React, { useState, useEffect } from 'react';
import { Table, ChevronDown, ChevronUp, Play, Download, Users, BarChart, FileText, Star, Search, Filter, Bell, Calendar, TrendingUp, Clock, Bookmark, CheckCircle, Trash2, Flag, Info } from 'lucide-react';
import axiosClient from "../../../axiosClient";
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react'; // Optional if you want a nicer icon

import 'react-toastify/dist/ReactToastify.css';
const Capitalpitch = () => {
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
const [lastChanged, setLastChanged] = useState(null);

  
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

  useEffect(() => {
    const fetchPitches = async () => {
      setIsLoading(true);
      setError(null);
      console.log("[fetchPitches] Start fetching capital offers");
  
      try {
        const capitalResponse = await axiosClient.get("capital/capital-offers");
        console.log("[fetchPitches] Raw capitalResponse:", capitalResponse.data);
  
        let capitals = [];
  
        if (Array.isArray(capitalResponse?.data)) {
          capitals = capitalResponse.data;
          console.log("[fetchPitches] capitalResponse is an array:", capitals);
        } else if (Array.isArray(capitalResponse?.data?.capitals)) {
          capitals = capitalResponse.data.capitals;
          console.log("[fetchPitches] capitalResponse.data.capitals:", capitals);
        } else if (Array.isArray(capitalResponse?.data?.capital_offers)) {
          capitals = capitalResponse.data.capital_offers;
          console.log("[fetchPitches] capitalResponse.data.capital_offers:", capitals);
        } else if (Array.isArray(capitalResponse?.data?.capital)) {
          capitals = capitalResponse.data.capital;
          console.log("[fetchPitches] capitalResponse.data.capital:", capitals);
        } else {
          console.warn("[fetchPitches] No valid capital offers format found in response");
          throw new Error("Invalid capital offers data structure from API");
        }
  
        console.log(`[fetchPitches] Total capital offers found: ${capitals.length}`);
  
        const pitchesPromises = capitals.map(async (capital) => {
          try {
            console.log(`[fetchPitches] Fetching pitches for capital ID: ${capital.id}`);
            const pitchesResponse = await axiosClient.get(`capital/pitches/${capital.id}`);
            console.log(`[fetchPitches] Pitches for capital ${capital.id}:`, pitchesResponse.data);
            return pitchesResponse.data || [];
          } catch (error) {
            console.error(`[fetchPitches] Error fetching pitches for capital ${capital.id}:`, error);
            return [];
          }
        });
  
        const allPitchesArrays = await Promise.all(pitchesPromises);
        const combinedPitches = allPitchesArrays.flatMap(obj => obj.pitches || []);  // Fixed flattening logic
        console.log("[fetchPitches] Combined pitches (flattened):", combinedPitches);
  
        const cleanedPitches = combinedPitches.map((pitch) => {
          const capitalData = capitals.find(c => c.id === pitch.capital_id);
          return {
            id: pitch.id,
            startupName: pitch.startup_name || "",
            contactPerson: pitch.contact_person_name || "",
            contactEmail: pitch.contact_person_email || "",
            sector: pitch.sector || "",
            stage: pitch.stage || "",
            headquarters: pitch.headquarters_location || "",
            burnRate: pitch.burn_rate || "N/A",
            revenue: pitch.revenue_last_12_months || "N/A",
            cacLtv: pitch.cac_ltv || "N/A",
            irrProjection: pitch.irr_projection || "N/A",
            teamExperience: pitch.team_experience_avg_years ? `${pitch.team_experience_avg_years} years` : "N/A",
            socialImpact: pitch.social_impact_areas || "None specified",
            exitStrategy: pitch.exit_strategy || "Not provided",
            traction: pitch.traction_kpis || "Not provided",
            businessPlan: pitch.business_plan || null,
            pitchDeck: pitch.pitch_deck_file || null,
            pitchVideo: pitch.pitch_video || null,
            status: pitch.status === 1 ? "Active" : "Inactive",
            createdAt: pitch.created_at || "",
            updatedAt: pitch.updated_at || "",
            capitalId: pitch.capital_id || null,
            milestones: pitch.capital_milestone || [],
            userId: pitch.user_id || null,
            capitalName: capitalData?.name || "Unknown Capital",
            capitalAmount: capitalData?.amount
              ? `$${Number(capitalData.amount).toLocaleString()}`
              : "N/A",
            capitalFocus: capitalData?.focus_area || "General",
            team: [
              {
                name: pitch.contact_person_name || "Unknown",
                role: "CEO",
                initials: (pitch.contact_person_name || "U").split(' ').map(n => n[0]).join('')
              },
              { name: "CTO", role: "CTO", initials: "CT" },
              { name: "Product Lead", role: "Product", initials: "PL" }
            ],
            matchScore: Math.floor(Math.random() * 20) + 80,
            favorite: false
          };
        });
  
        console.log("[fetchPitches] Cleaned/normalized pitches:", cleanedPitches);
        setPitches(cleanedPitches);
  
      } catch (err) {
        console.error("[fetchPitches] Failed to fetch data:", err);
        const errorMessage =
          err.code === "ECONNABORTED"
            ? "The request timed out. Please try again."
            : err.message || "Failed to load data. Please try again later.";
        setError(errorMessage);
      } finally {
        console.log("[fetchPitches] Fetch process completed");
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

// Function to handle status changes
const handleStatusChange = async (pitchId, newStatus) => {
  setIsChanging(true);
  try {
    // Update the UI immediately for a responsive feel
    setSelectedPitch(prev => ({
      ...prev,
      status: newStatus
    }));

    // Update the pitch status in the main pitches list as well
    setPitches(prevPitches => 
      prevPitches.map(pitch => 
        pitch.id === pitchId ? { ...pitch, status: newStatus } : pitch
      )
    );

    // Make API call to update the status in the database
    await axiosClient.post(`/pitches/${pitchId}/status`, { status: newStatus });
    
    // Show success notification
    toast.success(`Status successfully updated to ${newStatus}`);
    setLastChanged(newStatus);
  } catch (error) {
    // Revert UI changes if API call fails
    setSelectedPitch(prev => ({
      ...prev,
      status: prev.originalStatus || prev.status
    }));
    
    // Revert in main pitch list as well
    setPitches(prevPitches => 
      prevPitches.map(pitch => 
        pitch.id === pitchId ? { ...pitch, originalStatus: pitch.status } : pitch
      )
    );
    
    // Show error notification
    toast.error('Failed to update status. Please try again.');
    console.error('Error updating pitch status:', error);
  } finally {
    setIsChanging(false);
  }
};

// Required imports
// import { useState } from 'react';
// import { CheckCircle } from 'lucide-react'; // or your preferred icon library
  
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-light text-gray-900">Pitch<span className="font-bold">Flow</span></h1>
            <div className="flex items-center space-x-4 md:space-x-6">
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
              </button>
              <button className="hidden md:block text-gray-500 hover:text-gray-700">
                <Calendar size={20} />
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm md:text-base font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 md:py-8">
        {/* Dashboard Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        {pitch.startupName || 'Unnamed Startup'}
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

     {/* Pitch Details Modal */}
{isModalOpen && selectedPitch && (
<div className="fixed inset-0 overflow-y-auto z-50">
  <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
    </div>
    
    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                {selectedPitch.startupName || 'Unnamed Startup'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPitch.status)}`}>
                {selectedPitch.status}
              </span>
              <span className="text-xs text-gray-500">
                Submitted on {new Date(selectedPitch.createdAt).toLocaleDateString()}
              </span>
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${getMatchColor(selectedPitch.matchScore)}`}>
                <span className="text-xs font-medium">
                  {selectedPitch.matchScore ?? 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Traction & KPIs</h4>
                  <p className="text-sm text-gray-600">
                    {selectedPitch.traction || 'No traction data provided.'}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Financial Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Burn Rate</p>
                      <p className="text-sm font-medium">${selectedPitch.burnRate || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue (Last 12 Months)</p>
                      <p className="text-sm font-medium">${selectedPitch.revenue || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CAC/LTV Ratio</p>
                      <p className="text-sm font-medium">{selectedPitch.cacLtv || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IRR Projection</p>
                      <p className="text-sm font-medium">{selectedPitch.irrProjection || 'N/A'}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Business Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Sector</p>
                      <p className="text-sm font-medium">{selectedPitch.sector || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Business Stage</p>
                      <p className="text-sm font-medium">{selectedPitch.stage || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Headquarters</p>
                      <p className="text-sm font-medium">{selectedPitch.headquarters || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Team Experience</p>
                      <p className="text-sm font-medium">{selectedPitch.teamExperience || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Social Impact & Strategy</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Social Impact</p>
                      <p className="text-sm">{selectedPitch.socialImpact || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Exit Strategy</p>
                      <p className="text-sm">{selectedPitch.exitStrategy || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                {selectedPitch.milestones && selectedPitch.milestones.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Funding Milestones</h4>
                    <div className="space-y-3">
                      {selectedPitch.milestones.map((milestone, index) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-3 py-1">
                          <p className="text-sm font-medium">{milestone.title}</p>
                          <p className="text-xs text-gray-500">Amount: ${milestone.amount}</p>
                          <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedPitch.pitchVideo && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Pitch Video</h4>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                      <video 
                        controls
                        className="w-full h-full object-cover"
                      >
                        <source src={selectedPitch.pitchVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Person</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{selectedPitch.contactPerson || 'Not provided'}</p>
                    <p className="text-sm text-gray-600">{selectedPitch.contactEmail || 'No email provided'}</p>
                  </div>
                </div>
              
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members</h4>
                  <div className="space-y-3">
                    {selectedPitch.team?.length > 0 ? (
                      selectedPitch.team.map((member, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-gray-700">{member.initials}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No team members listed</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Capital Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Capital Name</p>
                      <p className="text-sm">{selectedPitch.capitalName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Focus Area</p>
                      <p className="text-sm">{selectedPitch.capitalFocus || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-sm">{selectedPitch.capitalAmount || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Documents</h4>
                  <div className="space-y-2">
                    {selectedPitch.pitchDeck ? (
                      <a href={selectedPitch.pitchDeck} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600">
                        <FileText size={14} className="text-gray-500 mr-2" />
                        <span className="text-xs text-gray-700 hover:underline">Pitch Deck</span>
                      </a>
                    ) : null}
                    
                    {selectedPitch.businessPlan ? (
                      <a href={selectedPitch.businessPlan} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600">
                        <FileText size={14} className="text-gray-500 mr-2" />
                        <span className="text-xs text-gray-700 hover:underline">Business Plan</span>
                      </a>
                    ) : null}
                    
                    {!selectedPitch.pitchDeck && !selectedPitch.businessPlan && (
                      <p className="text-xs text-gray-500">No documents provided</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Change Status</h4>
                  
                  {lastChanged && (
                    <div className="mb-3 text-xs bg-blue-50 text-blue-700 p-2 rounded flex items-center">
                      <CheckCircle size={14} className="mr-1" />
                      Status updated to <span className="font-medium ml-1">{lastChanged}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedPitch.id, 'New')}
                      disabled={isChanging}
                      className={`px-2 py-1 text-xs rounded flex justify-center items-center
                        ${selectedPitch.status === 'New' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}
                        ${isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    >
                      {isChanging && selectedPitch.status === 'New' ? 
                        <span className="mr-1 animate-spin">⟳</span> : null}
                      New
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedPitch.id, 'In Review')}
                      disabled={isChanging}
                      className={`px-2 py-1 text-xs rounded flex justify-center items-center
                        ${selectedPitch.status === 'In Review' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}
                        ${isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    >
                      {isChanging && selectedPitch.status === 'In Review' ? 
                        <span className="mr-1 animate-spin">⟳</span> : null}
                      Review
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedPitch.id, 'Accepted')}
                      disabled={isChanging}
                      className={`px-2 py-1 text-xs rounded flex justify-center items-center
                        ${selectedPitch.status === 'Accepted' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}
                        ${isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    >
                      {isChanging && selectedPitch.status === 'Accepted' ? 
                        <span className="mr-1 animate-spin">⟳</span> : null}
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedPitch.id, 'Rejected')}
                      disabled={isChanging}
                      className={`px-2 py-1 text-xs rounded flex justify-center items-center
                        ${selectedPitch.status === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'}
                        ${isChanging ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                    >
                      {isChanging && selectedPitch.status === 'Rejected' ? 
                        <span className="mr-1 animate-spin">⟳</span> : null}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Download Application
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
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
    <div className="absolute top-2 right-2">
      <button
        onClick={closeToast}
        className="text-white hover:text-gray-300 focus:outline-none"
      >
        <X size={18} />
      </button>
    </div>
  )}
  toastClassName={() =>
    "relative bg-neutral-800 text-white rounded-lg shadow-lg px-4 py-3"
  }
  bodyClassName="text-sm font-medium"
  progressClassName="bg-white"
/>


</div>
)}
    </div>
  );
};

export default Capitalpitch;