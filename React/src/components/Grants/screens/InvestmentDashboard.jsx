import React, { useState, useMemo } from 'react';
import { 
  MapPin, Filter, ArrowUpRight, Eye, PlusCircle, Search, X,
  BadgePercent, Venus, Clock, Home, LocateFixed
} from 'lucide-react';
import { Link } from 'react-router-dom';

const calculateMatchScore = (opportunity, investorPreferences) => {
  let score = 0;
  
  if (opportunity.sector === investorPreferences.sector) score += 30;
  if (opportunity.location === investorPreferences.location) score += 15;
  if (opportunity.stage === investorPreferences.stage) score += 10;
  if (opportunity.revenue >= investorPreferences.minRevenue) score += 10;
  if (opportunity.teamExperience >= investorPreferences.teamThreshold) score += 10;
  if (opportunity.impactScore >= investorPreferences.impactThreshold) score += 10;
  if (opportunity.milestoneSuccessRate >= 70) score += 10;
  if (opportunity.documentsComplete) score += 5;

  if (opportunity.isFemaleLed) score += 5;
  if (opportunity.isYouthLed) score += 5;
  if (opportunity.isRuralBased) score += 5;
  if (opportunity.usesLocalSourcing) score += 5;

  return Math.min(score, 100);
};

const InvestmentOpportunities = () => {
  const investorPreferences = {
    sector: 'Renewable Energy',
    location: 'Kenya',
    stage: 'Series A',
    minRevenue: 10000,
    teamThreshold: 3,
    impactThreshold: 5
  };

  const [filters, setFilters] = useState({
    sector: 'All',
    minInvestment: '',
    maxInvestment: '',
    stage: 'All',
    priorities: {
      femaleLed: false,
      youthLed: false,
      ruralBased: false,
      localSourcing: false
    }
  });

  const [opportunities, setOpportunities] = useState([
    { 
      id: 1,
      name: 'Solar Farm Kenya', 
      sector: 'Renewable Energy',
      location: 'Nairobi, Kenya',
      stage: 'Series A',
      amount: 500000,
      revenue: 150000,
      teamExperience: 5,
      impactScore: 8,
      milestoneSuccessRate: 85,
      documentsComplete: true,
      isFemaleLed: true,
      isYouthLed: false,
      isRuralBased: true,
      usesLocalSourcing: true,
      impactMetrics: {
        jobsCreated: 45,
        carbonOffset: 1200,
        energyGenerated: '2.5 MW'
      }
    },
    { 
      id: 2,
      name: 'AgriTech Tanzania', 
      sector: 'Agriculture',
      location: 'Dar es Salaam, Tanzania',
      stage: 'Seed',
      amount: 250000,
      revenue: 50000,
      teamExperience: 4,
      impactScore: 7,
      milestoneSuccessRate: 60,
      documentsComplete: true,
      isFemaleLed: false,
      isYouthLed: true,
      isRuralBased: true,
      usesLocalSourcing: false,
      impactMetrics: {
        farmersSupported: 250,
        cropYieldImprovement: '35%',
        waterConservation: '500,000L'
      }
    }
  ]);

  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    sector: '',
    location: '',
    amount: '',
    stage: '',
    isFemaleLed: false,
    isYouthLed: false,
    isRuralBased: false,
    usesLocalSourcing: false,
    impactMetrics: {}
  });

  const [isAddingOpportunity, setIsAddingOpportunity] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('discover');

  const sectorOptions = ['All', 'Renewable Energy', 'Agriculture', 'Technology'];
  const stageOptions = ['All', 'Seed', 'Series A', 'Growth'];

  const scoredOpportunities = useMemo(() => {
    return opportunities.map(opp => ({
      ...opp,
      matchScore: calculateMatchScore(opp, investorPreferences),
      status: calculateMatchStatus(calculateMatchScore(opp, investorPreferences))
    }));
  }, [opportunities]);

  function calculateMatchStatus(score) {
    if (score >= 80) return 'Ideal Match';
    if (score >= 60) return 'Strong Match';
    return 'Needs Revision';
  }

  const filteredOpportunities = useMemo(() => {
    return scoredOpportunities.filter(opp => {
      const matchesSector = filters.sector === 'All' || opp.sector === filters.sector;
      const matchesMinInvestment = !filters.minInvestment || opp.amount >= parseFloat(filters.minInvestment);
      const matchesMaxInvestment = !filters.maxInvestment || opp.amount <= parseFloat(filters.maxInvestment);
      const matchesStage = filters.stage === 'All' || opp.stage === filters.stage;
      const matchesSearch = !searchTerm || 
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opp.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriorities = (
        (!filters.priorities.femaleLed || opp.isFemaleLed) &&
        (!filters.priorities.youthLed || opp.isYouthLed) &&
        (!filters.priorities.ruralBased || opp.isRuralBased) &&
        (!filters.priorities.localSourcing || opp.usesLocalSourcing)
      );
      
      return matchesSector && matchesMinInvestment && matchesMaxInvestment && 
             matchesStage && matchesSearch && matchesPriorities;
    });
  }, [scoredOpportunities, filters, searchTerm]);

  const handleAddOpportunity = (e) => {
    e.preventDefault();
    if (!newOpportunity.name || !newOpportunity.sector || !newOpportunity.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const opportunityToAdd = {
      ...newOpportunity,
      id: opportunities.length + 1,
      revenue: 0,
      teamExperience: 0,
      impactScore: 0,
      milestoneSuccessRate: 0,
      documentsComplete: false,
      matchScore: 0
    };

    setOpportunities([...opportunities, opportunityToAdd]);
    setNewOpportunity({
      name: '',
      sector: '',
      location: '',
      amount: '',
      stage: '',
      isFemaleLed: false,
      isYouthLed: false,
      isRuralBased: false,
      usesLocalSourcing: false,
      impactMetrics: {}
    });
    setIsAddingOpportunity(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewOpportunity(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Ideal Match': return 'bg-green-100 text-green-800';
      case 'Strong Match': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Search className="absolute left-0 top-3 text-neutral-400" size={18} />
            </div>
            <button 
              onClick={() => setIsAddingOpportunity(!isAddingOpportunity)}
              className="px-4 py-2 bg-white border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
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
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'discover' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'watchlist' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Watchlist
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'active' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Active Investments
          </button>
        </div>

        {/* Priority Filters */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6 shadow-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">Priority Filters:</span>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.priorities.femaleLed}
                onChange={() => setFilters(prev => ({
                  ...prev,
                  priorities: {
                    ...prev.priorities,
                    femaleLed: !prev.priorities.femaleLed
                  }
                }))}
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
                onChange={() => setFilters(prev => ({
                  ...prev,
                  priorities: {
                    ...prev.priorities,
                    youthLed: !prev.priorities.youthLed
                  }
                }))}
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
                onChange={() => setFilters(prev => ({
                  ...prev,
                  priorities: {
                    ...prev.priorities,
                    ruralBased: !prev.priorities.ruralBased
                  }
                }))}
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
                onChange={() => setFilters(prev => ({
                  ...prev,
                  priorities: {
                    ...prev.priorities,
                    localSourcing: !prev.priorities.localSourcing
                  }
                }))}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <LocateFixed size={14} /> Local Sourcing
              </span>
            </label>
          </div>
        </div>

        {/* Add Opportunity Form */}
        {isAddingOpportunity && (
          <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8 shadow-sm">
            <form onSubmit={handleAddOpportunity} className="grid md:grid-cols-2 gap-6">
              <input 
                type="text"
                name="name"
                value={newOpportunity.name}
                onChange={handleInputChange}
                placeholder="Opportunity Name"
                className="border-b border-neutral-300 pb-2 focus:outline-none focus:border-neutral-600"
                required
              />
              <select
                name="sector"
                value={newOpportunity.sector}
                onChange={handleInputChange}
                className="border-b border-neutral-300 pb-2 focus:outline-none focus:border-neutral-600"
                required
              >
                <option value="">Select Sector</option>
                {sectorOptions.filter(s => s !== 'All').map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              <input 
                type="text"
                name="location"
                value={newOpportunity.location}
                onChange={handleInputChange}
                placeholder="Location"
                className="border-b border-neutral-300 pb-2 focus:outline-none focus:border-neutral-600"
              />
              <input 
                type="number"
                name="amount"
                value={newOpportunity.amount}
                onChange={handleInputChange}
                placeholder="Investment Amount"
                className="border-b border-neutral-300 pb-2 focus:outline-none focus:border-neutral-600"
                required
                min="0"
              />
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFemaleLed"
                    checked={newOpportunity.isFemaleLed}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Female-Led
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isYouthLed"
                    checked={newOpportunity.isYouthLed}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Youth-Led
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isRuralBased"
                    checked={newOpportunity.isRuralBased}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Rural-Based
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="usesLocalSourcing"
                    checked={newOpportunity.usesLocalSourcing}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Local Sourcing
                </label>
              </div>
              <button 
                type="submit"
                className="md:col-span-2 bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium"
              >
                Add Investment Opportunity
              </button>
            </form>
          </div>
        )}

        {/* Main Content */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opp) => (
                <div 
                  key={opp.id} 
                  className="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start hover:shadow-sm transition-shadow"
                >
                  <div className="flex-grow w-full">
                    <div className="flex flex-col md:flex-row md:items-center mb-4 gap-2 md:gap-4">
                      <h2 className="text-xl font-medium">{opp.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(opp.status)}`}>
                          {opp.status}
                        </span>
                        <span className="text-sm text-neutral-500 flex items-center">
                          <MapPin size={14} className="mr-1" /> {opp.location}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-neutral-600 mb-4">
                      <span className="flex items-center gap-1">
                        <BadgePercent size={14} /> {opp.sector}
                      </span>
                      <span>{opp.stage}</span>
                      <span className="font-semibold">${opp.amount.toLocaleString()}</span>
                      {opp.isFemaleLed && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Venus size={14} /> Female-Led
                        </span>
                      )}
                      {opp.isRuralBased && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Home size={14} /> Rural
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-neutral-700 mb-4">
                      {Object.entries(opp.impactMetrics).map(([key, value]) => (
                        <div key={key}>
                          <span className="block text-neutral-500 uppercase text-xs mb-1">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end w-full md:w-auto gap-4">
                    <div className="flex justify-between w-full md:w-auto gap-6">
                      <div>
                        <span className="text-sm text-neutral-500">Match Score</span>
                        <div className="text-2xl font-light">{opp.matchScore}%</div>
                      </div>
                      <div className="hidden md:block border-l border-neutral-200"></div>
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-500">Potential ROI</span>
                        <div className="text-2xl font-light">
                          {opp.sector === 'Renewable Energy' ? '18-25%' : 
                           opp.sector === 'Agriculture' ? '12-20%' : '22-30%'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full">
                      <button className="flex-1 text-neutral-700 whitespace-nowrap hover:text-neutral-900 transition-colors flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50">
                        <Eye size={16} /> View Details
                      </button>
                      <Link 
  to={`/grants-overview/funding/deals/${opp.id}`}
  state={{ opportunity: opp }}
  className="flex-1 text-white whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium"
>
  <ArrowUpRight size={16} /> Open Deal Room
</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
                <p className="text-neutral-500">No matching opportunities found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
            <p className="text-neutral-500">Your watchlist is currently empty. Save opportunities to track them here.</p>
          </div>
        )}

        {activeTab === 'active' && (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
            <p className="text-neutral-500">You don't have any active investments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentOpportunities;