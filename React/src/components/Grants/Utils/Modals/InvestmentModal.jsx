import React, { useState } from 'react';
import axiosClient from "../../../../axiosClient";

const InvestmentApplicationModal = ({ businessId, capitalId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    business_id: businessId,
    capital_id: capitalId,
    startup_name: '',
    contact_person_name: '',
    contact_person_email: '',
    sector: '',
    headquarters_location: '',
    stage: '',
    revenue_last_12_months: '',
    team_experience_avg_years: '',
    traction_kpis: '',
    pitch_deck_file: null,
    pitch_video: '',
    business_plan: null,
    social_impact_areas: '',
    cac_ltv: '',
    burn_rate: '',
    irr_projection: '',
    exit_strategy: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fileErrors, setFileErrors] = useState({
    pitch_deck_file: '',
    business_plan: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  // Validate numeric fields to prevent negative values
  const validateNumericField = (name, value) => {
    if (value === '') return '';
   
    const numValue = Number(value);
    if (isNaN(numValue)) return 'Must be a number';
   
    if (name === 'revenue_last_12_months' && numValue < 0)
      return 'Revenue cannot be negative';
    if (name === 'team_experience_avg_years' && (numValue < 0 || numValue > 50))
      return 'Must be between 0-50 years';
    if (name === 'cac_ltv' && numValue < 0)
      return 'Ratio cannot be negative';
    if (name === 'burn_rate' && numValue < 0)
      return 'Burn rate cannot be negative';
    if (name === 'irr_projection' && (numValue < -100 || numValue > 1000))
      return 'Must be between -100% and 1000%';
   
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
   
    // Validate numeric fields in real-time
    if (['revenue_last_12_months', 'team_experience_avg_years',
         'cac_ltv', 'burn_rate', 'irr_projection'].includes(name)) {
      const error = validateNumericField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
   
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFile = (file, allowedTypes, fieldName) => {
    if (!file) return '';
   
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return `File must be one of: ${allowedTypes.join(', ')}`;
    }
   
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }
   
    return '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, name) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { name, files: [file] } });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
   
    // Clear file if input is emptied
    if (!file && e.target.value === '') {
      setFormData(prev => ({ ...prev, [name]: null }));
      setFileErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }
   
    let error = '';
    if (file) {
      if (name === 'pitch_deck_file') {
        error = validateFile(file, ['pdf', 'docx'], name);
      } else if (name === 'business_plan') {
        error = validateFile(file, ['pdf', 'docx', 'ppt', 'pptx'], name);
      }
    }
   
    setFileErrors(prev => ({
      ...prev,
      [name]: error
    }));
   
    setFormData(prev => ({
      ...prev,
      [name]: error ? null : file
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.startup_name) {
        errors.startup_name = 'Startup name is required';
        isValid = false;
      }
      if (!formData.contact_person_name) {
        errors.contact_person_name = 'Contact name is required';
        isValid = false;
      }
      if (!formData.contact_person_email) {
        errors.contact_person_email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_person_email)) {
        errors.contact_person_email = 'Invalid email format';
        isValid = false;
      }
      if (!formData.sector) {
        errors.sector = 'Sector is required';
        isValid = false;
      }
      if (!formData.headquarters_location) {
        errors.headquarters_location = 'Location is required';
        isValid = false;
      }
      if (!formData.stage) {
        errors.stage = 'Funding stage is required';
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.revenue_last_12_months) {
        errors.revenue_last_12_months = 'Revenue is required';
        isValid = false;
      } else if (fieldErrors.revenue_last_12_months) {
        isValid = false;
      }
      if (!formData.team_experience_avg_years) {
        errors.team_experience_avg_years = 'Experience is required';
        isValid = false;
      } else if (fieldErrors.team_experience_avg_years) {
        isValid = false;
      }
      if (!formData.traction_kpis) {
        errors.traction_kpis = 'KPIs are required';
        isValid = false;
      }
      if (!formData.exit_strategy) {
        errors.exit_strategy = 'Exit strategy is required';
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
   
    setError(null);
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      await axiosClient.post('capital/investment-application', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${currentStep === step ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md' :
              currentStep > step ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
          >
            <span className="font-medium">{step}</span>
          </div>
          {step < 3 && (
            <div className={`h-1 w-16 mx-2 transition-all duration-300 ${currentStep > step ? 'bg-green-100' : 'bg-gray-100'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const InputField = ({ label, name, type = 'text', required = false, placeholder = '', className = '', ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
   
    return (
      <div className={`relative ${className}`}>
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none
            ${(isFocused || formData[name]) ?
              '-top-2.5 text-xs bg-white px-1 text-green-600' :
              'top-2.5 text-sm text-gray-500'}
            ${fieldErrors[name] && touchedFields[name] ? 'text-red-600' : ''}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTouchedFields(prev => ({ ...prev, [name]: true }));
          }}
          required={required}
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200
            ${fieldErrors[name] && touchedFields[name] ? 'border-red-300 focus:ring-red-200' :
              'border-gray-300 focus:border-green-500 focus:ring-green-200'}`}
          placeholder={isFocused ? placeholder : ''}
          onKeyDown={type === 'number' ? (e) => {
            // Prevent invalid characters in number inputs
            if (['e', 'E', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          } : undefined}
          {...props}
        />
        {fieldErrors[name] && touchedFields[name] && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };

  const SelectField = ({ label, name, options, required = false, className = '' }) => {
    const [isFocused, setIsFocused] = useState(false);
   
    return (
      <div className={`relative ${className}`}>
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none
            ${(isFocused || formData[name]) ?
              '-top-2.5 text-xs bg-white px-1 text-green-600' :
              'top-2.5 text-sm text-gray-500'}
            ${fieldErrors[name] && touchedFields[name] ? 'text-red-600' : ''}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTouchedFields(prev => ({ ...prev, [name]: true }));
          }}
          required={required}
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 appearance-none
            ${fieldErrors[name] && touchedFields[name] ? 'border-red-300 focus:ring-red-200' :
              'border-gray-300 focus:border-green-500 focus:ring-green-200'}`}
        >
          <option value=""></option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {fieldErrors[name] && touchedFields[name] && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };

  const TextAreaField = ({ label, name, required = false, placeholder = '', rows = 3, className = '' }) => {
    const [isFocused, setIsFocused] = useState(false);
   
    return (
      <div className={`relative ${className}`}>
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none
            ${(isFocused || formData[name]) ?
              '-top-2.5 text-xs bg-white px-1 text-green-600' :
              'top-2.5 text-sm text-gray-500'}
            ${fieldErrors[name] && touchedFields[name] ? 'text-red-600' : ''}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTouchedFields(prev => ({ ...prev, [name]: true }));
          }}
          required={required}
          rows={rows}
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200
            ${fieldErrors[name] && touchedFields[name] ? 'border-red-300 focus:ring-red-200' :
              'border-gray-300 focus:border-green-500 focus:ring-green-200'}`}
          placeholder={isFocused ? placeholder : ''}
        />
        {fieldErrors[name] && touchedFields[name] && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
        )}
      </div>
    );
  };

  const FileUploadField = ({ label, name, accept, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`border ${isDragging ? 'border-green-400 bg-green-50' : fileErrors[name] ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md p-4 transition-all duration-200 relative`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, name)}
      >
        {isDragging ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">Drop your file here</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name={name}
                      onChange={handleFileChange}
                      accept={accept}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {accept.includes('.pdf') && 'PDF, '}
                  {accept.includes('.docx') && 'DOCX, '}
                  {accept.includes('.ppt') && 'PPT up to 10MB'}
                </p>
              </div>
            </div>
            {formData[name] && !fileErrors[name] && (
              <div className="absolute bottom-2 left-0 right-0 px-4">
                <div className="bg-green-50 text-green-800 text-sm px-3 py-1 rounded flex items-center justify-between">
                  <span className="truncate flex-1">{formData[name].name}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, [name]: null }))}
                    className="text-green-600 hover:text-green-800 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {fileErrors[name] && (
        <p className="mt-1 text-sm text-red-600">{fileErrors[name]}</p>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Startup Name"
                name="startup_name"
                required
              />
             
              <InputField
                label="Contact Person Name"
                name="contact_person_name"
                required
              />
             
              <InputField
                label="Contact Email"
                name="contact_person_email"
                type="email"
                required
              />
             
              <SelectField
                label="Sector"
                name="sector"
                required
                options={[
                  { value: 'Technology', label: 'Technology' },
                  { value: 'Healthcare', label: 'Healthcare' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Education', label: 'Education' },
                  { value: 'Consumer Goods', label: 'Consumer Goods' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
             
              <InputField
                label="Headquarters Location"
                name="headquarters_location"
                required
              />
             
              <SelectField
                label="Funding Stage"
                name="stage"
                required
                options={[
                  { value: 'Pre-Seed', label: 'Pre-Seed' },
                  { value: 'Seed', label: 'Seed' },
                  { value: 'Series A', label: 'Series A' },
                  { value: 'Series B', label: 'Series B' },
                  { value: 'Series C+', label: 'Series C+' }
                ]}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Revenue (Last 12 Months)"
                name="revenue_last_12_months"
                type="number"
                required
                min="0"
                step="any"
              />
             
              <InputField
                label="Team Avg. Experience (Years)"
                name="team_experience_avg_years"
                type="number"
                required
                min="0"
                max="50"
                step="0.1"
              />
            </div>
           
            <TextAreaField
              label="Traction KPIs"
              name="traction_kpis"
              required
              placeholder="E.g., 5000+ users, $200K MRR"
            />
           
            <TextAreaField
              label="Exit Strategy"
              name="exit_strategy"
              required
              placeholder="E.g., IPO within 5 years, acquisition, etc."
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadField
                label="Pitch Deck (PDF/DOCX)"
                name="pitch_deck_file"
                accept=".pdf,.docx"
                required
              />
             
              <InputField
                label="Pitch Video (URL)"
                name="pitch_video"
                type="url"
                placeholder="https://example.com/video"
              />
             
              <FileUploadField
                label="Business Plan (PDF/DOCX/PPT)"
                name="business_plan"
                accept=".pdf,.docx,.ppt,.pptx"
              />
             
              <InputField
                label="Social Impact Areas"
                name="social_impact_areas"
                placeholder="Education, Environment, etc."
              />
             
              <InputField
                label="CAC/LTV Ratio"
                name="cac_ltv"
                type="number"
                min="0"
                step="0.1"
              />
             
              <InputField
                label="Monthly Burn Rate ($)"
                name="burn_rate"
                type="number"
                min="0"
              />
             
              <InputField
                label="Projected IRR (%)"
                name="irr_projection"
                type="number"
                min="-100"
                max="1000"
                step="0.1"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-scaleIn">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-bounce">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Application Submitted!</h3>
            <p className="text-gray-600 mb-8">
              We've received your application. Our investment team will review your submission and contact you within 5-7 business days.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scaleIn">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 w-full">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
       
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Investment Application</h2>
              <p className="text-gray-500 mt-1">Complete all steps to submit your application</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 transform hover:rotate-90"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {renderStepIndicator()}

          {/* Enhanced alert positioned below the header */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-fadeInDown shadow-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium mb-1">Submission Error</h4>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}
            className="space-y-8"
          >
            {renderStepContent()}

            <div className="pt-8 flex justify-between border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-x-1 hover:shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:translate-x-1 hover:shadow-lg"
                >
                  Continue
                  <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || fileErrors.pitch_deck_file}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Finalizing Submission...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvestmentApplicationModal;