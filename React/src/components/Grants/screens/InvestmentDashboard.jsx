import React, { useState, useMemo } from 'react';
import { 
  MapPin, Filter, ArrowUpRight, Eye, PlusCircle, Search, X 
} from 'lucide-react';

const InvestmentOpportunities = () => {
  const [filters, setFilters] = useState({
    sector: 'All',
    minInvestment: '',
    maxInvestment: '',
    stage: 'All'
  });

  const [opportunities, setOpportunities] = useState([
    { 
      id: 1,
      name: 'Solar Farm Kenya', 
      sector: 'Renewable Energy',
      location: 'Nairobi, Kenya',
      matchScore: 92,
      stage: 'Series A',
      amount: 500000,
      status: 'Ideal Match',
      impactMetrics: {
        jobsCreated: 45,
        carbonOffset: 1200,
        energyGenerated: 2.5
      }
    },
    { 
      id: 2,
      name: 'AgriTech Tanzania', 
      sector: 'Agriculture',
      location: 'Dar es Salaam, Tanzania',
      matchScore: 84,
      stage: 'Seed',
      amount: 250000,
      status: 'Strong Match',
      impactMetrics: {
        farmersSupported: 250,
        cropYieldImprovement: 35,
        waterConservation: 500000
      }
    }
  ]);

  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    sector: '',
    location: '',
    amount: '',
    stage: '',
    impactMetrics: {}
  });

  const [isAddingOpportunity, setIsAddingOpportunity] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sectorOptions = ['All', 'Renewable Energy', 'Agriculture', 'Technology'];
  const stageOptions = ['All', 'Seed', 'Series A', 'Growth'];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSector = filters.sector === 'All' || opp.sector === filters.sector;
      const matchesMinInvestment = !filters.minInvestment || opp.amount >= parseFloat(filters.minInvestment);
      const matchesMaxInvestment = !filters.maxInvestment || opp.amount <= parseFloat(filters.maxInvestment);
      const matchesStage = filters.stage === 'All' || opp.stage === filters.stage;
      const matchesSearch = !searchTerm || 
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opp.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSector && matchesMinInvestment && matchesMaxInvestment && matchesStage && matchesSearch;
    });
  }, [opportunities, filters, searchTerm]);

  const handleAddOpportunity = (e) => {
    e.preventDefault();
    if (!newOpportunity.name || !newOpportunity.sector || !newOpportunity.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const opportunityToAdd = {
      ...newOpportunity,
      id: opportunities.length + 1,
      matchScore: Math.floor(Math.random() * 20) + 80,
      status: 'Strong Match',
      amount: parseFloat(newOpportunity.amount),
      impactMetrics: newOpportunity.impactMetrics || {}
    };

    setOpportunities([...opportunities, opportunityToAdd]);
    setNewOpportunity({
      name: '',
      sector: '',
      location: '',
      amount: '',
      stage: '',
      impactMetrics: {}
    });
    setIsAddingOpportunity(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOpportunity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extralight tracking-tight text-neutral-800 mb-2">
              Investment Opportunities
            </h1>
            <p className="text-neutral-500 text-sm">
              Discover impact-driven investments across emerging markets
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search opportunities"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-600 transition-colors"
              />
              <Search className="absolute left-0 top-3 text-neutral-400" size={18} />
            </div>
            <button 
              onClick={() => setIsAddingOpportunity(!isAddingOpportunity)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {isAddingOpportunity ? <X size={24} /> : <PlusCircle size={24} />}
            </button>
          </div>
        </header>

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
              <button 
                type="submit"
                className="md:col-span-2 bg-neutral-800 text-white py-3 rounded-md hover:bg-neutral-700 transition-colors"
              >
                Add Investment Opportunity
              </button>
            </form>
          </div>
        )}

        {/* Opportunities List */}
        <div className="space-y-6">
          {filteredOpportunities.map((opp) => (
            <div 
              key={opp.id} 
              className="bg-white border border-neutral-200 rounded-lg p-6 flex justify-between items-start hover:shadow-sm transition-shadow"
            >
              <div className="flex-grow">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-medium mr-4">{opp.name}</h2>
                  <span className="text-sm text-neutral-500 flex items-center">
                    <MapPin size={14} className="mr-2" /> {opp.location}
                  </span>
                </div>
                
                <div className="flex space-x-4 text-neutral-600 mb-4">
                  <span>{opp.sector}</span>
                  <span>{opp.stage}</span>
                  <span className="font-semibold">${opp.amount.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-neutral-700">
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

              <div className="flex flex-col items-end">
                <div className="mb-4">
                  <span className="text-sm text-neutral-500">Match Score</span>
                  <div className="text-2xl font-light">{opp.matchScore}%</div>
                </div>
                <div className="flex space-x-3">
                  <button className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center">
                    <Eye className="mr-2" size={16} /> View
                  </button>
                  <button className="text-emerald-600 hover:text-emerald-800 transition-colors flex items-center">
                    <ArrowUpRight className="mr-2" size={16} /> Invest
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentOpportunities;