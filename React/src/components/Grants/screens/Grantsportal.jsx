import React, { useState } from 'react';
import { 
  MapPin, Rocket, Users, Lightbulb, TrendingUp, Globe, 
  CheckCircle2, XCircle, FileText, Upload, Download, 
  Plus, Filter, Search, ChevronDown, ChevronUp, Calendar
} from 'lucide-react';

const TujitumeGrantPortal = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sectors: [],
    regions: [],
    amountRange: [0, 1000000]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [grantApplications, setGrantApplications] = useState([]);
  const [newGrant, setNewGrant] = useState({
    title: '',
    organization: '',
    impact: '',
    totalFund: '',
    maxGrantPerStartup: '',
    regions: [],
    sectors: [],
    deadline: '',
    keyFocus: [],
    documentsRequired: []
  });

  // Enhanced grant data with more fields
  const [grantOpportunities, setGrantOpportunities] = useState([
    {
      id: 1,
      title: 'Agri-Tech Innovation Fund',
      organization: 'Green Future Foundation',
      impact: 'Transforming Small-Scale Farming',
      totalFund: 250000,
      maxGrantPerStartup: 50000,
      regions: ['Kenya', 'Uganda', 'Tanzania'],
      sectors: ['Agriculture', 'Technology'],
      deadline: '2025-06-30',
      matchScore: 87,
      keyFocus: ['Tech Integration', 'Sustainable Agriculture'],
      documentsRequired: ['Business Plan', 'Financial Projections', 'Team CVs'],
      status: 'open'
    },
    {
      id: 2,
      title: 'Renewable Energy Catalyst',
      organization: 'Power Africa Collective',
      impact: 'Rural Electrification Solutions',
      totalFund: 500000,
      maxGrantPerStartup: 75000,
      regions: ['Rwanda', 'Ethiopia', 'Kenya'],
      sectors: ['Energy', 'Community Development'],
      deadline: '2025-07-15',
      matchScore: 93,
      keyFocus: ['Off-Grid Solutions', 'Community Empowerment'],
      documentsRequired: ['Technical Proposal', 'Impact Assessment', 'Budget'],
      status: 'open'
    }
  ]);

  // Filter grants based on search and filters
  const filteredGrants = grantOpportunities.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         grant.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSectors = filters.sectors.length === 0 || 
                          filters.sectors.some(sector => grant.sectors.includes(sector));
    
    const matchesRegions = filters.regions.length === 0 || 
                          filters.regions.some(region => grant.regions.includes(region));
    
    const matchesAmount = grant.maxGrantPerStartup >= filters.amountRange[0] && 
                         grant.maxGrantPerStartup <= filters.amountRange[1];
    
    return matchesSearch && matchesSectors && matchesRegions && matchesAmount;
  });

  // Dashboard metrics
  const dashboardMetrics = {
    activeApplications: grantApplications.length,
    totalFundingPotential: grantApplications.reduce((sum, app) => sum + (app.grant?.maxGrantPerStartup || 0), 0),
    countriesCovered: new Set(grantApplications.flatMap(app => app.grant?.regions || [])).size,
    matchingGrants: filteredGrants.length
  };

  const handleDocumentUpload = (grantId, documentName) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.xlsx,.pptx';
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploadedDocuments(prev => ({
          ...prev,
          [`${grantId}-${documentName}`]: {
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: file.name.split('.').pop()
          }
        }));
      }
    };
    
    fileInput.click();
  };

  const submitApplication = (grant) => {
    const newApplication = {
      id: Date.now(),
      grant,
      status: Math.random() > 0.5 ? 'Accepted' : 'Rejected',
      date: new Date().toISOString().split('T')[0],
      documents: uploadedDocuments
    };
    
    setGrantApplications([...grantApplications, newApplication]);
    setSelectedGrant(null);
    setUploadedDocuments({});
    alert('Application submitted successfully!');
  };

  const createNewGrant = () => {
    if (!newGrant.title || !newGrant.organization || !newGrant.totalFund) {
      alert('Please fill in all required fields');
      return;
    }

    const grant = {
      id: grantOpportunities.length + 1,
      ...newGrant,
      totalFund: Number(newGrant.totalFund),
      maxGrantPerStartup: Number(newGrant.maxGrantPerStartup),
      matchScore: Math.floor(Math.random() * 30) + 70,
      status: 'open'
    };

    setGrantOpportunities([...grantOpportunities, grant]);
    setShowCreateModal(false);
    setNewGrant({
      title: '',
      organization: '',
      impact: '',
      totalFund: '',
      maxGrantPerStartup: '',
      regions: [],
      sectors: [],
      deadline: '',
      keyFocus: [],
      documentsRequired: []
    });
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-lime-700 to-gray-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Rocket className="text-white/70" size={36} />
          <span className="text-2xl font-bold">{dashboardMetrics.activeApplications}</span>
        </div>
        <h3 className="text-lg font-semibold">Active Applications</h3>
        <p className="text-white/80 text-sm">Your ongoing grant pursuits</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-600 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <TrendingUp className="text-white/70" size={36} />
          <span className="text-2xl font-bold">${dashboardMetrics.totalFundingPotential.toLocaleString()}</span>
        </div>
        <h3 className="text-lg font-semibold">Total Funding Potential</h3>
        <p className="text-white/80 text-sm">Grants you qualify for</p>
      </div>
      
      <div className="bg-gradient-to-br from-amber-600 to-orange-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Globe className="text-white/70" size={36} />
          <span className="text-2xl font-bold">{dashboardMetrics.matchingGrants}</span>
        </div>
        <h3 className="text-lg font-semibold">Matching Grants</h3>
        <p className="text-white/80 text-sm">Based on your profile</p>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-700 hover:text-black"
        >
          <Filter size={18} />
          <span>Filters</span>
          {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search grants..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sectors</label>
            <select 
              multiple
              className="w-full border rounded-lg p-2 h-32"
              onChange={(e) => setFilters({...filters, sectors: Array.from(e.target.selectedOptions, option => option.value)})}
            >
              <option value="Agriculture">Agriculture</option>
              <option value="Energy">Energy</option>
              <option value="Technology">Technology</option>
              <option value="Community Development">Community Development</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regions</label>
            <select 
              multiple
              className="w-full border rounded-lg p-2 h-32"
              onChange={(e) => setFilters({...filters, regions: Array.from(e.target.selectedOptions, option => option.value)})}
            >
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Ethiopia">Ethiopia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Range: ${filters.amountRange[0].toLocaleString()} - ${filters.amountRange[1].toLocaleString()}
            </label>
            <div className="flex space-x-4">
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={filters.amountRange[0]}
                onChange={(e) => setFilters({...filters, amountRange: [parseInt(e.target.value), filters.amountRange[1]]})}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={filters.amountRange[1]}
                onChange={(e) => setFilters({...filters, amountRange: [filters.amountRange[0], parseInt(e.target.value)]})}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGrantOpportunities = () => (
    <div className="space-y-6">
      {filteredGrants.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No grants match your current filters</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilters({
                sectors: [],
                regions: [],
                amountRange: [0, 1000000]
              });
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        filteredGrants.map(grant => (
          <div 
            key={grant.id} 
            className="bg-white border-l-4 border-indigo-600 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{grant.title}</h2>
                <p className="text-gray-600 mt-2">{grant.organization}</p>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-indigo-500" size={20} />
                <span className="text-gray-700">{grant.regions.join(', ')}</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Impact Focus</h3>
                <p className="text-gray-600">{grant.impact}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {grant.sectors.map(sector => (
                    <span key={sector} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Funding Details</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Lightbulb className="text-amber-500" size={20} />
                  <span>Total Fund: ${grant.totalFund.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Users className="text-green-500" size={20} />
                  <span>Max Per Startup: ${grant.maxGrantPerStartup.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Calendar className="text-blue-500" size={20} />
                  <span>Deadline: {new Date(grant.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Required Documents</h3>
                <ul className="mt-2 space-y-1">
                  {grant.documentsRequired.map(doc => (
                    <li key={doc} className="flex items-center space-x-2">
                      <FileText className="text-gray-500" size={16} />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                {grant.keyFocus.map(focus => (
                  <span 
                    key={focus} 
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                  >
                    {focus}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    grant.matchScore > 90 
                      ? 'bg-green-100 text-green-700' 
                      : grant.matchScore > 70
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {grant.matchScore}%
                </div>
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                  onClick={() => setSelectedGrant(grant)}
                >
                  <Upload size={16} />
                  <span>Apply Now</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderApplicationStatus = () => (
    <div className="space-y-6">
      {grantApplications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500">You haven't applied to any grants yet</p>
          <button 
            onClick={() => setActiveView('opportunities')}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Browse available grants
          </button>
        </div>
      ) : (
        grantApplications.map(application => (
          <div 
            key={application.id} 
            className={`bg-white border-l-4 ${
              application.status === 'Accepted' 
                ? 'border-green-500' 
                : 'border-red-500'
            } p-6 rounded-lg shadow-md`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{application.grant.title}</h3>
                <p className="text-gray-600">Submitted: {application.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                {application.status === 'Accepted' ? (
                  <CheckCircle2 className="text-green-500" size={24} />
                ) : (
                  <XCircle className="text-red-500" size={24} />
                )}
                <span className={`${
                  application.status === 'Accepted' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                } font-bold`}>
                  {application.status}
                </span>
              </div>
            </div>
            <div className={`mt-4 ${
              application.status === 'Accepted' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            } p-3 rounded-lg`}>
              <p>
                {application.status === 'Accepted' 
                  ? 'Congratulations! Your application has been shortlisted for further review.' 
                  : 'Your application needs improvement. Review feedback and reapply.'}
              </p>
              <div className="mt-2 flex space-x-4">
                <button className="flex items-center space-x-1">
                  <Download size={16} />
                  <span>Download Feedback</span>
                </button>
                <button className="flex items-center space-x-1">
                  <FileText size={16} />
                  <span>View Requirements</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderCreateGrantModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Create New Grant Opportunity</h2>
            <button 
              onClick={() => setShowCreateModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grant Title*</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newGrant.title}
                  onChange={(e) => setNewGrant({...newGrant, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization*</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newGrant.organization}
                  onChange={(e) => setNewGrant({...newGrant, organization: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impact Statement</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGrant.impact}
                onChange={(e) => setNewGrant({...newGrant, impact: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Fund Amount*</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newGrant.totalFund}
                  onChange={(e) => setNewGrant({...newGrant, totalFund: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Grant Per Startup*</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newGrant.maxGrantPerStartup}
                  onChange={(e) => setNewGrant({...newGrant, maxGrantPerStartup: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sectors</label>
                <select
                  multiple
                  className="w-full border rounded-lg p-2 h-32"
                  onChange={(e) => setNewGrant({...newGrant, sectors: Array.from(e.target.selectedOptions, option => option.value)})}
                >
                  <option value="Agriculture">Agriculture</option>
                  <option value="Energy">Energy</option>
                  <option value="Technology">Technology</option>
                  <option value="Community Development">Community Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regions</label>
                <select
                  multiple
                  className="w-full border rounded-lg p-2 h-32"
                  onChange={(e) => setNewGrant({...newGrant, regions: Array.from(e.target.selectedOptions, option => option.value)})}
                >
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Ethiopia">Ethiopia</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGrant.deadline}
                onChange={(e) => setNewGrant({...newGrant, deadline: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Focus Areas (comma separated)</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGrant.keyFocus.join(', ')}
                onChange={(e) => setNewGrant({...newGrant, keyFocus: e.target.value.split(',').map(item => item.trim())})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Documents (comma separated)</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGrant.documentsRequired.join(', ')}
                onChange={(e) => setNewGrant({...newGrant, documentsRequired: e.target.value.split(',').map(item => item.trim())})}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={createNewGrant}
              >
                Create Grant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className=" container">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Tujitume Grants</h1>
            <p className="text-gray-600">Empowering African Entrepreneurs</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg ${
                activeView === 'dashboard' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveView('opportunities')}
              className={`px-4 py-2 rounded-lg ${
                activeView === 'opportunities' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Opportunities
            </button>
            <button 
              onClick={() => setActiveView('status')}
              className={`px-4 py-2 rounded-lg ${
                activeView === 'status' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Applications
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Create Grant</span>
            </button>
          </div>
        </header>

        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'opportunities' && (
          <>
            {renderFilters()}
            {renderGrantOpportunities()}
          </>
        )}
        {activeView === 'status' && renderApplicationStatus()}
      </div>

      {/* Application Modal */}
      {selectedGrant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Apply for {selectedGrant.title}</h2>
                <button 
                  onClick={() => setSelectedGrant(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Required Documents</h3>
                  <ul className="space-y-2">
                    {selectedGrant.documentsRequired.map(doc => {
                      const docKey = `${selectedGrant.id}-${doc}`;
                      return (
                        <li key={doc} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{doc}</span>
                          {uploadedDocuments[docKey] ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                {uploadedDocuments[docKey].name} ({uploadedDocuments[docKey].size})
                              </span>
                              <button 
                                onClick={() => handleDocumentUpload(selectedGrant.id, doc)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm"
                              >
                                Change
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleDocumentUpload(selectedGrant.id, doc)}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                            >
                              <Upload size={16} />
                              <span>Upload</span>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Additional Information</h3>
                  <textarea 
                    className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell us about your project and how you'll use the grant..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    onClick={() => setSelectedGrant(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    onClick={() => submitApplication(selectedGrant)}
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grant Creation Modal */}
      {showCreateModal && renderCreateGrantModal()}
    </div>
  );
};

export default TujitumeGrantPortal;