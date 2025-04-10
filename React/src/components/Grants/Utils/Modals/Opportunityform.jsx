import { useState, useEffect } from 'react';
import { X, PlusCircle, ChevronDown, Upload, AlertTriangle, CheckCircle, BarChart4, Lightbulb, Zap, TrendingUp, Clock, FileText, DollarSign, Globe, Target } from 'lucide-react';
import axiosClient from "../../../../axiosClient";

const InvestmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [successSubmit, setSuccessSubmit] = useState(false);
  const [formData, setFormData] = useState({
    offer_title: '',
    total_capital_available: '',
    per_startup_allocation: '',
    milestone_requirements: '',
    startup_stage: '',
    sectors: [],
    regions: [],
    required_docs: [],
    offer_brief_file: null
  });

  // Sectors with market trends
  const sectorOptions = [
    { name: 'AI/ML', trend: 'hot', growth: '+145%' },
    { name: 'Blockchain', trend: 'hot', growth: '+87%' },
    { name: 'CleanTech', trend: 'hot', growth: '+92%' },
    { name: 'Healthcare', trend: 'warm', growth: '+56%' },
    { name: 'Fintech', trend: 'warm', growth: '+64%' },
    { name: 'EdTech', trend: 'warm', growth: '+42%' },
    { name: 'SaaS', trend: 'stable', growth: '+23%' },
    { name: 'E-commerce', trend: 'stable', growth: '+18%' },
    { name: 'Biotech', trend: 'hot', growth: '+76%' },
    { name: 'Space Tech', trend: 'hot', growth: '+112%' }
  ];

  // Region options
  const regionOptions = [
    'North America', 'Europe', 'Asia Pacific', 'Middle East',
    'Africa', 'Latin America', 'Global'
  ];

  // Document options
  const docOptions = [
    'Business Plan', 'Pitch Deck', 'Financial Projections', 'Market Analysis',
    'Team Profiles', 'Product Demo', 'Prototype Documentation', 'Legal Structure'
  ];

  // Generate market insights based on selected sectors and regions
  useEffect(() => {
    if (formData.sectors.length > 0 && formData.startup_stage) {
      const selectedSectors = sectorOptions.filter(sector => 
        formData.sectors.includes(sector.name)
      );
      
      const hotSectors = selectedSectors.filter(sector => sector.trend === 'hot');
      const avgGrowth = selectedSectors.length > 0 
        ? selectedSectors.reduce((acc, curr) => acc + parseInt(curr.growth), 0) / selectedSectors.length 
        : 0;
      
      const expectedCapital = formData.total_capital_available 
        ? (parseInt(formData.total_capital_available) * (1 + avgGrowth/100)) 
        : 0;
      
      setMarketInsights({
        trendingSectors: hotSectors.map(s => s.name),
        averageGrowth: `+${avgGrowth.toFixed(1)}%`,
        potentialROI: `+${(avgGrowth * 0.85).toFixed(1)}%`,
        expectedCapital: expectedCapital,
        recommendedAllocation: formData.startup_stage === 'Pre-seed' ? '15-25%' :
          formData.startup_stage === 'Seed' ? '10-20%' :
          formData.startup_stage === 'Growth' ? '8-15%' :
          formData.startup_stage === 'Series A' ? '5-12%' : '3-8%',
        riskLevel: formData.startup_stage === 'Pre-seed' ? 'Very High' :
          formData.startup_stage === 'Seed' ? 'High' :
          formData.startup_stage === 'Growth' ? 'Medium' :
          formData.startup_stage === 'Series A' ? 'Medium-Low' : 'Low',
        timeToExit: formData.startup_stage === 'Pre-seed' ? '5-7 years' :
          formData.startup_stage === 'Seed' ? '4-6 years' :
          formData.startup_stage === 'Growth' ? '3-5 years' :
          formData.startup_stage === 'Series A' ? '2-4 years' : '1-3 years'
      });
    }
  }, [formData.sectors, formData.startup_stage, formData.total_capital_available]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (field, value) => {
    setFormData(prev => {
      const currentValues = [...prev[field]];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const handleCustomOption = (field, value) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
      return true;
    }
    return false;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Check file size (5MB limit)
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        setNotification({
          type: 'error',
          message: 'File size exceeds 5MB limit'
        });
        setTimeout(() => setNotification(null), 5000);
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        offer_brief_file: e.target.files[0]
      }));
    }
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.offer_title || !formData.total_capital_available || !formData.per_startup_allocation) {
        setNotification({
          type: 'error',
          message: 'Please complete all required fields'
        });
        setTimeout(() => setNotification(null), 5000);
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.startup_stage || formData.sectors.length === 0 || formData.regions.length === 0) {
        setNotification({
          type: 'error',
          message: 'Please select startup stage, sectors, and regions'
        });
        setTimeout(() => setNotification(null), 5000);
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formDataToSend = new FormData();
      
      // Append form data
      formDataToSend.append('offer_title', formData.offer_title);
      formDataToSend.append('total_capital_available', formData.total_capital_available);
      formDataToSend.append('per_startup_allocation', formData.per_startup_allocation);
      formDataToSend.append('milestone_requirements', formData.milestone_requirements);
      formDataToSend.append('startup_stage', formData.startup_stage);
      formDataToSend.append('sectors', formData.sectors.join(','));
      formDataToSend.append('regions', formData.regions.join(','));
      formDataToSend.append('required_docs', formData.required_docs.join(','));
      
      if (formData.offer_brief_file) {
        formDataToSend.append('offer_brief_file', formData.offer_brief_file);
      }
  
      // Make API request
      await axiosClient.post('/capital/create-capital-offer', formDataToSend);
      
      setSuccessSubmit(true);
      
      // Reset form and close modal after success
      setTimeout(() => {
        setFormData({
          offer_title: '',
          total_capital_available: '',
          per_startup_allocation: '',
          milestone_requirements: '',
          startup_stage: '',
          sectors: [],
          regions: [],
          required_docs: [],
          offer_brief_file: null
        });
  
        setStep(1);
        setSuccessSubmit(false);
        onClose();
  
        if (onSuccess) onSuccess(); // Call onSuccess without passing opp
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create investment opportunity'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!isOpen) return null;

  // Success overlay
  if (successSubmit) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-neutral-200 text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle size={48} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Successfully Published</h2>
          <p className="text-neutral-600 mb-6">
            Your investment opportunity has been successfully created and is now live.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderNotification = () => {
    if (!notification) return null;
    
    const bgColor = notification.type === 'success' ? 'bg-green-50' : 
                    notification.type === 'error' ? 'bg-red-50' : 'bg-blue-50';
    
    const textColor = notification.type === 'success' ? 'text-green-800' : 
                      notification.type === 'error' ? 'text-red-800' : 'text-blue-800';
    
    const Icon = notification.type === 'success' ? CheckCircle : 
                notification.type === 'error' ? AlertTriangle : Lightbulb;
    
    return (
      <div className={`${bgColor} ${textColor} p-4 rounded-lg mb-4 flex items-start gap-3 animate-fadeIn`}>
        <Icon size={20} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">{notification.message}</p>
        </div>
      </div>
    );
  };

  const getProgressPercentage = () => {
    return (step / 3) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
      <div className="bg-white p-4 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-neutral-200">
        {/* Header with neutral professional gradient */}
        <div className="relative bg-gradient-to-r from-green-700 to-gray-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-light tracking-wide">
              {step === 1 && "Define Investment Opportunity"}
              {step === 2 && "Target & Requirements"}
              {step === 3 && "Market Analysis & Submission"}
            </h2>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-white/50'}`}>
                <div className={`flex items-center justify-center w-6 h-6 text-xs rounded-full ${step >= 1 ? 'bg-white text-neutral-800' : 'bg-white/30 text-white/70'}`}>1</div>
                <span className="text-sm font-medium">Basic Details</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`flex items-center justify-center w-6 h-6 text-xs rounded-full ${step >= 2 ? 'bg-white text-neutral-800' : 'bg-white/30 text-white/70'}`}>2</div>
                <span className="text-sm font-medium">Targeting</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-white' : 'text-white/50'}`}>
                <div className={`flex items-center justify-center w-6 h-6 text-xs rounded-full ${step >= 3 ? 'bg-white text-neutral-800' : 'bg-white/30 text-white/70'}`}>3</div>
                <span className="text-sm font-medium">Finalize</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 190px)' }}>
          {renderNotification()}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Core Investment Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-neutral-50 p-4 rounded-lg flex items-start gap-3 mb-4 border border-neutral-100">
                  <Lightbulb className="text-neutral-600 mt-1" size={20} />
                  <div className="text-sm text-neutral-700">
                    Define your investment opportunity with clear parameters. This information will be visible to potential startups.
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Opportunity Title*
                  </label>
                  <input
                    type="text"
                    name="offer_title"
                    value={formData.offer_title}
                    onChange={handleInputChange}
                    placeholder="e.g. Climate Tech Innovation Fund 2025"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Total Capital Available*
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 text-neutral-500" size={16} />
                      <input
                        type="number"
                        name="total_capital_available"
                        min="0"
                        value={formData.total_capital_available}
                        onChange={handleInputChange}
                        placeholder="1000000"
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                        required
                      />
                    </div>
                    {formData.total_capital_available && (
                      <p className="mt-1 text-sm text-neutral-500">
                        {formatCurrency(formData.total_capital_available)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Per Startup Allocation*
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 text-neutral-500" size={16} />
                      <input
                        type="number"
                        name="per_startup_allocation"
                        min="0"
                        value={formData.per_startup_allocation}
                        onChange={handleInputChange}
                        placeholder="100000"
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                        required
                      />
                    </div>
                    {formData.per_startup_allocation && (
                      <p className="mt-1 text-sm text-neutral-500">
                        {formatCurrency(formData.per_startup_allocation)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Milestone Requirements*
                  </label>
                  <textarea
                    name="milestone_requirements"
                    value={formData.milestone_requirements}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the key milestones startups must achieve to receive funding..."
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Targeting */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-neutral-50 p-4 rounded-lg flex items-start gap-3 mb-4 border border-neutral-100">
                  <Target className="text-neutral-600 mt-1" size={20} />
                  <div className="text-sm text-neutral-700">
                    Define your target startup profile. Our AI will provide market analysis based on your selections.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Startup Stage*
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {['Pre-seed', 'Seed', 'Growth', 'Series A', 'Series B+'].map(stage => (
                      <div 
                        key={stage}
                        onClick={() => setFormData({...formData, startup_stage: stage})}
                        className={`px-3 py-3 rounded-lg border cursor-pointer transition-all ${
                          formData.startup_stage === stage
                            ? 'bg-green-100 border-green-400 text-green-800 shadow-sm'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="text-center font-medium">{stage}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Target Sectors* <span className="text-neutral-500 text-xs">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sectorOptions.map(sector => (
                      <div 
                        key={sector.name}
                        onClick={() => handleMultiSelectChange('sectors', sector.name)}
                        className={`flex justify-between items-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                          formData.sectors.includes(sector.name)
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="font-medium">{sector.name}</div>
                        <div className="flex items-center">
                          {sector.trend === 'hot' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                              <Zap size={12} className="mr-1" />
                              {sector.growth}
                            </span>
                          )}
                          {sector.trend === 'warm' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                              <TrendingUp size={12} className="mr-1" />
                              {sector.growth}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <div className="relative">
                      <input
                        type="text"
                        id="custom-sector"
                        placeholder="Add custom sector"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const added = handleCustomOption('sectors', e.target.value.trim());
                            if (added) e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 p-1 text-neutral-600 hover:text-neutral-800 rounded-full hover:bg-neutral-100"
                        onClick={() => {
                          const input = document.getElementById('custom-sector');
                          const added = handleCustomOption('sectors', input.value.trim());
                          if (added) input.value = '';
                        }}
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {formData.sectors.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.sectors.map(sector => (
                        <div 
                          key={sector} 
                          className="flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                        >
                          {sector}
                          <button
                            type="button"
                            className="ml-1 focus:outline-none text-green-600 hover:text-green-800"
                            onClick={() => handleMultiSelectChange('sectors', sector)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Target Regions* <span className="text-neutral-500 text-xs">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {regionOptions.map(region => (
                      <div 
                        key={region}
                        onClick={() => handleMultiSelectChange('regions', region)}
                        className={`flex items-center justify-center px-3 py-3 rounded-lg border cursor-pointer transition-all ${
                          formData.regions.includes(region)
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <Globe size={16} className="mr-2" />
                        <span>{region}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <div className="relative">
                      <input
                        type="text"
                        id="custom-region"
                        placeholder="Add custom region"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const added = handleCustomOption('regions', e.target.value.trim());
                            if (added) e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 p-1 text-neutral-600 hover:text-neutral-800 rounded-full hover:bg-neutral-100"
                        onClick={() => {
                          const input = document.getElementById('custom-region');
                          const added = handleCustomOption('regions', input.value.trim());
                          if (added) input.value = '';
                        }}
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Required Documents <span className="text-neutral-500 text-xs">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {docOptions.map(doc => (
                      <div 
                        key={doc}
                        onClick={() => handleMultiSelectChange('required_docs', doc)}
                        className={`flex items-center justify-center px-3 py-3 rounded-lg border cursor-pointer transition-all ${
                          formData.required_docs.includes(doc)
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <FileText size={16} className="mr-2" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <div className="relative">
                      <input
                        type="text"
                        id="custom-doc"
                        placeholder="Add custom document requirement"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const added = handleCustomOption('required_docs', e.target.value.trim());
                            if (added) e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 p-1 text-neutral-600 hover:text-neutral-800 rounded-full hover:bg-neutral-100"
                        onClick={() => {
                          const input = document.getElementById('custom-doc');
                          const added = handleCustomOption('required_docs', input.value.trim());
                          if (added) input.value = '';
                        }}
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Market Analysis & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                {marketInsights && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-neutral-800">Market Intelligence</h3>
                      <button
                        type="button"
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className="text-sm text-neutral-600 hover:text-neutral-800 flex items-center"
                      >
                        <BarChart4 size={18} className="mr-1" />
                        {showAnalytics ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    
                    <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-neutral-200 rounded-full">
                            <TrendingUp size={16} className="text-neutral-700" />
                          </div>
                          <div>
                            <span className="block text-sm text-neutral-500">Average Growth Rate</span>
                            <span className="text-lg font-medium text-neutral-800">{marketInsights.averageGrowth}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-neutral-200 rounded-full">
                            <DollarSign size={16} className="text-neutral-700" />
                          </div>
                          <div>
                            <span className="block text-sm text-neutral-500">Potential ROI</span>
                            <span className="text-lg font-medium text-neutral-800">{marketInsights.potentialROI}</span>
                          </div>
                        </div>
                        
                        {showAnalytics && (
                          <>
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-neutral-200 rounded-full">
                                <Clock size={16} className="text-neutral-700" />
                              </div>
                              <div>
                                <span className="block text-sm text-neutral-500">Est. Time to Exit</span>
                                <span className="text-lg font-medium text-neutral-800">{marketInsights.timeToExit}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-neutral-200 rounded-full">
                                <AlertTriangle size={16} className="text-neutral-700" />
                              </div>
                              <div>
                                <span className="block text-sm text-neutral-500">Risk Level</span>
                                <span className="text-lg font-medium text-neutral-800">{marketInsights.riskLevel}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-neutral-200 rounded-full">
                                <Target size={16} className="text-neutral-700" />
                              </div>
                              <div>
                                <span className="block text-sm text-neutral-500">Recommended Allocation</span>
                                <span className="text-lg font-medium text-neutral-800">{marketInsights.recommendedAllocation}</span>
                              </div>
                            </div>
                            
                            {marketInsights.trendingSectors.length > 0 && (
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-neutral-200 rounded-full">
                                  <Zap size={16} className="text-neutral-700" />
                                </div>
                                <div>
                                  <span className="block text-sm text-neutral-500">Hot Sectors</span>
                                  <span className="text-lg font-medium text-neutral-800">
                                    {marketInsights.trendingSectors.join(', ')}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Investment Brief (Optional)
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="offer_brief_file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    {!formData.offer_brief_file ? (
                      <label 
                        htmlFor="offer_brief_file" 
                        className="cursor-pointer flex flex-col items-center text-neutral-600"
                      >
                        <Upload size={32} className="mb-2" />
                        <span className="text-sm font-medium">Upload investment brief</span>
                        <span className="text-xs text-neutral-500 mt-1">PDF, DOC or DOCX (max 5MB)</span>
                      </label>
                    ) : (
                      <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText size={20} className="text-neutral-600 mr-2" />
                          <span className="text-sm font-medium truncate max-w-xs">
                            {formData.offer_brief_file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="p-1 hover:bg-neutral-200 rounded-full"
                          onClick={() => setFormData({...formData, offer_brief_file: null})}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h3 className="text-lg font-medium mb-3">Investment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Opportunity Title</span>
                      <span className="text-sm font-medium">{formData.offer_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Total Capital</span>
                      <span className="text-sm font-medium">{formatCurrency(formData.total_capital_available)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Per Startup</span>
                      <span className="text-sm font-medium">{formatCurrency(formData.per_startup_allocation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Stage</span>
                      <span className="text-sm font-medium">{formData.startup_stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Sectors</span>
                      <span className="text-sm font-medium">{formData.sectors.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Regions</span>
                      <span className="text-sm font-medium">{formData.regions.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer with navigation buttons */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-5 py-2.5 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Opportunity'}
                    {isSubmitting && (
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;