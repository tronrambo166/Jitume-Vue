import React, { useState, useEffect, useRef } from "react";
import { X, ChevronRight, Upload, Check, Calendar, Shield, Award, ArrowRight, ChevronDown, Sparkles, Zap, Globe, Clock, FileCheck, AlertTriangle } from "lucide-react";

export default function GrantApplicationModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [matchPreview, setMatchPreview] = useState(null);
  const [formData, setFormData] = useState({
    startupName: "",
    contactPerson: "",
    contactEmail: "",
    sector: "",
    location: "",
    stage: "",
    revenue: "",
    teamExperience: "",
    traction: "",
    impactAreas: [],
    isGenderLed: false,
    isYouthLed: false,
    isRuralBased: false,
    usesLocalSourcing: false,
    documents: {
      pitchDeck: null,
      businessPlan: null,
      pitchVideo: null
    }
  });

  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImpactAreaChange = (area) => {
    setFormData(prev => {
      const currentAreas = [...prev.impactAreas];
      if (currentAreas.includes(area)) {
        return { ...prev, impactAreas: currentAreas.filter(a => a !== area) };
      } else {
        return { ...prev, impactAreas: [...currentAreas, area] };
      }
    });
  };

  useEffect(() => {
    let score = 0;
    if (formData.sector && formData.location && formData.stage) {
      score += 60;
      if (formData.revenue) score += 5;
      if (formData.teamExperience) score += 5;
      if (formData.traction) score += 5;
      if (formData.impactAreas.length > 0) score += 5;
      if (formData.isGenderLed) score += 5;
      if (formData.isYouthLed) score += 5;
      if (formData.isRuralBased) score += 5;
      if (formData.usesLocalSourcing) score += 5;
    }
    score = Math.min(score, 100);
    let matchLevel = "Needs Revision";
    if (score >= 80) matchLevel = "Ideal Match";
    else if (score >= 60) matchLevel = "Strong Match";
    setMatchPreview({ score, matchLevel });
  }, [formData]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const sectors = ["Agriculture", "Renewable Energy", "Tech"];
  const stages = ["Idea", "MVP", "Seed", "Growth"];
  const impactAreas = ["Food Security", "Carbon Reduction", "Job Creation", "Water Conservation", "Education", "Healthcare", "Financial Inclusion"];
  const countries = ["Kenya", "Uganda", "Tanzania", "Rwanda", "Ethiopia"];

  const getStepColor = (currentStep) => step >= currentStep ? "bg-green-500" : "bg-gray-200";
  const getMatchScoreColor = () => {
    if (!matchPreview) return "bg-gray-200";
    if (matchPreview.score >= 80) return "bg-green-500";
    if (matchPreview.score >= 60) return "bg-yellow-500";
    return "bg-red-400";
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl border border-gray-100 flex flex-col max-h-[90vh]" ref={modalRef}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-teal-400"></div>
        
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-teal-400 text-white p-3 rounded-xl shadow-lg shadow-green-200 mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                Grant Application
                <span className="ml-3 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> Smart Matching
                </span>
              </h2>
            </div>
          </div>
          <button 
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {[1, 2, 3].map((stepNum) => (
                  <React.Fragment key={stepNum}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${getStepColor(stepNum)} flex items-center justify-center text-white shadow-lg ${step >= stepNum ? "shadow-green-200" : ""}`}>
                        {stepNum === 1 && <Shield className="w-5 h-5" />}
                        {stepNum === 2 && <Award className="w-5 h-5" />}
                        {stepNum === 3 && <FileCheck className="w-5 h-5" />}
                      </div>
                    </div>
                    {stepNum < 3 && <div className={`h-1 flex-1 mx-2 ${getStepColor(stepNum + 1)}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="px-6 py-4">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name <span className="text-green-500">*</span></label>
                      <input
                        type="text"
                        name="startupName"
                        value={formData.startupName}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Enter your startup name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person <span className="text-green-500">*</span></label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email <span className="text-green-500">*</span></label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sector <span className="text-green-500">*</span></label>
                      <div className="relative">
                        <select
                          name="sector"
                          value={formData.sector}
                          onChange={handleChange}
                          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        >
                          <option value="">Select Sector</option>
                          {sectors.map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stage <span className="text-green-500">*</span></label>
                      <div className="relative">
                        <select
                          name="stage"
                          value={formData.stage}
                          onChange={handleChange}
                          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        >
                          <option value="">Select Stage</option>
                          {stages.map(stage => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Location <span className="text-green-500">*</span></label>
                      <div className="relative">
                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          required
                        >
                          <option value="">Select Location</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Revenue (Last 12 Months)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                        <input
                          type="number"
                          name="revenue"
                          value={formData.revenue}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team Experience (Avg. Years)</label>
                      <input
                        type="number"
                        name="teamExperience"
                        value={formData.teamExperience}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="0"
                        min="0"
                        max="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Traction / KPIs</label>
                      <textarea
                        name="traction"
                        value={formData.traction}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Key metrics that show your progress"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social/Environmental Impact Areas</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {impactAreas.map(area => (
                        <label 
                          key={area}
                          className={`flex items-center p-3 rounded-lg border ${formData.impactAreas.includes(area) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'} transition-colors cursor-pointer`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.impactAreas.includes(area)}
                            onChange={() => handleImpactAreaChange(area)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${formData.impactAreas.includes(area) ? 'bg-green-500' : 'border border-gray-300'}`}>
                            {formData.impactAreas.includes(area) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-gray-800">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">Bonus Considerations</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`flex items-center space-x-3 p-3 rounded-lg ${formData.isGenderLed ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                        <input
                          type="checkbox"
                          name="isGenderLed"
                          checked={formData.isGenderLed}
                          onChange={handleChange}
                          className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div>
                          <span className="text-gray-700 font-medium">Gender-led Business</span>
                          <p className="text-xs text-gray-500">Business is led by women</p>
                        </div>
                      </label>
                      
                      <label className={`flex items-center space-x-3 p-3 rounded-lg ${formData.isYouthLed ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                        <input
                          type="checkbox"
                          name="isYouthLed"
                          checked={formData.isYouthLed}
                          onChange={handleChange}
                          className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div>
                          <span className="text-gray-700 font-medium">Youth-led Business</span>
                          <p className="text-xs text-gray-500">Founders are 35 years or below</p>
                        </div>
                      </label>
                      
                      <label className={`flex items-center space-x-3 p-3 rounded-lg ${formData.isRuralBased ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                        <input
                          type="checkbox"
                          name="isRuralBased"
                          checked={formData.isRuralBased}
                          onChange={handleChange}
                          className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div>
                          <span className="text-gray-700 font-medium">Rural-based Operation</span>
                          <p className="text-xs text-gray-500">Business operates in rural/underserved areas</p>
                        </div>
                      </label>
                      
                      <label className={`flex items-center space-x-3 p-3 rounded-lg ${formData.usesLocalSourcing ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                        <input
                          type="checkbox"
                          name="usesLocalSourcing"
                          checked={formData.usesLocalSourcing}
                          onChange={handleChange}
                          className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div>
                          <span className="text-gray-700 font-medium">Local Sourcing</span>
                          <p className="text-xs text-gray-500">Uses locally sourced materials or labor</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100 mb-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-lg p-2 mr-4">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">Complete Your Application</h3>
                        <p className="text-gray-600">Upload the required documents to finalize your grant application.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors text-center">
                      <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Pitch Deck <span className="text-green-500">*</span></h3>
                      <p className="text-gray-500 mb-4">PDF, PPT or PPTX (Max 10MB)</p>
                      <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-5 py-2 rounded-lg transition-colors inline-flex items-center shadow-sm">
                        <span>Select File</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors text-center">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Business Plan <span className="text-green-500">*</span></h3>
                        <p className="text-gray-500 mb-4">PDF, DOC or DOCX (Max 5MB)</p>
                        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center shadow-sm">
                          <span>Select File</span>
                        </button>
                      </div>
                      
                      <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors text-center">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Pitch Video</h3>
                        <p className="text-gray-500 mb-4">MP4 or YouTube/Vimeo link</p>
                        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center shadow-sm">
                          <span>Upload or Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
              {step > 1 ? (
                <button 
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-green-200 flex items-center font-medium"
                >
                  Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button 
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg transition-all shadow-lg shadow-green-200 flex items-center font-medium"
                >
                  Submit Application <Check className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block w-80 bg-gray-50 border-l border-gray-100 p-6 overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-1">Match Score Preview</h3>
              <p className="text-sm text-gray-500">Real-time compatibility analysis</p>
            </div>
            
            {matchPreview ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-gray-100">
                    <div className={`w-24 h-24 rounded-full ${getMatchScoreColor()} flex items-center justify-center text-white text-2xl font-bold`}>
                      {matchPreview.score}%
                    </div>
                  </div>
                  <div className={`absolute -right-2 -top-2 rounded-full p-2 ${
                    matchPreview.matchLevel === "Ideal Match" ? "bg-green-500" :
                    matchPreview.matchLevel === "Strong Match" ? "bg-yellow-500" : "bg-red-400"
                  } text-white shadow`}>
                    {matchPreview.matchLevel === "Ideal Match" ? <Check className="w-4 h-4" /> : 
                     matchPreview.matchLevel === "Strong Match" ? <AlertTriangle className="w-4 h-4" /> : 
                     <X className="w-4 h-4" />}
                  </div>
                </div>
                
                <div className={`text-center mb-6 py-2 px-4 rounded-full ${
                  matchPreview.matchLevel === "Ideal Match" ? "bg-green-100 text-green-800" :
                  matchPreview.matchLevel === "Strong Match" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}>
                  <span className="font-medium">{matchPreview.matchLevel}</span>
                </div>
                
                <div className="w-full space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Score Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Basic Information</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Impact Areas</span>
                        <span className="font-medium">{formData.impactAreas.length > 0 ? '5%' : '0%'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Bonus</span>
                        <span className="font-medium">{(formData.isGenderLed ? 5 : 0) + (formData.isYouthLed ? 5 : 0) + (formData.isRuralBased ? 5 : 0) + (formData.usesLocalSourcing ? 5 : 0)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Potential Matches</h4>
                    {matchPreview.score >= 60 ? (
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="bg-green-100 rounded p-1 mr-2">
                            <Zap className="w-3 h-3 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Green Growth Fund</p>
                            <p className="text-xs text-gray-500">$25k-75k grant</p>
                          </div>
                        </div>
                        {matchPreview.score >= 80 && (
                          <div className="flex items-start">
                            <div className="bg-green-100 rounded p-1 mr-2">
                              <Globe className="w-3 h-3 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Climate Tech Initiative</p>
                              <p className="text-xs text-gray-500">$50k-100k equity-free</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Complete more fields to see potential matches</p>
                    )}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Upcoming Deadlines</h4>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">2 matches</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-gray-100 rounded p-1 mr-2">
                          <Calendar className="w-3 h-3 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">May 15, 2025</p>
                          <p className="text-xs text-gray-500">Clean Energy Fund</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-gray-100 rounded p-1 mr-2">
                          <Calendar className="w-3 h-3 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">June 30, 2025</p>
                          <p className="text-xs text-gray-500">AgTech Innovation Grant</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">Complete required fields to see your match score</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}