import { useState, useEffect } from 'react';
import { X, PlusCircle, ChevronDown, Upload, AlertTriangle, CheckCircle, BarChart4, Lightbulb, Zap, TrendingUp, Clock, FileText, DollarSign, Globe, Target } from 'lucide-react';
import axiosClient from "../../../../axiosClient";

const InvestmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
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
      
      // Add base fields
      formDataToSend.append('offer_title', formData.offer_title);
      formDataToSend.append('total_capital_available', formData.total_capital_available);
      formDataToSend.append('per_startup_allocation', formData.per_startup_allocation);
      formDataToSend.append('milestone_requirements', formData.milestone_requirements);
      formDataToSend.append('startup_stage', formData.startup_stage);
      formDataToSend.append('sectors', formData.sectors.join(','));
      formDataToSend.append('regions', formData.regions.join(','));
      formDataToSend.append('required_docs', formData.required_docs.join(','));
      
      // Add file if present
      if (formData.offer_brief_file) {
        formDataToSend.append('offer_brief_file', formData.offer_brief_file);
      }

      await axiosClient.post('/capital/create-capital-offer', formDataToSend);
      
      setNotification({
        type: 'success',
        message: 'Investment opportunity successfully created!'
      });

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
        onClose();
        if (onSuccess) onSuccess();
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
      <div className="bg-white p-4 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-neutral-200">
        {/* Glass-like header with gradient */}
        <div className="relative bg-gradient-to-r from-emerald-500/90 to-teal-600/90 p-6 text-white">
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
                <div className={`flex items-center justify-center w-6 h-6 text-xs rounded-full ${step >= 1 ? 'bg-white text-teal-600' : 'bg-white/30 text-white/70'}`}>1</div>
                <span className="text-sm font-medium">Basic Details</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-white/50'}`}>
                <div className={`flex items-center justify-center w-6 h-6 text-xs rounded-full ${step >= 2 ? 'bg-white text-teal-600' : 'bg-white/30 text-white/70'}`}>2</div>
                <span className="text-sm font-medium">Targeting</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-white' : 'text-white/50'}`}>
                <div className={`flex items-center justify-center w-6 h-6 text-xs rounded-full ${step >= 3 ? 'bg-white text-teal-600' : 'bg-white/30 text-white/70'}`}>3</div>
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
          
          <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-6">
            {/* Step 1: Core Investment Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg flex items-start gap-3 mb-4">
                  <Lightbulb className="text-teal-600 mt-1" size={20} />
                  <div className="text-sm text-teal-800">
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Targeting */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg flex items-start gap-3 mb-4">
                  <Target className="text-teal-600 mt-1" size={20} />
                  <div className="text-sm text-teal-800">
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
                            ? 'bg-teal-50 border-teal-300 text-teal-700 shadow-sm'
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
                            ? 'bg-teal-50 border-teal-300 text-teal-700'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="font-medium">{sector.name}</div>
                        <div className="flex items-center">
                          {sector.trend === 'hot' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                              <Zap size={12} className="mr-1" />
                              {sector.growth}
                            </span>
                          )}
                          {sector.trend === 'warm' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
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
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                        className="absolute right-2 top-2 p-1 text-teal-600 hover:text-teal-800 rounded-full hover:bg-teal-50"
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
                      {formData.sectors.map(sector => {
                        // Find matching sector from options
                        const sectorData = sectorOptions.find(s => s.name === sector);
                        
                        return (
                          <div 
                            key={sector} 
                            className={`flex items-center px-3 py-1 rounded-full text-sm ${
                              sectorData?.trend === 'hot' ? 'bg-red-50 text-red-700' :
                              sectorData?.trend === 'warm' ? 'bg-amber-50 text-amber-700' :
                              'bg-teal-50 text-teal-700'
                            }`}
                          >
                            {sector}
                            {sectorData?.trend === 'hot' && <Zap size={12} className="ml-1" />}
                            <button
                              type="button"
                              className="ml-1 focus:outline-none"
                              onClick={() => handleMultiSelectChange('sectors', sector)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
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
                            ? 'bg-teal-50 border-teal-300 text-teal-700'
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
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                        className="absolute right-2 top-2 p-1 text-teal-600 hover:text-teal-800 rounded-full hover:bg-teal-50"
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
                            ? 'bg-teal-50 border-teal-300 text-teal-700'
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
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                        className="absolute right-2 top-2 p-1 text-teal-600 hover:text-teal-800 rounded-full hover:bg-teal-50"
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
                        className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
                      >
                        <BarChart4 size={18} className="mr-1" />
                        {showAnalytics ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-50 to-teal-50 p-5 rounded-xl border border-teal-100 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-red-100 text-red-600">
                            <Zap size={18} />
                          </div>
                          <div>
                            <div className="text-sm text-neutral-500">Hot Sectors</div>
                            <div className="font-medium">
                              {marketInsights.trendingSectors.join(', ')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-teal-100 text-teal-600">
                            <TrendingUp size={18} />
                          </div>
                          <div>
                            <div className="text-sm text-neutral-500">Average YoY Growth</div>
                            <div className="font-medium">{marketInsights.averageGrowth}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                            <DollarSign size={18} />
                          </div>
                          <div>
                            <div className="text-sm text-neutral-500">Potential ROI</div>
                            <div className="font-medium">{marketInsights.potentialROI}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                            <Clock size={18} />
                          </div>
                          <div>
                            <div className="text-sm text-neutral-500">Time to Exit</div>
                            <div className="font-medium">{marketInsights.timeToExit}</div>
                          </div>
                        </div>
                      </div>
                      
                      {showAnalytics && (
                        <div className="mt-6 pt-4 border-t border-teal-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                              <div className="text-sm text-neutral-500">Recommended Equity %</div>
                              <div className="font-medium">{marketInsights.recommendedAllocation}</div>
                            </div>
                            <div>
                              <div className="text-sm text-neutral-500">Risk Level</div>
                              <div className="font-medium">{marketInsights.riskLevel}</div>
                            </div>
                            <div className="md:col-span-2">
                              <div className="text-sm text-neutral-500">Expected Fund Growth (Based on Market Trends)</div>
                              <div className="font-medium">
                                {formatCurrency(marketInsights.expectedCapital)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Upload Investment Brief (PDF or DOC, optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg">
                    <div className="space-y-2 text-center">
                      <Upload className="mx-auto h-12 w-12 text-neutral-400" stroke-width={1} />
                      <div className="flex text-sm text-neutral-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-neutral-500">
                        PDF, DOC up to 5MB
                      </p>
                    </div>
                  </div>
                  {formData.offer_brief_file && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
                      <FileText size={16} />
                      <span>{formData.offer_brief_file.name}</span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setFormData({...formData, offer_brief_file: null})}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
             {/* Footer */}
        <div className="p-2 bg-neutral-50 border-t border-neutral-200 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium transition-colors"
            >
              Cancel
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Publish Investment Opportunity'
              )}
            </button>
          )}
        </div>
        </div>
        
     
      </div>
    </div>
  );
};

export default InvestmentModal;