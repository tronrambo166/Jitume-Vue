import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, Users, MessageSquare, 
  BarChart2, Settings, Download, Upload,
  Clock, Calendar, CheckCircle, XCircle,
  DollarSign, Percent, Globe, Lock, Send,
  Star, User, Award, MapPin, Leaf, Briefcase
} from 'lucide-react';
import { useParams, Link, useLocation } from 'react-router-dom';

const DealRoomLayout = () => {
  const { opportunityId } = useParams();
  const location = useLocation();
  const [deal, setDeal] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [investors, setInvestors] = useState([]);
  const [priorityFilters, setPriorityFilters] = useState({
    isWomenLed: false,
    isYouthLed: false,
    isRuralBased: false,
    usesLocalSourcing: false
  });

  // Get opportunity data from location state if available
  const opportunityFromState = location.state?.opportunity;

  // Mock data fetch with investors and matching criteria
  useEffect(() => {
    let mockDeal;
    
    if (opportunityFromState) {
      // Use the opportunity data passed from the investor portal
      mockDeal = {
        ...opportunityFromState,
        id: opportunityFromState.id || opportunityId,
        name: opportunityFromState.name,
        stage: opportunityFromState.stage || 'Seed',
        amount: opportunityFromState.amount || 250000,
        valuation: opportunityFromState.valuation || 1000000,
        equityOffered: opportunityFromState.equityOffered || '25%',
        sector: opportunityFromState.sector || 'Agriculture',
        location: opportunityFromState.location || 'Kenya',
        revenue: opportunityFromState.revenue || 75000,
        teamExperience: opportunityFromState.teamExperience || 5,
        impactScore: opportunityFromState.impactScore || 8,
        milestoneSuccess: opportunityFromState.milestoneSuccess || 75,
        documents: opportunityFromState.documents || [
          { id: 1, name: 'Pitch Deck', type: 'pdf', uploaded: '2023-05-15', size: '2.4 MB' },
          { id: 2, name: 'Financial Model', type: 'xlsx', uploaded: '2023-05-20', size: '1.8 MB' },
          { id: 3, name: 'Cap Table', type: 'pdf', uploaded: '2023-06-01', size: '3.2 MB' }
        ],
        timeline: opportunityFromState.timeline || [
          { id: 1, event: 'Initial Pitch', date: '2023-05-10', completed: true },
          { id: 2, event: 'Due Diligence', date: '2023-06-15', completed: false },
          { id: 3, event: 'Term Sheet', date: '2023-07-01', completed: false }
        ],
        team: opportunityFromState.team || [
          { id: 1, name: 'Jane Muthoni', role: 'CEO', joined: '2020', email: 'jane@example.com' },
          { id: 2, name: 'David Omondi', role: 'CTO', joined: '2021', email: 'david@example.com' }
        ]
      };
    } else {
      // Fallback to mock data if no state was passed
      mockDeal = {
        id: opportunityId,
        name: opportunityId === '1' ? 'Solar Farm Kenya' : 'AgriTech Tanzania',
        stage: opportunityId === '1' ? 'Series A' : 'Seed',
        amount: opportunityId === '1' ? 500000 : 250000,
        valuation: opportunityId === '1' ? 2500000 : 1000000,
        equityOffered: opportunityId === '1' ? '20%' : '25%',
        sector: opportunityId === '1' ? 'Renewable Energy' : 'Agriculture',
        location: 'Kenya',
        revenue: opportunityId === '1' ? 120000 : 75000,
        teamExperience: 5,
        impactScore: 8,
        milestoneSuccess: 75,
        documents: [
          { id: 1, name: 'Pitch Deck', type: 'pdf', uploaded: '2023-05-15', size: '2.4 MB' },
          { id: 2, name: 'Financial Model', type: 'xlsx', uploaded: '2023-05-20', size: '1.8 MB' },
          { id: 3, name: 'Cap Table', type: 'pdf', uploaded: '2023-06-01', size: '3.2 MB' }
        ],
        timeline: [
          { id: 1, event: 'Initial Pitch', date: '2023-05-10', completed: true },
          { id: 2, event: 'Due Diligence', date: '2023-06-15', completed: false },
          { id: 3, event: 'Term Sheet', date: '2023-07-01', completed: false }
        ],
        team: [
          { id: 1, name: 'Jane Muthoni', role: 'CEO', joined: '2020', email: 'jane@example.com' },
          { id: 2, name: 'David Omondi', role: 'CTO', joined: '2021', email: 'david@example.com' }
        ]
      };
    }

    const mockInvestors = [
      {
        id: 1,
        name: 'Green Energy Ventures',
        type: 'VC Firm',
        sectors: ['Renewable Energy', 'Agriculture'],
        investmentRange: '$100k - $1M',
        stage: ['Seed', 'Series A'],
        location: ['Kenya', 'Tanzania'],
        minRevenue: 50000,
        teamThreshold: 3,
        impactThreshold: 5,
        contactEmail: 'contact@greenenergy.vc'
      },
      {
        id: 2,
        name: 'AgriTech Angels',
        type: 'Angel Network',
        sectors: ['Agriculture', 'Tech'],
        investmentRange: '$50k - $500k',
        stage: ['Idea', 'MVP', 'Seed'],
        location: ['East Africa'],
        minRevenue: 0,
        teamThreshold: 2,
        impactThreshold: 7,
        contactEmail: 'invest@agritechangels.com'
      },
      {
        id: 3,
        name: 'Afrika Impact Fund',
        type: 'Impact Investor',
        sectors: ['Agriculture', 'Renewable Energy', 'Tech'],
        investmentRange: '$200k - $2M',
        stage: ['Seed', 'Growth'],
        location: ['Africa'],
        minRevenue: 100000,
        teamThreshold: 4,
        impactThreshold: 8,
        contactEmail: 'info@afrikaimpact.org'
      }
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
        sender: 'Jane Muthoni', 
        text: 'Hi team, I\'ve updated the financial model. Please review.', 
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      { 
        id: 2, 
        sender: 'David Omondi', 
        text: 'Looks good. We should discuss the next steps.', 
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]);
  }, [opportunityId, opportunityFromState]);

  // Message sending handler
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        text: newMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate reply after 1-3 seconds
      if (Math.random() > 0.3) {
        const replyDelay = 1000 + Math.random() * 2000;
        setTimeout(() => {
          const replies = [
            "Thanks for your message!",
            "We'll look into this and get back to you.",
            "Can you provide more details?",
            "That's an important point. Let's discuss in our next meeting.",
            "I've noted this down for follow-up."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          
          const replyMessage = {
            id: messages.length + 2,
            sender: Math.random() > 0.5 ? 'Jane Muthoni' : 'David Omondi',
            text: randomReply,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, replyMessage]);
        }, replyDelay);
      }
    }
  };

  // Document upload handler
  const handleDocumentUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.xlsx,.pptx';
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploading(true);
        
        // Simulate upload delay
        setTimeout(() => {
          const newDoc = {
            id: documents.length + 1,
            name: file.name,
            type: file.name.split('.').pop(),
            uploaded: new Date().toISOString().split('T')[0],
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          };
          
          setDocuments([...documents, newDoc]);
          setUploading(false);
          
          // Add system message about the upload
          const systemMessage = {
            id: messages.length + 1,
            sender: 'System',
            text: `New document uploaded: ${file.name}`,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, systemMessage]);
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
      sender: 'System',
      text: `You downloaded: ${doc.name}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, activityMessage]);
    
    alert(`Downloading ${doc.name}`);
  };

  // Document remove handler
  const handleDocumentRemove = (doc) => {
    if (window.confirm(`Are you sure you want to remove ${doc.name}?`)) {
      setDocuments(documents.filter(d => d.id !== doc.id));
      
      const systemMessage = {
        id: messages.length + 1,
        sender: 'System',
        text: `Document removed: ${doc.name}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  // Toggle timeline item completion
  const toggleTimelineCompletion = (itemId) => {
    setTimeline(timeline.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  // Add new team member
  const addTeamMember = () => {
    const newMember = {
      id: teamMembers.length + 1,
      name: `New Member ${teamMembers.length + 1}`,
      role: 'Team Member',
      joined: new Date().getFullYear().toString(),
      email: `newmember${teamMembers.length + 1}@example.com`
    };
    setTeamMembers([...teamMembers, newMember]);
    
    const systemMessage = {
      id: messages.length + 1,
      sender: 'System',
      text: `New team member added: ${newMember.name}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  // Contact investor
  const contactInvestor = (investorEmail) => {
    const subject = `Interest in ${deal.name} Investment Opportunity`;
    const body = `Dear Investor,\n\nI'm reaching out regarding potential investment in our ${deal.name} project.\n\nBest regards,\n[Your Name]`;
    window.open(`mailto:${investorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Matching Algorithm (SWSF)
  const calculateMatchScore = (business, fund) => {
    let score = 0;

    // Sector Alignment (30%)
    if (fund.sectors.includes(business.sector)) {
      score += 30;
    }

    // Geographic Fit (15%)
    if (fund.location.includes(business.location) || fund.location.includes('Africa')) {
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
    if (score >= 80) return 'Ideal Match';
    if (score >= 60) return 'Strong Match';
    return 'Needs Revision';
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
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            tier === 'Ideal Match' ? 'bg-green-100 text-green-800' :
            tier === 'Strong Match' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
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
            <span>{investor.stage.join(', ')}</span>
          </div>
          <div className="flex items-center">
            <Globe size={14} className="mr-1 text-gray-500" />
            <span>{investor.location.join(', ')}</span>
          </div>
          <div className="flex items-center">
            <Leaf size={14} className="mr-1 text-gray-500" />
            <span>{investor.sectors.join(', ')}</span>
          </div>
        </div>

        <button 
          onClick={() => contactInvestor(investor.contactEmail)}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Contact Investor
        </button>
      </div>
    );
  };

  // Priority Filters Component
  const PriorityFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Priority Filters (+5% each)</h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={priorityFilters.isWomenLed}
            onChange={() => setPriorityFilters(prev => ({...prev, isWomenLed: !prev.isWomenLed}))}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm flex items-center">
            <User size={14} className="mr-1" /> Women-led
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={priorityFilters.isYouthLed}
            onChange={() => setPriorityFilters(prev => ({...prev, isYouthLed: !prev.isYouthLed}))}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm flex items-center">
            <Award size={14} className="mr-1" /> Youth-led
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={priorityFilters.isRuralBased}
            onChange={() => setPriorityFilters(prev => ({...prev, isRuralBased: !prev.isRuralBased}))}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm flex items-center">
            <MapPin size={14} className="mr-1" /> Rural-based
          </span>
        </label>
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={priorityFilters.usesLocalSourcing}
            onChange={() => setPriorityFilters(prev => ({...prev, usesLocalSourcing: !prev.usesLocalSourcing}))}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm flex items-center">
            <Leaf size={14} className="mr-1" /> Local sourcing
          </span>
        </label>
      </div>
    </div>
  );

  if (!deal) return <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/investment-portal" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{deal.name} Deal Room</h1>
                <p className="text-gray-500 text-sm">
                  {deal.stage} • ${deal.amount.toLocaleString()} • {deal.equityOffered} Equity
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
          <nav className="flex space-x-8">
            {[
              { name: 'overview', icon: BarChart2, label: 'Overview' },
              { name: 'investors', icon: Briefcase, label: 'Investors' },
              { name: 'documents', icon: FileText, label: 'Documents' },
              { name: 'team', icon: Users, label: 'Team' },
              { name: 'communication', icon: MessageSquare, label: 'Communication' }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.name 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-3 divide-x divide-gray-200">
              {/* Key Metrics */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Valuation</p>
                    <p className="text-xl font-semibold">${deal.valuation.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Equity Offered</p>
                    <p className="text-xl font-semibold">{deal.equityOffered}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Investment Amount</p>
                    <p className="text-xl font-semibold">${deal.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Timeline</h3>
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-start cursor-pointer"
                      onClick={() => toggleTimelineCompletion(item.id)}
                    >
                      <div className="mr-3 mt-1">
                        {item.completed ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Clock size={16} className="text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.event}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {messages.slice(-2).reverse().map((msg) => (
                    <div key={msg.id} className="flex items-start">
                      <div className="mr-3 mt-1">
                        <MessageSquare size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {msg.sender === 'System' ? 'System notification' : `${msg.sender}: ${msg.text}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
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
        {activeTab === 'investors' && (
          <div>
            <PriorityFilters />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Investors</h3>
              <div className="space-y-4">
                {investors.map(investor => (
                  <InvestorCard key={investor.id} investor={investor} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              <button 
                onClick={handleDocumentUpload}
                disabled={uploading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center space-x-2 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload Document</span>
                  </>
                )}
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {documents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText size={32} className="mx-auto mb-4 text-gray-300" />
                  <p>No documents uploaded yet</p>
                  <button 
                    onClick={handleDocumentUpload}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Upload your first document
                  </button>
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded {doc.uploaded} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDocumentDownload(doc)}
                        className="p-2 text-gray-500 hover:text-blue-600"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleDocumentRemove(doc)}
                        className="p-2 text-gray-500 hover:text-red-600"
                        title="Remove"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
              <button 
                onClick={addTeamMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add Member
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {teamMembers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users size={32} className="mx-auto mb-4 text-gray-300" />
                  <p>No team members added yet</p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div key={member.id} className="p-6 hover:bg-gray-50 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <p className="text-xs text-gray-400 mt-1">{member.email}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined {member.joined}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Messages</h3>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg p-4 min-h-[400px] max-h-[400px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-16">
                    <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>Start a conversation with the team</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`
                            max-w-[70%] p-3 rounded-lg 
                            ${msg.sender === 'You' 
                              ? 'bg-blue-500 text-white' 
                              : msg.sender === 'System'
                                ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                : 'bg-gray-200 text-gray-800'}
                          `}
                        >
                          <div className="font-semibold text-xs mb-1">
                            {msg.sender}
                          </div>
                          <div>{msg.text}</div>
                          <div className="text-xs mt-1 opacity-70">
                            {new Date(msg.timestamp).toLocaleString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 ${
                    !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  <Send size={16} />
                  <span>Send</span>
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