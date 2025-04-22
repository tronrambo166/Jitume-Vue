import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CapitalEditModal = ({ capitalData, onClose, onSave }) => {
  // Form state
  const [formData, setFormData] = useState({
    offer_title: '',
    total_capital_available: '',
    per_startup_allocation: '',
    startup_stage: '',
    sectors: '',
    regions: '',
    required_docs: '',
    milestone_requirements: '',
    offer_brief_file: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState({
    name: '',
    size: 0,
    type: '',
    lastModified: 0,
    preview: null
  });

  // Initialize form with capital data
  useEffect(() => {
    if (capitalData) {
      setFormData({
        offer_title: capitalData.offer_title || '',
        total_capital_available: capitalData.total_capital_available || '',
        per_startup_allocation: capitalData.per_startup_allocation || '',
        startup_stage: capitalData.startup_stage || '',
        sectors: capitalData.sectors || '',
        regions: capitalData.regions || '',
        required_docs: capitalData.required_docs || '',
        milestone_requirements: capitalData.milestone_requirements || '',
        offer_brief_file: null
      });
      
      if (capitalData.offer_brief_file) {
        setFileInfo(prev => ({
          ...prev,
          name: capitalData.offer_brief_file,
          preview: capitalData.offer_brief_file_url || null
        }));
      }
    }
  }, [capitalData]);

  console.log('Capital Data:', capitalData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    // Set form data with file object
    setFormData(prev => ({
      ...prev,
      offer_brief_file: file
    }));

    // Set detailed file info
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      preview: URL.createObjectURL(file)
    });

    setError(null);
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      offer_brief_file: null
    }));
    setFileInfo({
      name: '',
      size: 0,
      type: '',
      lastModified: 0,
      preview: null
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Log detailed form data before submission
      console.log('Form data to be submitted:', {
        ...formData,
        offer_brief_file: formData.offer_brief_file ? {
          name: formData.offer_brief_file.name,
          size: formatFileSize(formData.offer_brief_file.size),
          type: formData.offer_brief_file.type,
          lastModified: new Date(formData.offer_brief_file.lastModified).toLocaleString()
        } : 'No file selected'
      });

      const apiUrl = `/api/capitals/${capitalData.id}`;
      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update capital offer');
      console.error('Error updating capital offer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Capital Offer</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offer Title */}
              <div>
                <label htmlFor="offer_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Title*
                </label>
                <input
                  type="text"
                  id="offer_title"
                  name="offer_title"
                  value={formData.offer_title}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Total Capital Available */}
              <div>
                <label htmlFor="total_capital_available" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Capital ($)*
                </label>
                <input
                  type="number"
                  id="total_capital_available"
                  name="total_capital_available"
                  value={formData.total_capital_available}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Per Startup Allocation */}
              <div>
                <label htmlFor="per_startup_allocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Per Startup Allocation ($)*
                </label>
                <input
                  type="number"
                  id="per_startup_allocation"
                  name="per_startup_allocation"
                  value={formData.per_startup_allocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Startup Stage */}
              <div>
                <label htmlFor="startup_stage" className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Stage*
                </label>
                <select
                  id="startup_stage"
                  name="startup_stage"
                  value={formData.startup_stage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select stage</option>
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B+">Series B+</option>
                </select>
              </div>

              {/* Sectors */}
              <div className="md:col-span-2">
                <label htmlFor="sectors" className="block text-sm font-medium text-gray-700 mb-2">
                  Sectors (comma separated)*
                </label>
                <input
                  type="text"
                  id="sectors"
                  name="sectors"
                  value={formData.sectors}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Fintech, SaaS, Healthtech"
                />
              </div>

              {/* Regions */}
              <div className="md:col-span-2">
                <label htmlFor="regions" className="block text-sm font-medium text-gray-700 mb-2">
                  Regions (comma separated)*
                </label>
                <input
                  type="text"
                  id="regions"
                  name="regions"
                  value={formData.regions}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Latin America, Global, Europe"
                />
              </div>

              {/* Required Documents */}
              <div className="md:col-span-2">
                <label htmlFor="required_docs" className="block text-sm font-medium text-gray-700 mb-2">
                  Required Documents (comma separated)
                </label>
                <input
                  type="text"
                  id="required_docs"
                  name="required_docs"
                  value={formData.required_docs}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Pitch Deck, Financial Projections"
                />
              </div>

              {/* Milestone Requirements */}
              <div className="md:col-span-2">
                <label htmlFor="milestone_requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Requirements
                </label>
                <textarea
                  id="milestone_requirements"
                  name="milestone_requirements"
                  value={formData.milestone_requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Offer Brief File */}
              <div className="md:col-span-2">
                <label htmlFor="offer_brief_file" className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Brief File (PDF, max 2MB)
                </label>
                
                <div className="mt-1 flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Choose File
                      <input
                        id="offer_brief_file"
                        name="offer_brief_file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="sr-only"
                      />
                    </label>
                    
                    {(fileInfo.name || formData.offer_brief_file) && (
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove File
                      </button>
                    )}
                  </div>

                  {fileInfo.name && (
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{fileInfo.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(fileInfo.size)}</p>
                          {fileInfo.preview && (
                            <a 
                              href={fileInfo.preview} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:underline"
                            >
                              Preview
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">PDF files only, maximum size 2MB</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CapitalEditModal;