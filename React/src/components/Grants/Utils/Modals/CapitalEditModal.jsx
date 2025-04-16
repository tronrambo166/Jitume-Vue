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
    milestone_requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
        milestone_requirements: capitalData.milestone_requirements || ''
      });
    }
  }, [capitalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const apiUrl = `YOUR_API_BASE_URL/capitals/${capitalData.id}`;
      
      const response = await axios.put(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your_token_here' // Uncomment if needed
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit Capital Offer</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Offer Title */}
              <div>
                <label htmlFor="offer_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Title*
                </label>
                <input
                  type="text"
                  id="offer_title"
                  name="offer_title"
                  value={formData.offer_title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Total Capital Available */}
              <div>
                <label htmlFor="total_capital_available" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Capital ($)*
                </label>
                <input
                  type="number"
                  id="total_capital_available"
                  name="total_capital_available"
                  value={formData.total_capital_available}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Per Startup Allocation */}
              <div>
                <label htmlFor="per_startup_allocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Per Startup Allocation ($)
                </label>
                <input
                  type="number"
                  id="per_startup_allocation"
                  name="per_startup_allocation"
                  value={formData.per_startup_allocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Startup Stage */}
              <div>
                <label htmlFor="startup_stage" className="block text-sm font-medium text-gray-700 mb-1">
                  Startup Stage
                </label>
                <select
                  id="startup_stage"
                  name="startup_stage"
                  value={formData.startup_stage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <label htmlFor="sectors" className="block text-sm font-medium text-gray-700 mb-1">
                  Sectors (comma separated)
                </label>
                <input
                  type="text"
                  id="sectors"
                  name="sectors"
                  value={formData.sectors}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Fintech, SaaS, Healthtech"
                />
              </div>

              {/* Regions */}
              <div className="md:col-span-2">
                <label htmlFor="regions" className="block text-sm font-medium text-gray-700 mb-1">
                  Regions (comma separated)
                </label>
                <input
                  type="text"
                  id="regions"
                  name="regions"
                  value={formData.regions}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Latin America, Global, Europe"
                />
              </div>

              {/* Required Documents */}
              <div className="md:col-span-2">
                <label htmlFor="required_docs" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Documents (comma separated)
                </label>
                <input
                  type="text"
                  id="required_docs"
                  name="required_docs"
                  value={formData.required_docs}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Pitch Deck, Financial Projections"
                />
              </div>

              {/* Milestone Requirements */}
              <div className="md:col-span-2">
                <label htmlFor="milestone_requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Milestone Requirements
                </label>
                <textarea
                  id="milestone_requirements"
                  name="milestone_requirements"
                  value={formData.milestone_requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CapitalEditModal;