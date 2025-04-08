import React, { useState } from 'react';
import axios from 'axios';

const GrantApplicationModal = ({ onClose, userId, }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    organizationName: '',
    sector: '',
    location: '',
    stage: '',
    
    // Step 2: Financial & Team
    annualRevenue: 0,
    teamExperienceYears: 0,
    isGenderLed: false,
    isYouthLed: false,
    
    // Step 3: Impact & Operations
    impactScore: 0,
    isRuralBased: false,
    usesLocalSourcing: false,
    
    // Step 4: Grant Specific
    grantPurpose: '',
    expectedOutcomes: '',
    budgetBreakdown: '',
    
    // Step 5: Documents
    pitchDeck: null,
    businessPlan: null,
    financialStatements: null,
    additionalDocuments: [],
    
    // Matching criteria
    milestoneSuccessRate: 0,
    documentsComplete: false
  });

  const [matchResult, setMatchResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: e.target.files[0]
    }));
  };

  const calculateMatchScore = async () => {
    try {
      const response = await axios.post('/api/match-score', {
        business: {
          sector: formData.sector,
          location: formData.location,
          stage: formData.stage,
          revenue: formData.annualRevenue,
          team_experience_years: formData.teamExperienceYears,
          impact_score: formData.impactScore,
          milestone_success_rate: formData.milestoneSuccessRate,
          documents_complete: formData.documentsComplete,
          is_gender_led: formData.isGenderLed,
          is_youth_led: formData.isYouthLed,
          is_rural_based: formData.isRuralBased,
          uses_local_sourcing: formData.usesLocalSourcing
        },
        fund: {
          preferred_sectors: ["Agriculture", "Renewable Energy", "Tech"],
          target_regions: ["Kenya", "Uganda", "Tanzania"],
          target_stages: ["Seed", "Growth", "MVP"],
          min_revenue: 10000,
          team_threshold: 2,
          impact_threshold: 5
        }
      });
      setMatchResult(response.data);
      return response.data.score;
    } catch (error) {
      console.error("Error calculating match score:", error);
      return 0;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const score = await calculateMatchScore();
    
    if (score >= 60) {
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          if (key === 'additionalDocuments') {
            formData.additionalDocuments.forEach(file => {
              formDataToSend.append('additionalDocuments', file);
            });
          } else if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
        
        await axios.post('/api/grant-applications', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setCurrentStep(6);
      } catch (error) {
        console.error("Submission error:", error);
      }
    }
    
    setIsSubmitting(false);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-neutral-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neutral-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">Grant Application</h2>
              <p className="text-sm text-neutral-500">Complete all steps to submit your application</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 -z-10"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-teal-500 -translate-y-1/2 -z-10 transition-all duration-500" 
                style={{ width: `${(currentStep - 1) * 25}%` }}
              ></div>
              
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${currentStep > step ? 'bg-lime-500 border-gray-100 text-white' : 
                      currentStep === step ? 'border-gray-700 bg-white text-green' : 
                      'border-neutral-300 bg-white text-neutral-400'}`}>
                    {currentStep > step ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${currentStep >= step ? 'text-neutral-800' : 'text-neutral-400'}`}>
                    {step === 1 && 'Basic'}
                    {step === 2 && 'Financial'}
                    {step === 3 && 'Impact'}
                    {step === 4 && 'Details'}
                    {step === 5 && 'Docs'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Steps */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-2">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-neutral-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 border"
                    required
                    placeholder="Enter organization name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Sector</label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-neutral-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 border"
                      required
                    >
                      <option value="">Select Sector</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Renewable Energy">Renewable Energy</option>
                      <option value="Tech">Tech</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-neutral-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 border"
                      required
                    >
                      <option value="">Select Location</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Rwanda">Rwanda</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Business Stage</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {['Idea', 'MVP', 'Seed', 'Growth'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="stage"
                          value={option}
                          checked={formData.stage === option}
                          onChange={handleChange}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-neutral-300"
                          required
                        />
                        <span className="ml-2 text-sm text-neutral-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-2">Financial & Team Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Annual Revenue (USD)</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="annualRevenue"
                        value={formData.annualRevenue}
                        onChange={handleChange}
                        className="block w-full rounded-lg border-neutral-300 pl-7 pr-12 focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 border"
                        required
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Team Experience (Years)</label>
                    <input
                      type="number"
                      name="teamExperienceYears"
                      value={formData.teamExperienceYears}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-neutral-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 border"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Milestone Success Rate</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      name="milestoneSuccessRate"
                      value={formData.milestoneSuccessRate}
                      onChange={handleChange}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    />
                    <div className="flex justify-between text-xs text-neutral-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                    <div className="text-center mt-1 text-sm font-medium text-teal-600">
                      {formData.milestoneSuccessRate}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Organization Type</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isGenderLed"
                        checked={formData.isGenderLed}
                        onChange={handleChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-700">Gender-led</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isYouthLed"
                        checked={formData.isYouthLed}
                        onChange={handleChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-700">Youth-led (under 35)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-2">Impact & Operations</h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Impact Score <span className="text-neutral-400">(0-10 scale)</span>
                  </label>
                  <div className="mt-2 flex items-center">
                    {[...Array(11)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, impactScore: i }))}
                        className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 transition-colors ${
                          formData.impactScore >= i ? 'bg-yellow-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Low impact</span>
                    <span>High impact</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-neutral-200 rounded-lg bg-white">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isRuralBased"
                        checked={formData.isRuralBased}
                        onChange={handleChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-neutral-700">Rural-based operations</span>
                    </label>
                    <p className="mt-1 text-xs text-neutral-500">Check if your primary operations are in rural areas</p>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-lg bg-white">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="usesLocalSourcing"
                        checked={formData.usesLocalSourcing}
                        onChange={handleChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-neutral-700">Uses local sourcing</span>
                    </label>
                    <p className="mt-1 text-xs text-neutral-500">Materials/labor sourced locally</p>
                  </div>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg bg-white">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="documentsComplete"
                      checked={formData.documentsComplete}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-neutral-700">All required documents are complete</span>
                  </label>
                  <p className="mt-1 text-xs text-neutral-500">Ensure you have all documents ready for upload</p>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-2">Grant Purpose & Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Purpose of Grant</label>
                  <textarea
                    name="grantPurpose"
                    value={formData.grantPurpose}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-lg border-neutral-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 border"
                    required
                    placeholder="Describe the purpose of the grant funding"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Expected Outcomes</label>
                  <textarea
                    name="expectedOutcomes"
                    value={formData.expectedOutcomes}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-lg border-neutral-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 border"
                    required
                    placeholder="What outcomes do you expect from this grant?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Budget Breakdown</label>
                  <textarea
                    name="budgetBreakdown"
                    value={formData.budgetBreakdown}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 block w-full rounded-lg border-neutral-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 border font-mono text-sm"
                    required
                    placeholder="Provide a detailed breakdown of how funds will be used"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Format: Category - Amount - Purpose</p>
                </div>
              </div>
            )}
            
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-2">Required Documents</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Pitch Deck (PDF)', name: 'pitchDeck', accept: '.pdf' },
                    { label: 'Business Plan (PDF)', name: 'businessPlan', accept: '.pdf' },
                    { label: 'Financial Statements (PDF)', name: 'financialStatements', accept: '.pdf' },
                    { label: 'Additional Supporting Documents (Optional)', name: 'additionalDocuments', accept: '*', multiple: true }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-4 border border-neutral-200 rounded-lg bg-white hover:border-teal-300 transition-colors">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">{doc.label}</label>
                      <div className="flex items-center">
                        <label className="flex flex-1 cursor-pointer">
                          <span className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-l-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            Choose File
                          </span>
                          <span className="ml-2 inline-flex items-center px-3 py-2 rounded-r-md text-sm text-neutral-500 bg-neutral-50 flex-1 truncate">
                            {formData[doc.name] ? 
                              (doc.multiple ? 
                                `${formData[doc.name].length} files selected` : 
                                formData[doc.name].name) : 
                              'No file chosen'}
                          </span>
                          <input
                            type="file"
                            accept={doc.accept}
                            onChange={doc.multiple ? 
                              (e) => {
                                const files = Array.from(e.target.files);
                                setFormData(prev => ({
                                  ...prev,
                                  additionalDocuments: files
                                }));
                              } : 
                              (e) => handleFileUpload(e, doc.name)}
                            className="sr-only"
                            required={!doc.multiple}
                            multiple={doc.multiple}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                {matchResult && (
                  <div className={`p-4 rounded-lg border ${
                    matchResult.score >= 80 ? 'bg-teal-50 border-teal-200 text-teal-800' :
                    matchResult.score >= 60 ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {matchResult.score >= 80 ? (
                          <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : matchResult.score >= 60 ? (
                          <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="font-semibold">
                          Match Score: <span className="font-mono">{matchResult.score}%</span> - {matchResult.result}
                        </h4>
                        {matchResult.score < 80 && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium">Tips to improve:</p>
                            <ul className="list-disc pl-5 space-y-1 mt-1">
                              <li>Ensure all documents are complete</li>
                              <li>Provide detailed impact metrics</li>
                              <li>Demonstrate team experience clearly</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {currentStep === 6 && (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-teal-100">
                  <svg className="h-10 w-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-bold text-neutral-900">Application Submitted</h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Your grant application has been received. We'll review your submission and notify you of next steps.
                </p>
                
                {matchResult && (
                  <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          matchResult.score >= 80 ? 'bg-teal-100 text-teal-600' :
                          matchResult.score >= 60 ? 'bg-blue-100 text-blue-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          <span className="text-lg font-bold">{matchResult.score}%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-neutral-800">Match Potential</h4>
                        <p className="text-sm text-neutral-500">
                          {matchResult.score >= 80 ? 'Excellent fit with available grants' :
                           matchResult.score >= 60 ? 'Good potential for matching' :
                           'Consider improving your application'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            {currentStep < 6 && (
              <div className="mt-8 flex justify-between border-t border-neutral-200 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 rounded-lg text-sm font-medium ${
                    currentStep === 1 ? 'text-neutral-400 bg-neutral-100 cursor-not-allowed' : 
                    'text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300'
                  } transition-colors duration-200`}
                >
                  Back
                </button>
                
                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green hover:bg-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 transition-colors duration-200 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : 'Submit Application'}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrantApplicationModal;