import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GrantEditModal = ({ grantData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    grant_title: '',
    total_grant_amount: '',
    application_deadline: '',
    eligibility_criteria: '',
    evaluation_criteria: '',
    funding_per_business: '',
    grant_focus: '',
    impact_objectives: '',
    startup_stage_focus: '',
    required_documents: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (grantData) {
      setFormData({
        grant_title: grantData.grant_title || '',
        total_grant_amount: grantData.total_grant_amount || '',
        application_deadline: grantData.application_deadline || '',
        eligibility_criteria: grantData.eligibility_criteria || '',
        evaluation_criteria: grantData.evaluation_criteria || '',
        funding_per_business: grantData.funding_per_business || '',
        grant_focus: grantData.grant_focus || '',
        impact_objectives: grantData.impact_objectives || '',
        startup_stage_focus: grantData.startup_stage_focus || '',
        required_documents: grantData.required_documents || '',
      });
    }
  }, [grantData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("data before api :", formData);
      // Replace with your actual API endpoint
      const apiUrl = 'YOUR_API_BASE_URL_HERE/grants/' + grantData.id;
      
      const response = await axios.put(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
          // 'Authorization': 'Bearer your_token_here'
        }
      });

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update grant');
      console.error('Error updating grant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Grant</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="grant_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Grant Title*
                </label>
                <input
                  type="text"
                  id="grant_title"
                  name="grant_title"
                  value={formData.grant_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="total_grant_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Grant Amount*
                </label>
                <input
                  type="text"
                  id="total_grant_amount"
                  name="total_grant_amount"
                  value={formData.total_grant_amount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline*
                </label>
                <input
                  type="date"
                  id="application_deadline"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="funding_per_business" className="block text-sm font-medium text-gray-700 mb-1">
                  Funding per Business
                </label>
                <input
                  type="text"
                  id="funding_per_business"
                  name="funding_per_business"
                  value={formData.funding_per_business}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="grant_focus" className="block text-sm font-medium text-gray-700 mb-1">
                  Grant Focus
                </label>
                <input
                  type="text"
                  id="grant_focus"
                  name="grant_focus"
                  value={formData.grant_focus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="startup_stage_focus" className="block text-sm font-medium text-gray-700 mb-1">
                  Startup Stage Focus
                </label>
                <select
                  id="startup_stage_focus"
                  name="startup_stage_focus"
                  value={formData.startup_stage_focus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select stage</option>
                  <option value="Seed">Seed</option>
                  <option value="Early">Early</option>
                  <option value="Growth">Growth</option>
                  <option value="Mature">Mature</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="eligibility_criteria" className="block text-sm font-medium text-gray-700 mb-1">
                Eligibility Criteria
              </label>
              <textarea
                id="eligibility_criteria"
                name="eligibility_criteria"
                value={formData.eligibility_criteria}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="evaluation_criteria" className="block text-sm font-medium text-gray-700 mb-1">
                Evaluation Criteria
              </label>
              <textarea
                id="evaluation_criteria"
                name="evaluation_criteria"
                value={formData.evaluation_criteria}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="impact_objectives" className="block text-sm font-medium text-gray-700 mb-1">
                Impact Objectives
              </label>
              <textarea
                id="impact_objectives"
                name="impact_objectives"
                value={formData.impact_objectives}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="required_documents" className="block text-sm font-medium text-gray-700 mb-1">
                Required Documents
              </label>
              <input
                type="text"
                id="required_documents"
                name="required_documents"
                value={formData.required_documents}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrantEditModal;