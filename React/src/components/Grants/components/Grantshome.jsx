import React, { useState, useMemo, useEffect } from 'react';
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
  Rocket
} from 'lucide-react';

const TujitumeDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const opportunities = [
    {
      id: 1,
      type: 'grant',
      title: 'Agricultural Innovation Fund',
      organization: 'Green Future Initiative',
      amount: 50000,
      sector: 'Agriculture',
      matchScore: 85,
      status: 'Open',
      impact: ['Food Security', 'Rural Empowerment'],
      region: 'Eastern Kenya'
    },
    {
      id: 2,
      type: 'investment',
      title: 'Renewable Energy Catalyst',
      organization: 'Climate Ventures',
      amount: 100000,
      sector: 'Renewable Energy',
      matchScore: 72,
      status: 'Upcoming',
      impact: ['Carbon Reduction', 'Clean Tech'],
      region: 'Rift Valley'
    },
    {
      id: 3,
      type: 'grant',
      title: 'Tech Social Impact',
      organization: 'Digital Leap Foundation',
      amount: 75000,
      sector: 'Technology',
      matchScore: 65,
      status: 'Closed',
      impact: ['Digital Inclusion', 'Youth Empowerment'],
      region: 'Nairobi'
    }
  ];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => 
      (filter === 'all' || opp.type === filter) &&
      opp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filter, searchTerm]);

  const statsCards = [
    {
      icon: <Award className="text-gray-600" />,
      title: 'Total Opportunities',
      value: '18',
      subtext: 'Across 3 Sectors'
    },
    {
      icon: <DollarSign className="text-green-900" />,
      title: 'Total Funding',
      value: '$425K',
      subtext: 'Committed Capital'
    },
    {
      icon: <TrendingUp className="text-lime-600" />,
      title: 'Success Rate',
      value: '75%',
      subtext: 'Funded Startups'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-900 min-h-screen p-6 container mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">
            Tujitume Funding Hub
          </h1>
          <p className="text-neutral-600 text-sm flex items-center">
            <Rocket className="mr-2 text-orange-500" size={16} />
            Powering African Startup Ecosystems
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search opportunities"
              className="pl-8 pr-4 py-2 border border-neutral-200 rounded-lg text-sm w-64 shadow-sm focus:ring-2 focus:ring-blue-200 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-3 text-neutral-400" size={16} />
          </div>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-5 mb-8">
  {statsCards.map((card, index) => (
    <div 
      key={index} 
      className={`bg-white rounded-xl p-5 flex items-start space-x-4 border border-gray-100 hover:border-green-100 hover:shadow-sm transition-all ${
        animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${index === 1 ? 'ring-1 ring-green-50' : ''}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className={`p-3 rounded-lg ${index === 1 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'} shadow-xs`}>
        {React.cloneElement(card.icon, { size: 20 })}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{card.title}</p>
        <h3 className="text-2xl font-semibold text-gray-900 mb-0.5">
          {card.value}
          {index === 1 && (
            <span className="ml-2 text-xs font-normal text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
              +5.2%
            </span>
          )}
        </h3>
        <p className="text-xs text-gray-500 flex items-center">
          {card.subtext}
          {index === 1 && (
            <svg className="w-3 h-3 text-green-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          )}
        </p>
      </div>
    </div>
  ))}
</section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Zap className="mr-2 text-yellow-500" size={20} />
            Active Opportunities
          </h2>
          <div className="flex space-x-2">
            {['all', 'grant', 'investment'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider transition ${
                  filter === type 
                    ? 'bg-gradient-to-r from-slate-600 to-green-600 text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {filteredOpportunities.map((opp) => (
            <div 
              key={opp.id} 
              className="bg-white border border-neutral-100 rounded-lg p-4 hover:shadow-xl transition transform hover:-translate-y-2 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1 group-hover:text-blue-600 transition">
                    {opp.title}
                  </h3>
                  <span className="text-xs text-neutral-500 uppercase flex items-center">
                    <MapPin size={12} className="mr-1 text-neutral-400" />
                    {opp.region}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  opp.status === 'Open' ? 'bg-green-50 text-green-700' :
                  opp.status === 'Closed' ? 'bg-red-50 text-red-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {opp.status}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex space-x-1 mb-2">
                  {opp.impact.map((impact, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                    >
                      {impact}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <div className="text-sm">
                  <div className="text-neutral-600 flex items-center">
                    <DollarSign size={14} className="mr-1 text-green-500" />
                    Amount
                  </div>
                  <div className="font-semibold">${opp.amount.toLocaleString()}</div>
                </div>
                <div className="text-sm">
                  <div className="text-neutral-600 flex items-center">
                    <Star size={14} className="mr-1 text-yellow-500" />
                    Match
                  </div>
                  <div className="font-semibold text-neutral-800">{opp.matchScore}%</div>
                </div>
                <button className="text-neutral-700 hover:text-blue-600 transition">
                  <ChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
  <div className="flex items-start justify-between">
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1 flex items-center">
        <Globe className="mr-2 text-yellow-600" size={18} />
        Impact Snapshot
      </h2>
      <p className="text-xs text-gray-500">Quarterly impact metrics and regional coverage</p>
    </div>
    <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
      View Details →
    </button>
  </div>

  <div className="grid md:grid-cols-3 gap-5 mt-6">
    <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <h3 className="font-medium text-gray-700 text-sm mb-3">Sectors Supported</h3>
      <ul className="space-y-2.5">
        <li className="flex items-center text-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2.5"></span>
          <span className="text-gray-600">Agriculture</span>
          <span className="ml-auto text-xs text-gray-400">42%</span>
        </li>
        <li className="flex items-center text-sm">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2.5"></span>
          <span className="text-gray-600">Renewable Energy</span>
          <span className="ml-auto text-xs text-gray-400">33%</span>
        </li>
        <li className="flex items-center text-sm">
          <span className="w-2 h-2 bg-violet-500 rounded-full mr-2.5"></span>
          <span className="text-gray-600">Technology</span>
          <span className="ml-auto text-xs text-gray-400">25%</span>
        </li>
      </ul>
    </div>

    <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <h3 className="font-medium text-gray-700 text-sm mb-3">Regional Reach</h3>
      <div className="flex flex-wrap gap-2">
        <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-xs border border-gray-200">
          Eastern Kenya
        </span>
        <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-xs border border-gray-200">
          Rift Valley
        </span>
        <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full text-xs border border-gray-200">
          Nairobi
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-3">Expanding to 2 new regions in Q3</p>
    </div>

    <div className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <h3 className="font-medium text-gray-700 text-sm mb-3">Key Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-semibold text-gray-900">12</div>
          <div className="text-xs text-gray-500 mt-1">Active Grants</div>
          <div className="text-xs text-emerald-600 mt-1">↑ 2 from last quarter</div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-gray-900">6</div>
          <div className="text-xs text-gray-500 mt-1">Investment Rounds</div>
          <div className="text-xs text-blue-600 mt-1">3 in progress</div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default TujitumeDashboard;