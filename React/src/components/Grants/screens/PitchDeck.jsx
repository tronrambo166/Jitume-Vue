import React, { useState, useEffect } from 'react';
import { Table, ChevronDown, ChevronUp, Play, Download, Users, BarChart, FileText, Star, Search, Filter, Bell, Calendar, TrendingUp, Clock, Bookmark, CheckCircle, Trash2, Flag } from 'lucide-react';
import axiosClient from "../../../axiosClient";

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
        const response = await axiosClient.get("/capital/capital-offers");
  
        // Log the response to check if it's available
        console.log("API Response:", response);
  
        // Check if the response is valid
        if (!response || !response.data || !Array.isArray(response.data.capital)) {
          throw new Error("Invalid data structure from API");
        }
  
        const rawData = response.data.capital || [];
  
        const cleanedData = rawData.map((pitch) => ({
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
        }));
  
        setPitches(cleanedData);
        console.log("Cleaned Data:", cleanedData);
  
      } catch (err) {
        console.error("Failed to fetch pitches:", err);
        // Provide a more detailed error message
        const errorMessage =
          err.code === "ECONNABORTED"
            ? "The request timed out. Please try again."
            : err.message || "Failed to load pitch opportunities. Please try again later.";
  
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
  };

  const handleStatusChange = (id, newStatus) => {
    setPitches(pitches.map(pitch => 
      pitch.id === id ? { ...pitch, status: newStatus } : pitch
    ));
  };
  
  const toggleFavorite = (id) => {
    setPitches(pitches.map(pitch => 
      pitch.id === id ? { ...pitch, favorite: !pitch.favorite } : pitch
    ));
  };

  const filteredPitches = pitches.filter(pitch => {
    // Filter by search query
    if (searchQuery && !pitch.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !pitch.sector.toLowerCase().includes(searchQuery.toLowerCase())) {
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
      <main className="  py-6 md:py-8">
        {/* Dashboard Stats */}
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

          {/* Table View */}
          {viewMode === 'table' && (
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
                {filteredPitches.map((pitch) => (
  <tr key={pitch.id} className="hover:bg-gray-50">
    <td className="px-4 md:px-6 py-3 whitespace-nowrap">
      <div className="flex items-center">
        <button 
          onClick={() => toggleFavorite(pitch.id)}
          className={`mr-2 ${pitch.favorite ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <Bookmark size={14} fill={pitch.favorite ? "currentColor" : "none"} />
        </button>
        <div className="text-sm font-medium text-gray-900">{pitch.offer_title}</div>
      </div>
    </td>
    <td className="px-4 md:px-6 py-3 whitespace-nowrap max-w-[200px] sm:max-w-[250px] lg:max-w-[400px] truncate">
  <div 
    className="text-sm text-gray-600 overflow-hidden text-ellipsis" 
    title={pitch.sectors} // Tooltip on hover to show full text
  >
    {pitch.sectors.split(',').slice(0, 2).join(', ')}
    {pitch.sectors.split(',').length > 2 && '...'}
  </div>
</td>

    <td className="px-4 md:px-6 py-3 whitespace-nowrap">
      <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${getMatchColor(pitch.matchScore)}`}>
        <span className="text-xs md:text-sm font-medium">{pitch.matchScore}</span>
      </div>
    </td>
    <td className="px-4 md:px-6 py-3 whitespace-nowrap">
      <select 
        className={`text-xs md:text-sm rounded-full px-2 py-1 md:px-3 md:py-1 font-medium ${getStatusColor(pitch.status)}`}
        value={pitch.status}
        onChange={(e) => handleStatusChange(pitch.id, e.target.value)}
      >
        <option value="New">New</option>
        <option value="In Review">In Review</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
      </select>
    </td>
    <td className="px-4 md:px-6 py-3 whitespace-nowrap">
      <div className="text-xs md:text-sm text-gray-500">{new Date(pitch.createdAt).toLocaleDateString()}</div>
    </td>
    <td className="px-4 md:px-6 py-3 whitespace-nowrap text-right text-xs md:text-sm font-medium">
      <div className="flex items-center justify-end space-x-1 md:space-x-2">
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Flag size={14} />
        </button>
        <button 
          onClick={() => openModal(pitch)}
          className="text-white bg-gray-800 hover:bg-gray-900 px-2 py-1 md:px-4 md:py-2 rounded-lg transition-colors text-xs md:text-sm"
        >
          View Pitch
        </button>
      </div>
    </td>
  </tr>
))}

                </tbody>
              </table>
            </div>
          )}
          
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPitches.map((pitch) => (
                <div key={pitch.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gray-800 relative flex items-center justify-center">
                    <img 
                      src={pitch.image} 
                      alt={pitch.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute top-3 right-3">
                      <button 
                        onClick={() => toggleFavorite(pitch.id)}
                        className={`${pitch.favorite ? 'text-green-500' : 'text-gray-300 hover:text-white'}`}
                      >
                        <Bookmark size={16} fill={pitch.favorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="relative text-2xl font-bold text-white">
                      {pitch.name.split(' ').map(word => word[0]).join('')}
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{pitch.name}</h3>
                      <div className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full text-xs font-medium ${getMatchColor(pitch.matchScore)}`}>
                        {pitch.matchScore}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-600">{pitch.sector}</span>
                      <span className="text-xs text-gray-500">{new Date(pitch.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <select 
                        className={`text-xs rounded-full px-2 py-1 font-medium ${getStatusColor(pitch.status)}`}
                        value={pitch.status}
                        onChange={(e) => handleStatusChange(pitch.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button 
                        onClick={() => openModal(pitch)}
                        className="text-gray-600 hover:text-gray-900 text-xs font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between">
            <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-0">
              Showing <span className="font-medium">{filteredPitches.length}</span> of <span className="font-medium">{pitches.length}</span> pitches
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <button className="px-2 py-1 md:px-3 md:py-1 border border-gray-200 rounded-md text-xs md:text-sm text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="w-7 h-7 md:w-8 md:h-8 bg-gray-800 rounded-md flex items-center justify-center text-white text-xs md:text-sm">
                1
              </button>
              <button className="w-7 h-7 md:w-8 md:h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 text-xs md:text-sm hover:bg-gray-50">
                2
              </button>
              <button className="w-7 h-7 md:w-8 md:h-8 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 text-xs md:text-sm hover:bg-gray-50">
                3
              </button>
              <button className="px-2 py-1 md:px-3 md:py-1 border border-gray-200 rounded-md text-xs md:text-sm text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Pitch Modal */}
      {isModalOpen && selectedPitch && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full mx-2">
              <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="text-base md:text-lg font-medium text-gray-900 mr-2 md:mr-3">{selectedPitch.name}</h3>
                  <span className={`text-xs rounded-full px-2 py-1 font-medium ${getStatusColor(selectedPitch.status)}`}>
                    {selectedPitch.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <button 
                    onClick={() => toggleFavorite(selectedPitch.id)}
                    className={`${selectedPitch.favorite ? 'text-green-500' : 'text-gray-300 hover:text-gray-500'}`}
                  >
                    <Bookmark size={18} fill={selectedPitch.favorite ? "currentColor" : "none"} />
                  </button>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-white px-4 md:px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2">
                    {/* Video Player */}
                    <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video mb-4 md:mb-6 relative">
                      <video 
                        src={mediaAssets.video} 
                        className="absolute inset-0 w-full h-full object-cover"
                        poster={selectedPitch.image}
                        controls
                      />
                      
                      {/* Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-white text-xs md:text-sm font-medium">Pitch Presentation</div>
                          <div className="flex items-center text-white text-xs">
                            <span>02:34</span>
                            <span className="mx-1">/</span>
                            <span>05:47</span>
                          </div>
                        </div>
                        <div className="mt-1 md:mt-2 h-1 bg-gray-500 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{width: "45%"}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Summary */}
                    <div className="bg-gray-100 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2 flex items-center">
                        <Star size={14} className="mr-1 text-green-600" /> AI Summary
                      </h4>
                      <p className="text-xs md:text-sm text-gray-700">
                        {selectedPitch.name} is developing innovative solutions in the {selectedPitch.sector} space. 
                        Their approach leverages cutting-edge technology to address key market challenges.
                        The team has demonstrated strong execution capabilities and has shown promising early traction.
                      </p>
                      
                      {/* AI Insights */}
                      <div className="mt-2 md:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        <div className="bg-white rounded-lg p-2 md:p-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Market Opportunity</div>
                          <div className="text-xs md:text-sm font-medium flex items-center text-green-600">
                            <TrendingUp size={12} className="mr-1" /> High Growth Potential
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-2 md:p-3">
                          <div className="text-xs font-medium text-gray-500 mb-1">Competitive Analysis</div>
                          <div className="text-xs md:text-sm font-medium flex items-center text-gray-800">
                            <Star size={12} className="mr-1" /> Strong Differentiation
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Review Notes */}
                    <div className="mb-4 md:mb-6">
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3">Review Notes</h4>
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
                        <textarea 
                          className="w-full h-20 md:h-24 text-xs md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none" 
                          placeholder="Add your notes about this pitch..."
                        ></textarea>
<div className="mt-2 md:mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FileText size={14} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <BarChart size={14} />
                            </button>
                          </div>
                          <button className="px-3 py-1 md:px-4 md:py-1.5 bg-gray-800 text-white text-xs md:text-sm rounded-lg hover:bg-gray-900">
                            Save Notes
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Documents and Files */}
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3">Documents & Files</h4>
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="border-b border-gray-100 p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-lg mr-2 md:mr-3">
                              <FileText size={14} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs md:text-sm font-medium text-gray-800">Pitch Deck.pdf</div>
                              <div className="text-xs text-gray-500">3.2 MB</div>
                            </div>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Download size={14} />
                          </button>
                        </div>
                        <div className="border-b border-gray-100 p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-lg mr-2 md:mr-3">
                              <FileText size={14} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs md:text-sm font-medium text-gray-800">Financial Projections.xlsx</div>
                              <div className="text-xs text-gray-500">1.8 MB</div>
                            </div>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Download size={14} />
                          </button>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-lg mr-2 md:mr-3">
                              <FileText size={14} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs md:text-sm font-medium text-gray-800">Market Analysis.pdf</div>
                              <div className="text-xs text-gray-500">2.5 MB</div>
                            </div>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div>
                    {/* Startup Details */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3">Startup Details</h4>
                      <div className="space-y-2 md:space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Match Score</div>
                          <div className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getMatchColor(selectedPitch.matchScore)} mr-2`}>
                              <span className="text-xs font-medium">{selectedPitch.matchScore}</span>
                            </div>
                            <div className="text-xs md:text-sm font-medium text-gray-800">Strong match for portfolio</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Sector</div>
                          <div className="text-xs md:text-sm text-gray-800">{selectedPitch.sector}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Funding Stage</div>
                          <div className="text-xs md:text-sm text-gray-800">Seed</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Location</div>
                          <div className="text-xs md:text-sm text-gray-800">San Francisco, CA</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Founded</div>
                          <div className="text-xs md:text-sm text-gray-800">2023</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Website</div>
                          <a href="#" className="text-xs md:text-sm text-blue-600 hover:underline">www.{selectedPitch.name.toLowerCase().replace(/\s/g, '')}.com</a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Team Members */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3">Team</h4>
                      <div className="space-y-3">
                        {selectedPitch.team.map((member, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs md:text-sm font-medium mr-2 md:mr-3">
                              {member.initials}
                            </div>
                            <div>
                              <div className="text-xs md:text-sm font-medium text-gray-800">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Decision */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 mb-2 md:mb-3">Decision</h4>
                      <div className="space-y-2 md:space-y-3">
                        <select 
                          className={`w-full p-2 text-xs md:text-sm font-medium rounded-lg ${getStatusColor(selectedPitch.status)}`}
                          value={selectedPitch.status}
                          onChange={(e) => handleStatusChange(selectedPitch.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="In Review">In Review</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        
                        <div className="flex space-x-2 md:space-x-3">
                          <button className="w-full px-3 py-2 text-xs md:text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">
                            Schedule Call
                          </button>
                          <button className="w-full px-3 py-2 text-xs md:text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium">
                            Send Email
                          </button>
                        </div>
                        
                        <button className="w-full flex items-center justify-center px-3 py-2 text-xs md:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium">
                          <Trash2 size={14} className="mr-1" />
                          Decline Pitch
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDashboard;