import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OfferGrantModal = ({ onClose, refreshGrants }) => {
  // Refs for focus management
  const grantTitleRef = useRef(null);
  const modalRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    grantTitle: '',
    totalGrantAmount: '',
    fundingPerBusiness: '',
    eligibilityCriteria: '',
    requiredDocuments: [],
    applicationDeadline: '',
    grantFocus: '',
    startupStageFocus: [],
    impactObjectives: '',
    evaluationCriteria: '',
    grantBriefPDF: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // Light theme with green accents
  const theme = {
    primary: '#4CAF50',       // Vibrant green
    secondary: '#388E3C',     // Darker green
    accent: '#C8E6C9',        // Light green
    text: '#333333',          // Dark text
    lightText: '#666666',     // Secondary text
    background: '#FFFFFF',    // White background
    card: '#F8F8F8',          // Light gray cards
    border: '#E0E0E0',        // Light border
    error: '#F44336',         // Error red
    glow: '0 0 0 2px rgba(76, 175, 80, 0.2)' // Subtle green glow
  };

  // Options data
  const documentOptions = [
    'Pitch Deck',
    'Business Registration',
    'Financial Statements',
    'Tax Compliance',
    'Team Profiles',
    'Market Research',
    'Business Plan',
    'Proof of Concept',
    'Customer Testimonials',
    'Patents/Trademarks'
  ];

  const focusOptions = [
    'Agriculture',
    'Renewable Energy',
    'Tech',
    'Healthcare',
    'Education',
    'Manufacturing',
    'AI & Robotics',
    'Blockchain',
    'Biotech',
    'Space Tech'
  ];

  const stageOptions = [
    'Idea',
    'MVP',
    'Seed',
    'Growth',
    'Scale',
    'Pre-Seed',
    'Series A+'
  ];

  // Focus first input on mount
  useEffect(() => {
    grantTitleRef.current.focus();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Log all form changes
  useEffect(() => {
    console.log('Form updated:', formData);
  }, [formData]);

  // Handle form input changes with validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Prevent negative numbers for amount fields
    if ((name === 'totalGrantAmount' || name === 'fundingPerBusiness') && value < 0) {
      return;
    }
    
    if (type === 'checkbox') {
      const fieldName = e.target.name;
      const currentValues = formData[fieldName];
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: checked
          ? [...currentValues, value]
          : currentValues.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle file upload with size validation (max 5MB)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB', {
        style: { backgroundColor: theme.error }
      });
      return;
    }
    setFormData(prev => ({ ...prev, grantBriefPDF: file }));
  };

  // Validate all form fields
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'grantTitle', 'totalGrantAmount', 'fundingPerBusiness',
      'eligibilityCriteria', 'applicationDeadline', 'grantFocus',
      'impactObjectives', 'evaluationCriteria', 'grantBriefPDF'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || 
          (Array.isArray(formData[field]) && formData[field].length === 0)) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    if (formData.totalGrantAmount <= 0) {
      errors.totalGrantAmount = 'Amount must be positive';
    }

    if (formData.fundingPerBusiness <= 0) {
      errors.fundingPerBusiness = 'Amount must be positive';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log final form data before submission
    console.log('Submitting form:', formData);
    
    if (!validateForm()) {
      toast.error('Please complete all required fields', {
        style: { backgroundColor: theme.error }
      });
      return;
    }
    
    setIsSubmitting(true);
    const loadingToastId = toast.loading('Creating grant offer...', {
      style: { backgroundColor: theme.primary }
    });
  
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(key, item));
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value);
        }
      });

      // API call - replace with your actual endpoint
      const response = await axios.post('http://your-api-endpoint.com/api/grants', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        timeout: 15000
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || 'Failed to create grant');
      }

      toast.update(loadingToastId, {
        render: 'Grant created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        style: { backgroundColor: theme.primary }
      });

      setShowSuccessModal(true);
      refreshGrants();
      resetForm();

    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = 'Failed to create grant. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection';
      }

      toast.update(loadingToastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        style: { backgroundColor: theme.error }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      grantTitle: '',
      totalGrantAmount: '',
      fundingPerBusiness: '',
      eligibilityCriteria: '',
      requiredDocuments: [],
      applicationDeadline: '',
      grantFocus: '',
      startupStageFocus: [],
      impactObjectives: '',
      evaluationCriteria: '',
      grantBriefPDF: null
    });
    setValidationErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">Create New Grant Offer</h2>
              <p className="text-sm text-gray-600">Fill in all required fields to create a new grant opportunity</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Grant Title */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grant Title <span className="text-red-500">*</span>
                </label>
                <input
                  ref={grantTitleRef}
                  type="text"
                  name="grantTitle"
                  value={formData.grantTitle}
                  onChange={handleChange}
                  onFocus={() => setActiveField('grantTitle')}
                  onBlur={() => setActiveField(null)}
                  className={`mt-1 block w-full rounded-xl bg-white border ${activeField === 'grantTitle' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                    validationErrors.grantTitle ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter grant title"
                />
                {validationErrors.grantTitle && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.grantTitle}</p>
                )}
              </div>
              
              {/* Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Grant Amount (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="totalGrantAmount"
                      value={formData.totalGrantAmount}
                      onChange={handleChange}
                      onFocus={() => setActiveField('totalGrantAmount')}
                      onBlur={() => setActiveField(null)}
                      min="0"
                      step="1000"
                      className={`block w-full rounded-xl bg-white border ${activeField === 'totalGrantAmount' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} pl-12 pr-5 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                        validationErrors.totalGrantAmount ? 'border-red-500' : ''
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {validationErrors.totalGrantAmount && (
                    <p className="mt-2 text-sm text-red-500">{validationErrors.totalGrantAmount}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding per Business (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="fundingPerBusiness"
                      value={formData.fundingPerBusiness}
                      onChange={handleChange}
                      onFocus={() => setActiveField('fundingPerBusiness')}
                      onBlur={() => setActiveField(null)}
                      min="0"
                      step="100"
                      className={`block w-full rounded-xl bg-white border ${activeField === 'fundingPerBusiness' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} pl-12 pr-5 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                        validationErrors.fundingPerBusiness ? 'border-red-500' : ''
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {validationErrors.fundingPerBusiness && (
                    <p className="mt-2 text-sm text-red-500">{validationErrors.fundingPerBusiness}</p>
                  )}
                </div>
              </div>
              
              {/* Eligibility Criteria */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={handleChange}
                  onFocus={() => setActiveField('eligibilityCriteria')}
                  onBlur={() => setActiveField(null)}
                  rows="4"
                  className={`mt-1 block w-full rounded-xl bg-white border ${activeField === 'eligibilityCriteria' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                    validationErrors.eligibilityCriteria ? 'border-red-500' : ''
                  }`}
                  placeholder="List the eligibility criteria for applicants"
                />
                {validationErrors.eligibilityCriteria && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.eligibilityCriteria}</p>
                )}
              </div>
              
              {/* Required Documents */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Documents <span className="text-red-500">*</span>
                </label>
                <div className={`mt-1 p-5 border rounded-xl bg-gray-50 ${
                  validationErrors.requiredDocuments ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentOptions.map((doc) => (
                      <label key={doc} className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="requiredDocuments"
                            value={doc}
                            checked={formData.requiredDocuments.includes(doc)}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 rounded border-2 border-gray-400 peer-checked:border-green-500 peer-checked:bg-green-500 transition-all duration-200 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-gray-700">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {validationErrors.requiredDocuments && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.requiredDocuments}</p>
                )}
              </div>
              
              {/* Application Deadline */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  onFocus={() => setActiveField('applicationDeadline')}
                  onBlur={() => setActiveField(null)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full rounded-xl bg-white border ${activeField === 'applicationDeadline' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} px-5 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                    validationErrors.applicationDeadline ? 'border-red-500' : ''
                  }`}
                />
                {validationErrors.applicationDeadline && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.applicationDeadline}</p>
                )}
              </div>
              
              {/* Grant Focus */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grant Focus <span className="text-red-500">*</span>
                </label>
                <select
                  name="grantFocus"
                  value={formData.grantFocus}
                  onChange={handleChange}
                  onFocus={() => setActiveField('grantFocus')}
                  onBlur={() => setActiveField(null)}
                  className={`mt-1 block w-full rounded-xl bg-white border ${activeField === 'grantFocus' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} px-5 py-3 text-gray-900 focus:outline-none transition-all duration-200 ${
                    validationErrors.grantFocus ? 'border-red-500' : ''
                  }`}
                >
                  <option value="" className="text-gray-400">Select Focus Area</option>
                  {focusOptions.map(option => (
                    <option key={option} value={option} className="text-gray-900">{option}</option>
                  ))}
                </select>
                {validationErrors.grantFocus && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.grantFocus}</p>
                )}
              </div>
              
              {/* Startup Stage Focus */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Stage Focus <span className="text-red-500">*</span>
                </label>
                <div className={`mt-1 p-5 border rounded-xl bg-gray-50 ${
                  validationErrors.startupStageFocus ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stageOptions.map((stage) => (
                      <label key={stage} className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="startupStageFocus"
                            value={stage}
                            checked={formData.startupStageFocus.includes(stage)}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 rounded border-2 border-gray-400 peer-checked:border-green-500 peer-checked:bg-green-500 transition-all duration-200 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-gray-700">{stage}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {validationErrors.startupStageFocus && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.startupStageFocus}</p>
                )}
              </div>
              
              {/* Impact Objectives */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impact Objectives <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="impactObjectives"
                  value={formData.impactObjectives}
                  onChange={handleChange}
                  onFocus={() => setActiveField('impactObjectives')}
                  onBlur={() => setActiveField(null)}
                  rows="4"
                  className={`mt-1 block w-full rounded-xl bg-white border ${activeField === 'impactObjectives' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                    validationErrors.impactObjectives ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe the expected impact objectives of this grant"
                />
                {validationErrors.impactObjectives && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.impactObjectives}</p>
                )}
              </div>
              
              {/* Evaluation Criteria */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evaluation Criteria <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="evaluationCriteria"
                  value={formData.evaluationCriteria}
                  onChange={handleChange}
                  onFocus={() => setActiveField('evaluationCriteria')}
                  onBlur={() => setActiveField(null)}
                  rows="4"
                  className={`mt-1 block w-full rounded-xl bg-white border ${activeField === 'evaluationCriteria' ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'} px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                    validationErrors.evaluationCriteria ? 'border-red-500' : ''
                  }`}
                  placeholder="Explain how applications will be evaluated"
                />
                {validationErrors.evaluationCriteria && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.evaluationCriteria}</p>
                )}
              </div>
              
              {/* Grant Brief PDF */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Grant Brief PDF <span className="text-red-500">*</span>
                </label>
                <div className={`mt-1 p-5 border rounded-xl bg-gray-50 ${
                  validationErrors.grantBriefPDF ? 'border-red-500' : 'border-gray-300'
                }`}>
                  <div className="flex items-center">
                    <label className="flex flex-1 cursor-pointer">
                      <span className="inline-flex items-center px-5 py-3 border border-gray-300 rounded-l-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                        Choose File
                      </span>
                      <span className="ml-0.5 inline-flex items-center px-4 py-3 rounded-r-xl text-sm text-gray-700 bg-gray-100 flex-1 truncate">
                        {formData.grantBriefPDF ? formData.grantBriefPDF.name : 'No file chosen'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {formData.grantBriefPDF && (
                    <p className="mt-3 text-xs text-green-600">
                      File selected: {formData.grantBriefPDF.name} ({(formData.grantBriefPDF.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
                {validationErrors.grantBriefPDF && (
                  <p className="mt-2 text-sm text-red-500">{validationErrors.grantBriefPDF}</p>
                )}
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="mt-10 flex justify-end border-t border-gray-200 pt-8 space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-all duration-200 hover:shadow-md"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all duration-200 hover:shadow-md flex items-center justify-center min-w-40"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Grant Offer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto border border-gray-200 p-8 text-center"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Grant Created Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your new grant offer has been created and is now visible to potential applicants.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
                className="px-8 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferGrantModal;