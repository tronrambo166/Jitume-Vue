import React, { useState, useEffect } from 'react';
import axiosClient from "../../../../axiosClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    pitch_video_file: null,
    business_plan: null,
    social_impact_areas: '',
    cac_ltv: '',
    burn_rate: '',
    irr_projection: '',
    exit_strategy: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});

  // Validate numeric fields to prevent negative values
  const validateNumericField = (name, value) => {
    if (value === '') return true;

    const numValue = Number(value);
    if (isNaN(numValue)) return false;

    // Specific validation for team_experience_avg_years - must be an integer
    if (name === 'team_experience_avg_years') {
      if (!Number.isInteger(numValue) || numValue < 0 || numValue > 50) {
        return false;
      }
    } else if (name === 'revenue_last_12_months' && numValue < 0) {
      return false;
    } else if (name === 'cac_ltv' && numValue < 0) {
      return false;
    } else if (name === 'burn_rate' && numValue < 0) {
      return false;
    } else if (name === 'irr_projection' && (numValue < -100 || numValue > 1000)) {
      return false;
    }

    return true;
  };

  // Clear field error when user focuses on the field
  const handleFocus = (e) => {
    const { name } = e.target;
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for team_experience_avg_years to enforce integers
    if (name === 'team_experience_avg_years') {
      // If value is empty, allow it
      if (value === '') {
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
      }

      // Only allow integer input
      const intValue = parseInt(value, 10);

      if (isNaN(intValue)) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: 'Please enter a whole number'
        }));
        return;
      }

      if (intValue < 0 || intValue > 50) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: 'Experience must be between 0-50 years'
        }));
        return;
      }

      // Set the integer value
      setFormData(prev => ({ ...prev, [name]: intValue }));
      // Clear error
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    // Validate other numeric fields in real-time
    if (['revenue_last_12_months', 'cac_ltv', 'burn_rate', 'irr_projection'].includes(name)) {
      if (!validateNumericField(name, value)) {
        let errorMessage;

        if (name === 'revenue_last_12_months') errorMessage = 'Revenue cannot be negative';
        else if (name === 'cac_ltv') errorMessage = 'CAC/LTV ratio cannot be negative';
        else if (name === 'burn_rate') errorMessage = 'Burn rate cannot be negative';
        else if (name === 'irr_projection') errorMessage = 'IRR must be between -100% and 1000%';

        setFieldErrors(prev => ({
          ...prev,
          [name]: errorMessage
        }));
        return;
      } else {
        // Clear error
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFile = (file, allowedTypes) => {
    if (!file) return true;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        message: `File must be one of: ${allowedTypes.join(', ')}`
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        valid: false,
        message: 'File size must be less than 10MB'
      };
    }

    return { valid: true };
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    // Clear file if input is emptied
    if (!file) {
      setFormData(prev => ({ ...prev, [name]: null }));
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    let validationResult;
    if (name === 'pitch_deck_file') {
      validationResult = validateFile(file, ['pdf', 'docx']);
    } else if (name === 'business_plan') {
      validationResult = validateFile(file, ['pdf', 'docx', 'ppt', 'pptx']);
    } else if (name === 'pitch_video_file') {
      validationResult = validateFile(file, ['mp4', 'mov', 'avi', 'wmv']);
    }

    if (validationResult.valid) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validationResult.message
      }));
      // Clear the file input
      e.target.value = '';
      toast.error(validationResult.message);
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    let requiredFields = [];
    const errors = {};

    if (step === 1) {
      requiredFields = ['startup_name', 'contact_person_name', 'contact_person_email', 'sector', 'headquarters_location', 'stage'];

      // Email validation
      if (formData.contact_person_email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_person_email)) {
          errors.contact_person_email = 'Please enter a valid email address';
          isValid = false;
        }
      }
    } else if (step === 2) {
      requiredFields = ['revenue_last_12_months', 'team_experience_avg_years', 'traction_kpis', 'exit_strategy'];
    } else if (step === 3) {
      // Make pitch_deck_file required
      if (!formData.pitch_deck_file) {
        errors.pitch_deck_file = 'Pitch Deck is required';
        isValid = false;
      }
    }

    // Check required fields
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      missingFields.forEach(field => {
        errors[field] = 'This field is required';
      });

      const fieldNames = missingFields.map(field => field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      toast.error(`Please fill in all required fields`, {
        autoClose: 3000,
      });
      isValid = false;
    }

    setFieldErrors(prev => ({
      ...prev,
      ...errors
    }));

    return isValid;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      const response = await axiosClient.post('capital/investment-application', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response); return;

      //setSuccess(true);
      toast.success('Application submitted successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);

      // Handle validation errors from the server
      if (err.response?.data?.errors) {
        const serverErrors = {};
        Object.entries(err.response.data.errors).forEach(([key, messages]) => {
          serverErrors[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setFieldErrors(prev => ({
          ...prev,
          ...serverErrors
        }));
      }
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

  // Helper function to render error feedback
  const renderFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      return <p className="mt-1 text-sm text-red-600">{fieldErrors[fieldName]}</p>;
    }
    return null;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="startup_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Startup Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="startup_name"
                  name="startup_name"
                  value={formData.startup_name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.startup_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter startup name"
                  required
                />
                {renderFieldError('startup_name')}
              </div>

              <div className="mb-4">
                <label htmlFor="contact_person_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact_person_name"
                  name="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.contact_person_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter contact person name"
                  required
                />
                {renderFieldError('contact_person_name')}
              </div>

              <div className="mb-4">
                <label htmlFor="contact_person_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact_person_email"
                  name="contact_person_email"
                  value={formData.contact_person_email}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.contact_person_email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="email@example.com"
                  required
                />
                {renderFieldError('contact_person_email')}
              </div>

              <div className="mb-4">
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                  Sector <span className="text-red-500">*</span>
                </label>
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.sector ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  required
                >
                  <option value="">Select Sector</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Consumer Goods">Consumer Goods</option>
                  <option value="Other">Other</option>
                </select>
                {renderFieldError('sector')}
              </div>

              <div className="mb-4">
                <label htmlFor="headquarters_location" className="block text-sm font-medium text-gray-700 mb-1">
                  Headquarters Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="headquarters_location"
                  name="headquarters_location"
                  value={formData.headquarters_location}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.headquarters_location ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="City, Country"
                  required
                />
                {renderFieldError('headquarters_location')}
              </div>

              <div className="mb-4">
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Stage <span className="text-red-500">*</span>
                </label>
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.stage ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  required
                >
                  <option value="">Select Funding Stage</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C+">Series C+</option>
                </select>
                {renderFieldError('stage')}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="revenue_last_12_months" className="block text-sm font-medium text-gray-700 mb-1">
                  Revenue (Last 12 Months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="revenue_last_12_months"
                  name="revenue_last_12_months"
                  value={formData.revenue_last_12_months}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.revenue_last_12_months ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter amount in USD"
                  min="0"
                  step="any"
                  required
                />
                {renderFieldError('revenue_last_12_months')}
              </div>

              <div className="mb-4">
                <label htmlFor="team_experience_avg_years" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Avg. Experience (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="team_experience_avg_years"
                  name="team_experience_avg_years"
                  value={formData.team_experience_avg_years}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.team_experience_avg_years ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter whole years (0-50)"
                  min="0"
                  max="50"
                  step="1" // Changed to 1 to ensure integer values only
                  required
                />
                {renderFieldError('team_experience_avg_years')}
                <p className="mt-1 text-xs text-gray-500">Please enter whole numbers only (0-50)</p>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="traction_kpis" className="block text-sm font-medium text-gray-700 mb-1">
                Traction KPIs <span className="text-red-500">*</span>
              </label>
              <textarea
                id="traction_kpis"
                name="traction_kpis"
                value={formData.traction_kpis}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`w-full px-4 py-2 border ${fieldErrors.traction_kpis ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                placeholder="E.g., 5000+ users, $200K MRR"
                rows="3"
                required
              />
              {renderFieldError('traction_kpis')}
            </div>

            <div className="mb-4">
              <label htmlFor="exit_strategy" className="block text-sm font-medium text-gray-700 mb-1">
                Exit Strategy <span className="text-red-500">*</span>
              </label>
              <textarea
                id="exit_strategy"
                name="exit_strategy"
                value={formData.exit_strategy}
                onChange={handleChange}
                onFocus={handleFocus}
                className={`w-full px-4 py-2 border ${fieldErrors.exit_strategy ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                placeholder="E.g., IPO within 5 years, acquisition, etc."
                rows="3"
                required
              />
              {renderFieldError('exit_strategy')}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="pitch_deck_file" className="block text-sm font-medium text-gray-700 mb-1">
                  Pitch Deck (PDF/DOCX) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="pitch_deck_file"
                  name="pitch_deck_file"
                  onChange={handleFileChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.pitch_deck_file ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  accept=".pdf,.docx"
                  required
                />
                {formData.pitch_deck_file && (
                  <p className="mt-1 text-sm text-green-600">
                    Selected: {formData.pitch_deck_file.name}
                  </p>
                )}
                {renderFieldError('pitch_deck_file')}
              </div>

              <div className="mb-4">
                <label htmlFor="pitch_video_file" className="block text-sm font-medium text-gray-700 mb-1">
                  Pitch Video (MP4/MOV/AVI)
                </label>
                <input
                  type="file"
                  id="pitch_video_file"
                  name="pitch_video_file"
                  onChange={handleFileChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.pitch_video_file ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  accept=".mp4,.mov,.avi,.wmv"
                />
                {formData.pitch_video_file && (
                  <p className="mt-1 text-sm text-green-600">
                    Selected: {formData.pitch_video_file.name}
                  </p>
                )}
                {renderFieldError('pitch_video_file')}
              </div>

              <div className="mb-4">
                <label htmlFor="business_plan" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Plan (PDF/DOCX/PPT)
                </label>
                <input
                  type="file"
                  id="business_plan"
                  name="business_plan"
                  onChange={handleFileChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.business_plan ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  accept=".pdf,.docx,.ppt,.pptx"
                />
                {formData.business_plan && (
                  <p className="mt-1 text-sm text-green-600">
                    Selected: {formData.business_plan.name}
                  </p>
                )}
                {renderFieldError('business_plan')}
              </div>

              <div className="mb-4">
                <label htmlFor="social_impact_areas" className="block text-sm font-medium text-gray-700 mb-1">
                  Social Impact Areas
                </label>
                <input
                  type="text"
                  id="social_impact_areas"
                  name="social_impact_areas"
                  value={formData.social_impact_areas}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.social_impact_areas ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Education, Environment, etc."
                />
                {renderFieldError('social_impact_areas')}
              </div>

              <div className="mb-4">
                <label htmlFor="cac_ltv" className="block text-sm font-medium text-gray-700 mb-1">
                  CAC/LTV Ratio
                </label>
                <input
                  type="number"
                  id="cac_ltv"
                  name="cac_ltv"
                  value={formData.cac_ltv}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.cac_ltv ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter ratio (e.g. 3.5)"
                  min="0"
                  step="0.1"
                />
                {renderFieldError('cac_ltv')}
              </div>

              <div className="mb-4">
                <label htmlFor="burn_rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Burn Rate ($)
                </label>
                <input
                  type="number"
                  id="burn_rate"
                  name="burn_rate"
                  value={formData.burn_rate}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.burn_rate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter amount in USD"
                  min="0"
                />
                {renderFieldError('burn_rate')}
              </div>

              <div className="mb-4">
                <label htmlFor="irr_projection" className="block text-sm font-medium text-gray-700 mb-1">
                  Projected IRR (%)
                </label>
                <input
                  type="number"
                  id="irr_projection"
                  name="irr_projection"
                  value={formData.irr_projection}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className={`w-full px-4 py-2 border ${fieldErrors.irr_projection ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter percentage (-100 to 1000)"
                  min="-100"
                  max="1000"
                  step="0.1"
                />
                {renderFieldError('irr_projection')}
              </div>
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
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">Thank you for your submission. We'll review your application and get back to you soon.</p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-95 animate-scaleIn my-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Investment Application</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderStepIndicator()}

            {renderStepContent()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`ml-auto px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default InvestmentApplicationModal;
