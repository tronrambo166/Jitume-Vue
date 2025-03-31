import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Search, Bell, Filter, Zap, ArrowRight, Download, ChevronRight, MoreHorizontal, 
  TrendingUp, Award, DollarSign, ChevronDown, ChevronLeft, List, X 
} from 'lucide-react';

const TujitumeWhiteThemeDashboard = () => {
  const [activeTab, setActiveTab] = useState('grants');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [pulsing, setPulsing] = useState(false);
  const [animateValue, setAnimateValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Updated color palette - Sophisticated neutrals with green accents
  const COLORS = {
    // Neutral grayscale
    background: '#ffffff',
    panelBg: '#f8f9fa',
    cardBg: '#ffffff',
    border: '#e0e0e0',
    lightBorder: '#ebebeb',
    text: '#2a2a2a',
    dimText: '#6c757d',
    mutedText: '#9e9e9e',
    
    // Accents (green for important features)
    primary: '#4caf50',  // Green
    primaryLight: '#e8f5e9',
    primaryDark: '#388e3c',
    
    // Supporting neutrals
    highlight: '#757575',  // Medium gray
    highlightLight: '#e0e0e0',
    
    // Status colors
    success: '#4caf50',  // Green
    warning: '#ff9800',  // Amber
    danger: '#f44336',   // Red
    
    // Chart colors
    chart1: '#9e9e9e',   // Gray
    chart2: '#757575',   // Darker gray
    chart3: '#616161',   // Even darker gray
    chartHighlight: '#4caf50'  // Green
  };

  // Data arrays
  const allMatches = [
    { id: 1, name: 'AgriTech Solutions', sector: 'Agriculture', score: 94, funding: '$250K', employees: 24, contact: 'mary@agritech.com', stage: 'Series A', location: 'Nairobi' },
    { id: 2, name: 'Renewa Energy', sector: 'Energy', score: 91, funding: '$1.8M', employees: 42, contact: 'james@renewa.com', stage: 'Seed', location: 'Kampala' },
    { id: 3, name: 'AquaPure Systems', sector: 'Water', score: 89, funding: '$750K', employees: 18, contact: 'david@aquapure.com', stage: 'Pre-Seed', location: 'Dar es Salaam' },
    { id: 4, name: 'UrbanFarm Tech', sector: 'Agriculture', score: 87, funding: '$350K', employees: 12, contact: 'sarah@urbanfarm.com', stage: 'Series A', location: 'Nairobi' },
    { id: 5, name: 'EcoBuild Materials', sector: 'Construction', score: 85, funding: '$2.1M', employees: 56, contact: 'peter@ecobuild.com', stage: 'Series B', location: 'Johannesburg' },
    { id: 6, name: 'MediQuick', sector: 'Health', score: 84, funding: '$1.2M', employees: 32, contact: 'grace@mediquick.com', stage: 'Series A', location: 'Lagos' },
    { id: 7, name: 'EduTech Africa', sector: 'Education', score: 82, funding: '$500K', employees: 28, contact: 'john@edutech.com', stage: 'Seed', location: 'Cape Town' },
    { id: 8, name: 'SolarGrid', sector: 'Energy', score: 81, funding: '$3.5M', employees: 64, contact: 'michael@solar.com', stage: 'Series C', location: 'Accra' },
    { id: 9, name: 'CleanWater', sector: 'Water', score: 80, funding: '$900K', employees: 22, contact: 'linda@cleanwater.com', stage: 'Series A', location: 'Kigali' },
    { id: 10, name: 'AgroFinance', sector: 'Agriculture', score: 79, funding: '$1.5M', employees: 38, contact: 'robert@agro.com', stage: 'Series B', location: 'Nairobi' }
  ];

  const matchingMetrics = [
    { metric: 'Sector Fit', value: 82 },
    { metric: 'Stage Match', value: 75 },
    { metric: 'Revenue', value: 68 },
    { metric: 'Team', value: 79 },
    { metric: 'Impact', value: 88 }
  ];

  const performanceData = [
    { month: 'Jan', applications: 18, matches: 12, conversion: 67 },
    { month: 'Feb', applications: 22, matches: 15, conversion: 68 },
    { month: 'Mar', applications: 25, matches: 18, conversion: 72 },
    { month: 'Apr', applications: 28, matches: 20, conversion: 71 },
    { month: 'May', applications: 30, matches: 22, conversion: 73 },
    { month: 'Jun', applications: 32, matches: 25, conversion: 78 }
  ];

  // Filtering and pagination logic
  const filteredMatches = allMatches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         match.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(match.sector);
    return matchesSearch && matchesSector;
  });

  const matchesPerPage = 5;
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
  const currentMatches = showAllMatches 
    ? filteredMatches 
    : filteredMatches.slice((currentPage - 1) * matchesPerPage, currentPage * matchesPerPage);

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
        <div className="p-3 rounded-lg border shadow-lg" style={{ 
          backgroundColor: COLORS.background,
          borderColor: COLORS.border
        }}>
          <p className="font-medium mb-1" style={{ color: COLORS.primary }}>{label}</p>
          {payload.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ 
                    backgroundColor: item.color || 
                      (item.name === 'applications' ? COLORS.chart1 : 
                       item.name === 'matches' ? COLORS.primary : 
                       COLORS.chart2)
                  }}
                />
                <span className="text-xs capitalize" style={{ color: COLORS.dimText }}>{item.name}:</span>
              </div>
              <span className="text-xs font-medium ml-4" style={{ color: COLORS.text }}>
                {item.value}{item.name === 'conversion' ? '%' : ''}
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
        <div className="relative" style={{ width: size, height: size/2 }}>
          <div 
            className="absolute top-0 rounded-t-full overflow-hidden"
            style={{ 
              width: size, 
              height: size/2, 
              background: gradient,
              transformOrigin: 'bottom center'
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-end justify-center pb-2">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: COLORS.text }}>{value}%</div>
              <div className="text-xs mt-1" style={{ color: COLORS.dimText }}>{label}</div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 w-1 h-6 rounded-b-full" style={{ backgroundColor: COLORS.text }}></div>
        </div>
      </div>
    );
  };

  const LEDIndicator = ({ value, threshold, label, size = 80 }) => {
    let color = COLORS.danger;
    let intensity = '0 0 8px';
    
    if (value >= threshold.high) { 
      color = COLORS.primary; 
      intensity = '0 0 12px'; 
    } else if (value >= threshold.medium) { 
      color = COLORS.warning; 
      intensity = '0 0 10px'; 
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
            border: `1px solid ${COLORS.border}`
          }}
        >
          <span className="text-lg font-bold text-white">{value}</span>
        </div>
        <span className="text-xs" style={{ color: COLORS.dimText }}>{label}</span>
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
          border: `1px solid ${COLORS.lightBorder}`
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium" style={{ color: COLORS.dimText }}>{title}</p>
            <p className="text-xl font-semibold mt-1" style={{ color: COLORS.text }}>{value}</p>
          </div>
          <div 
            className="p-2 rounded-full transition-colors"
            style={{ 
              backgroundColor: `${color}20`, 
              color: color 
            }}
          >
            {icon}
          </div>
        </div>
        <div 
          className="text-xs mt-4 rounded-full px-2 py-1 inline-flex items-center justify-center opacity-90"
          style={{ 
            backgroundColor: COLORS.primaryLight,
            color: COLORS.primary
          }}
        >
          <ArrowRight size={10} className="mr-1" />
          {change} from last month
        </div>
      </div>
    );
  };

  const toggleSector = (sector) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector) 
        : [...prev, sector]
    );
  };

  const handleExport = () => {
    alert(`Exporting ${activeTab === 'grants' ? 'Grant' : 'Investment'} data...`);
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

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div 
        className="px-4 py-3 flex items-center justify-between border-t"
        style={{ 
          borderColor: COLORS.border,
          backgroundColor: COLORS.panelBg
        }}
      >
        <div className="flex items-center text-xs" style={{ color: COLORS.dimText }}>
          <span>Showing {((currentPage - 1) * matchesPerPage) + 1}-{Math.min(currentPage * matchesPerPage, filteredMatches.length)} of {filteredMatches.length} matches</span>
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
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={14} />
          </button>

          {startPage > 1 && (
            <span className="px-1" style={{ color: COLORS.dimText }}>...</span>
          )}

          {pages.map(page => (
            <button 
              key={page} 
              className={`px-2 py-1 text-xs rounded ${
                currentPage === page 
                  ? 'text-white' 
                  : 'hover:bg-gray-100'
              }`}
              style={{ 
                backgroundColor: currentPage === page ? COLORS.primary : 'transparent',
                color: currentPage === page ? 'white' : COLORS.dimText
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <span className="px-1" style={{ color: COLORS.dimText }}>...</span>
          )}

          <button 
            className="px-2 py-1 text-xs rounded hover:bg-gray-100 disabled:opacity-50" 
            style={{ color: COLORS.dimText }}
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
    <div className="p-6 rounded-xl" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <div 
        className="px-6 py-4 rounded-xl mb-6 relative overflow-hidden" 
        style={{ 
          background: `linear-gradient(to right, ${COLORS.panelBg}, ${COLORS.background})`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          border: `1px solid ${COLORS.border}`
        }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold flex items-center" style={{ color: COLORS.text }}>
              <Zap size={20} className="mr-2" style={{ color: COLORS.primary }} />
              Tujitume AI Match Engine
            </h1>
            <div className="hidden md:flex space-x-1 p-0.5 rounded-md" style={{ backgroundColor: COLORS.panelBg }}>
              <button 
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  activeTab === 'grants' 
                    ? 'text-white shadow-md' 
                    : 'hover:text-gray-900'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'grants' ? COLORS.primary : 'transparent',
                  color: activeTab === 'grants' ? 'white' : COLORS.dimText
                }}
                onClick={() => setActiveTab('grants')}
              >
                Grants
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  activeTab === 'investments' 
                    ? 'text-white shadow-md' 
                    : 'hover:text-gray-900'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'investments' ? COLORS.primary : 'transparent',
                  color: activeTab === 'investments' ? 'white' : COLORS.dimText
                }}
                onClick={() => setActiveTab('investments')}
              >
                Investments
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: COLORS.dimText }} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-3 py-1.5 w-40 text-sm rounded-lg focus:outline-none focus:ring-1 focus:border-transparent" 
                style={{ 
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.background,
                  color: COLORS.text
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="p-1.5 rounded-lg hover:bg-gray-100 relative border" 
              style={{ 
                backgroundColor: COLORS.background,
                borderColor: COLORS.border,
                color: COLORS.dimText
              }}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.primary }}></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="mt-4">
        {/* Dashboard Header */}
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold flex items-center" style={{ color: COLORS.text }}>
                <span>{activeTab === 'grants' ? 'Grant Matching Overview' : 'Investment Matching Overview'}</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full border" style={{ 
                  backgroundColor: COLORS.primaryLight,
                  color: COLORS.primary,
                  borderColor: COLORS.primary
                }}>
                  AI Powered
                </span>
              </h2>
              <p className="text-xs mt-1" style={{ color: COLORS.dimText }}>
                {activeTab === 'grants' 
                  ? 'Track your grant matching performance and opportunities' 
                  : 'Monitor investment matches and potential funding'}
              </p>
            </div>
            <div className="mt-2 sm:mt-0 flex space-x-2">
              <button 
                className="flex items-center text-xs px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                style={{ 
                  borderColor: COLORS.border,
                  color: COLORS.dimText,
                  backgroundColor: COLORS.background
                }}
                onClick={handleExport}
              >
                <Download size={14} className="mr-1.5" />Export
              </button>
              <button 
                className="flex items-center text-xs px-2.5 py-1 border rounded-lg transition-colors hover:bg-gray-50"
                style={{ 
                  borderColor: COLORS.border,
                  color: COLORS.dimText,
                  backgroundColor: COLORS.background
                }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={14} className="mr-1.5" />Filters
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div 
            className="mb-5 p-4 rounded-lg border shadow-sm"
            style={{ 
              backgroundColor: COLORS.background,
              borderColor: COLORS.border
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium" style={{ color: COLORS.text }}>Filter Options</h3>
              <button 
                onClick={() => setShowFilters(false)} 
                style={{ color: COLORS.dimText }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: COLORS.dimText }}>Sectors</label>
                <div className="flex flex-wrap gap-2">
                  {['Agriculture', 'Energy', 'Water', 'Construction', 'Health', 'Education'].map(sector => (
                    <button
                      key={sector}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        selectedSectors.includes(sector) 
                          ? 'border' 
                          : 'border hover:bg-gray-50'
                      }`}
                      style={{ 
                        backgroundColor: selectedSectors.includes(sector) 
                          ? COLORS.primaryLight 
                          : COLORS.background,
                        color: selectedSectors.includes(sector) 
                          ? COLORS.primary 
                          : COLORS.dimText,
                        borderColor: selectedSectors.includes(sector) 
                          ? COLORS.primary 
                          : COLORS.border
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
                    setSearchQuery('');
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
            value={filteredMatches.length} 
            change="+12.7%" 
            icon={<TrendingUp size={16} />} 
            color={COLORS.primary} 
          />
          <Card 
            title="Average Score" 
            value="83.5%" 
            change="+3.2%" 
            icon={<Award size={16} />} 
            color={COLORS.primary}
          />
          <Card 
            title="High Potential" 
            value={filteredMatches.filter(m => m.score >= 85).length} 
            change="+9.1%" 
            icon={<Zap size={16} />} 
            color={COLORS.primary}
          />
          <Card 
            title="Funded" 
            value="24" 
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div className="flex justify-between items-center w-full mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.dimText }}>Matching Efficiency</h3>
              <button 
                className="text-xs font-medium flex items-center hover:underline"
                style={{ color: COLORS.primary }}
                onClick={() => alert('Showing matching efficiency details')}
              >
                Details <ChevronRight size={14} className="ml-0.5" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <Speedometer 
                value={Math.round(animateValue)} 
                color={COLORS.primary} 
                label="Average Match Score" 
              />
              
              <div className="mt-6 w-full grid grid-cols-3 gap-2">
                <LEDIndicator 
                  value={38} 
                  threshold={{ medium: 20, high: 30 }} 
                  label="High Potential" 
                  size={60}
                />
                <LEDIndicator 
                  value={76} 
                  threshold={{ medium: 50, high: 70 }} 
                  label="Stage Alignment" 
                  size={60}
                />
                <LEDIndicator 
                  value={92} 
                  threshold={{ medium: 60, high: 80 }} 
                  label="Sector Matching" 
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.dimText }}>Performance Trends</h3>
              <div className="flex space-x-1 p-0.5 rounded-md" style={{ backgroundColor: COLORS.panelBg }}>
                <button 
                  className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                    timeRange === 'monthly' 
                      ? 'text-white' 
                      : 'hover:text-gray-900'
                  }`}
                  style={{ 
                    backgroundColor: timeRange === 'monthly' ? COLORS.primary : 'transparent',
                    color: timeRange === 'monthly' ? 'white' : COLORS.dimText
                  }}
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`text-xs px-2 py-0.5 rounded-md transition-colors ${
                    timeRange === 'quarterly' 
                      ? 'text-white' 
                      : 'hover:text-gray-900'
                  }`}
                  style={{ 
                    backgroundColor: timeRange === 'quarterly' ? COLORS.primary : 'transparent',
                    color: timeRange === 'quarterly' ? 'white' : COLORS.dimText
                  }}
                  onClick={() => setTimeRange('quarterly')}
                >
                  Quarterly
                </button>
              </div>
            </div>
            <div className="h-60 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} opacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: COLORS.dimText }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: COLORS.dimText }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke={COLORS.chart1} 
                    strokeWidth={2}
                    dot={{ stroke: COLORS.chart1, strokeWidth: 2, r: 4, fill: COLORS.background }}
                    activeDot={{ r: 6, fill: COLORS.chart1, stroke: COLORS.background }}
                    name="Applications"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="matches" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    dot={{ stroke: COLORS.primary, strokeWidth: 2, r: 4, fill: COLORS.background }}
                    activeDot={{ r: 6, fill: COLORS.primary, stroke: COLORS.background }}
                    name="Matches"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversion" 
                    stroke={COLORS.chart2} 
                    strokeWidth={2}
                    dot={{ stroke: COLORS.chart2, strokeWidth: 2, r: 4, fill: COLORS.background }}
                    activeDot={{ r: 6, fill: COLORS.chart2, stroke: COLORS.background }}
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.dimText }}>Match Score Distribution</h3>
              <button 
                className="text-xs font-medium flex items-center hover:underline"
                style={{ color: COLORS.primary }}
                onClick={() => alert('Showing score distribution details')}
              >
                Details <ChevronRight size={14} className="ml-0.5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2 mt-4">
              {[
                { label: '90-100%', count: filteredMatches.filter(m => m.score >= 90).length, color: COLORS.primary },
                { label: '80-89%', count: filteredMatches.filter(m => m.score >= 80 && m.score < 90).length, color: COLORS.chart1 },
                { label: '70-79%', count: filteredMatches.filter(m => m.score >= 70 && m.score < 80).length, color: COLORS.chart2 },
                { label: '60-69%', count: filteredMatches.filter(m => m.score >= 60 && m.score < 70).length, color: COLORS.warning },
                { label: '<60%', count: filteredMatches.filter(m => m.score < 60).length, color: COLORS.danger }
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-xs" style={{ color: COLORS.dimText }}>{item.label}</div>
                  <div className="flex-1 h-8 rounded-md overflow-hidden relative" style={{ backgroundColor: COLORS.panelBg }}>
                    <div 
                      className="h-full absolute left-0 top-0 flex items-center px-2 justify-end transition-all duration-1000 ease-out rounded-md"
                      style={{ 
                        width: `${(item.count / Math.max(1, filteredMatches.length)) * 100}%`, 
                        backgroundColor: item.color,
                        boxShadow: `0 0 6px ${item.color}40`
                      }}
                    >
                      <span className="text-xs font-medium text-white">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sector Focus */}
          <div 
            className="p-4 rounded-xl border"
            style={{ 
              backgroundColor: COLORS.background,
              borderColor: COLORS.border,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.dimText }}>Sector Focus</h3>
              <button 
                className="text-xs font-medium flex items-center hover:underline"
                style={{ color: COLORS.primary }}
                onClick={() => setShowFilters(true)}
              >
                Filter <Filter size={14} className="ml-0.5" />
              </button>
            </div>
            
            <div className="h-48 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Agriculture', value: filteredMatches.filter(m => m.sector === 'Agriculture').length },
                      { name: 'Energy', value: filteredMatches.filter(m => m.sector === 'Energy').length },
                      { name: 'Water', value: filteredMatches.filter(m => m.sector === 'Water').length },
                      { name: 'Construction', value: filteredMatches.filter(m => m.sector === 'Construction').length },
                      { name: 'Other', value: filteredMatches.filter(m => !['Agriculture', 'Energy', 'Water', 'Construction'].includes(m.sector)).length }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell key="agriculture" fill={COLORS.primary} />
                    <Cell key="energy" fill={COLORS.chart1} />
                    <Cell key="water" fill={COLORS.chart2} />
                    <Cell key="construction" fill={COLORS.chart3} />
                    <Cell key="other" fill={COLORS.highlight} />
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} matches`, name]}
                    contentStyle={{ 
                      backgroundColor: COLORS.background,
                      borderColor: COLORS.border,
                      borderRadius: '0.5rem',
                      color: COLORS.text
                    }}
                    itemStyle={{ color: COLORS.text }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS.primary }}></div>
                <span style={{ color: COLORS.dimText }}>Agriculture</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS.chart1 }}></div>
                <span style={{ color: COLORS.dimText }}>Energy</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS.chart2 }}></div>
                <span style={{ color: COLORS.dimText }}>Water</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS.chart3 }}></div>
                <span style={{ color: COLORS.dimText }}>Construction</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS.highlight }}></div>
                <span style={{ color: COLORS.dimText }}>Other</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Matches Table */}
        <div 
          className="rounded-xl overflow-hidden border"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            backgroundColor: COLORS.background,
            borderColor: COLORS.border
          }}
        >
          <div 
            className="p-4 border-b flex justify-between items-center"
            style={{ borderColor: COLORS.border }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center" style={{ color: COLORS.dimText }}>
              <Zap size={14} className="mr-2" style={{ color: COLORS.primary }} />
              {showAllMatches ? 'All Matching Startups' : 'Top Matching Startups'}
            </h3>
            <button 
              className="text-xs font-medium flex items-center hover:underline"
              style={{ color: COLORS.primary }}
              onClick={() => {
                setShowAllMatches(!showAllMatches);
                if (showAllMatches) setCurrentPage(1);
              }}
            >
              {showAllMatches ? 'Show less' : 'View all'} <ChevronRight size={14} className="ml-0.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: COLORS.border }}>
              <thead className="" style={{ backgroundColor: COLORS.panelBg }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.dimText }}>Startup</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.dimText }}>Sector</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.dimText }}>Match Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.dimText }}>Funding</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.dimText }}>Employees</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.dimText }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.border }}>
                {filteredMatches.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-sm" style={{ color: COLORS.dimText }}>
                      No matches found with current filters
                    </td>
                  </tr>
                ) : (
                  currentMatches.map((match) => (
                    <React.Fragment key={match.id}>
                      <tr 
                        className={`transition-colors cursor-pointer ${
                          hoveredItem === match.id ? 'bg-gray-50' : ''
                        }`}
                        style={{ 
                          backgroundColor: hoveredItem === match.id ? COLORS.panelBg : COLORS.background
                        }}
                        onMouseEnter={() => setHoveredItem(match.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                              style={{ 
                                background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)`,
                                boxShadow: `0 2px 6px ${COLORS.primaryDark}20`
                              }}
                            >
                              <span className="text-white font-medium">{match.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium" style={{ color: COLORS.text }}>{match.name}</div>
                              <div className="text-xs" style={{ color: COLORS.dimText }}>ID: {match.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span 
                            className="inline-flex px-2 py-0.5 text-xs rounded-full border"
                            style={{ 
                              backgroundColor: 
                                match.sector === 'Agriculture' ? `${COLORS.primaryLight}` : 
                                match.sector === 'Energy' ? `${COLORS.highlightLight}` :
                                match.sector === 'Water' ? `${COLORS.highlightLight}` :
                                `${COLORS.highlightLight}`,
                              color:
                                match.sector === 'Agriculture' ? COLORS.primary : 
                                match.sector === 'Energy' ? COLORS.highlight :
                                match.sector === 'Water' ? COLORS.highlight :
                                COLORS.highlight,
                              borderColor:
                                match.sector === 'Agriculture' ? COLORS.primary : 
                                match.sector === 'Energy' ? COLORS.highlight :
                                match.sector === 'Water' ? COLORS.highlight :
                                COLORS.highlight
                            }}
                          >
                            {match.sector}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 relative flex items-center justify-center"
                              style={{ 
                                filter: hoveredItem === match.id ? 'drop-shadow(0 0 4px rgba(76, 175, 80, 0.2))' : 'none'
                              }}
                            >
                              <svg width="40" height="40" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="18" fill="none" stroke={COLORS.border} strokeWidth="4" />
                                <circle 
                                  cx="20" cy="20" r="18" 
                                  fill="none" 
                                  stroke={COLORS.primary} 
                                  strokeWidth="4"
                                  strokeDasharray={`${(match.score / 100) * 113} 113`}
                                  strokeDashoffset="28"
                                  transform="rotate(-90 20 20)"
                                />
                              </svg>
                              <span className="absolute text-xs font-medium" style={{ color: COLORS.text }}>{match.score}</span>
                            </div>
                            <div 
                              className={`ml-2 h-2 rounded-full transition-all duration-500 ${
                                hoveredItem === match.id ? 'w-16' : 'w-12'
                              }`}
                              style={{ 
                                backgroundImage: 
                                  match.score >= 90 ? `linear-gradient(to right, ${COLORS.primary}, ${COLORS.primaryLight})` :
                                  match.score >= 80 ? `linear-gradient(to right, ${COLORS.primary}, ${COLORS.highlightLight})` :
                                  `linear-gradient(to right, ${COLORS.warning}, ${COLORS.highlightLight})`
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                          {match.funding}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                          {match.employees}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: COLORS.text }}>
                          <div className="flex space-x-2">
                            <button 
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                              style={{ 
                                backgroundColor: hoveredItem === match.id ? COLORS.primaryLight : 'transparent',
                                color: COLORS.primary
                              }}
                              title="View Details"
                              onClick={(e) => { e.stopPropagation(); alert(`Viewing details for ${match.name}`); }}
                            >
                              <ChevronRight size={16} />
                            </button>
                            <button 
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                              style={{ color: COLORS.dimText }}
                              title="More Options"
                              onClick={(e) => { e.stopPropagation(); setExpandedMatch(expandedMatch === match.id ? null : match.id); }}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedMatch === match.id && (
                        <tr className="" style={{ backgroundColor: COLORS.panelBg }}>
                          <td colSpan="6" className="px-4 py-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium" style={{ color: COLORS.text }}>Contact</p>
                                <p style={{ color: COLORS.dimText }}>{match.contact}</p>
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: COLORS.text }}>Stage</p>
                                <p style={{ color: COLORS.dimText }}>{match.stage}</p>
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: COLORS.text }}>Location</p>
                                <p style={{ color: COLORS.dimText }}>{match.location}</p>
                              </div>
                              <div className="md:col-span-3 flex justify-end space-x-2 pt-2">
                                <button 
                                  className="px-3 py-1 text-xs rounded-md transition-colors"
                                  style={{ 
                                    backgroundColor: COLORS.primary,
                                    color: 'white'
                                  }}
                                  onClick={() => alert(`Contacting ${match.name}...`)}
                                >
                                  Contact
                                </button>
                                <button 
                                  className="px-3 py-1 text-xs border rounded-md transition-colors hover:bg-gray-50"
                                  style={{ 
                                    borderColor: COLORS.border,
                                    color: COLORS.text
                                  }}
                                  onClick={() => alert(`Saving ${match.name}...`)}
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
          
          {/* Pagination */}
          {!showAllMatches && renderPagination()}
        </div>
        
        {/* Metric Breakdown */}
        <div 
          className="mt-5 rounded-xl overflow-hidden border"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            backgroundColor: COLORS.background,
            borderColor: COLORS.border
          }}
        >
          <div 
            className="p-4 border-b"
            style={{ borderColor: COLORS.border }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider flex items-center" style={{ color: COLORS.dimText }}>
              <ChevronDown size={14} className="mr-2" style={{ color: COLORS.primary }} />
              Detailed Metric Breakdown
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {matchingMetrics.map((metric, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-full h-2 rounded-full mb-2 transition-all duration-1000 ease-out ${
                      pulsing && index === 3 ? 'scale-110' : ''
                    }`}
                    style={{ 
                      background: `linear-gradient(to right, ${
                        metric.value >= 80 ? COLORS.primary : 
                        metric.value >= 70 ? COLORS.chart1 : 
                        metric.value >= 60 ? COLORS.warning : COLORS.danger
                      } ${metric.value}%, ${COLORS.border} ${metric.value}%)`,
                      boxShadow: pulsing && index === 3 ? `0 0 8px ${COLORS.primary}40` : 'none'
                    }}
                  ></div>
                  <div className="text-sm font-medium text-center" style={{ color: COLORS.text }}>{metric.metric}</div>
                  <div className="text-xs text-center" style={{ color: COLORS.dimText }}>{metric.value}%</div>
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