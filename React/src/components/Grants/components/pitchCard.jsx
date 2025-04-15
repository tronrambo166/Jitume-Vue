import React, { useState } from "react";
import { TrendingUp, Check, X, ChevronDown, ChevronUp, Calendar, MapPin, Mail, DollarSign, Users, Target, Award } from "lucide-react";

const PitchCard = ({ pitch }) => {
  const [expanded, setExpanded] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  
  // Format numbers with appropriate suffix
  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };
  
  // Calculate metrics
  const revenue = Number(pitch.revenue_last_12_months);
  const irrValue = Number(pitch.irr_projection);
  
  // Define action messages
  const actionMessages = {
    accept: "Accept this pitch to begin the investment process. This will notify the startup and schedule an initial meeting.",
    decline: "Decline this pitch. The startup will be notified that their pitch was not selected for further consideration."
  };

  const handleAccept = () => {
    setShowAcceptModal(true);
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const confirmAccept = () => {
    // Add your accept logic here
    setShowAcceptModal(false);
  };

  const confirmDecline = () => {
    // Add your decline logic here
    setShowDeclineModal(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg">
      {/* Header section */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-gray-900">{pitch.startup_name}</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">{pitch.sector}</p>
          </div>
          
          <div className="flex flex-col gap-2 items-end text-xs text-gray-500">
            <div className="flex">
              <Calendar size={14} className="mr-1" />
              {new Date(pitch.created_at).toLocaleDateString()}
            </div>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
              {pitch.stage}
            </span>
          </div>
        </div>
        
        {/* Key metrics row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">REVENUE (12MO)</p>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                ${formatNumber(revenue)}
              </span>
              {revenue > 500000 && <TrendingUp size={16} className="ml-2 text-green-500" />}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">BURN RATE</p>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                ${formatNumber(Number(pitch.burn_rate))}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">IRR PROJECTION</p>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">{irrValue}%</span>
              {irrValue > 30 && <TrendingUp size={16} className="ml-2 text-green-500" />}
            </div>
          </div>
        </div>
        
        {/* Contact info */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Mail size={14} className="mr-2 text-gray-400" />
            {pitch.contact_person_email}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-2 text-gray-400" />
            {pitch.headquarters_location}
          </div>
        </div>
        <div className="flex space-x-3 my-2">
          {/* Decline button */}
          <button 
            onClick={handleDecline}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center font-medium text-sm transition-colors duration-200"
          >
            <X size={16} className="mr-2 text-gray-500" />
            Decline
          </button>
          
          {/* Accept button */}
          <button 
            onClick={handleAccept}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center font-medium text-sm transition-colors duration-200"
          >
            <Check size={16} className="mr-2" />
            Accept Pitch
          </button>
        </div>
      </div>
      
      {/* Expandable details section */}
      <div className={`bg-gray-50 px-6 ${expanded ? 'py-6' : 'py-0'} transition-all duration-300 overflow-hidden`} 
           style={{ maxHeight: expanded ? '500px' : '0px' }}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">CAC TO LTV RATIO</p>
            <p className="text-sm font-medium">{pitch.cac_ltv}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">TEAM EXPERIENCE</p>
            <div className="flex items-center">
              <Users size={14} className="mr-2 text-gray-400" />
              <p className="text-sm font-medium">{pitch.team_experience_avg_years} years avg.</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">EXIT STRATEGY</p>
            <p className="text-sm">{pitch.exit_strategy || "Not specified"}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">SOCIAL IMPACT AREAS</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {pitch.social_impact_areas.split(',').map((area, index) => (
                <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {area.trim()}
                </span>
              ))}
            </div>
          </div>
          
          {pitch.hasOwnProperty('pitch_summary') && (
            <div className="col-span-2 mt-2">
              <p className="text-xs font-medium text-gray-500 mb-1">PITCH SUMMARY</p>
              <p className="text-sm">{pitch.pitch_summary}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer with action buttons */}
      <div className="border-t border-gray-100 px-6 py-4 flex justify-between items-center">
        <button 
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          onClick={() => setExpanded(!expanded)}
        >
          <span>{expanded ? "Show less" : "Show details"}</span>
          {expanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Acceptance</h3>
            <p className="mb-6">{actionMessages.accept}</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAccept}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Acceptance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Decline</h3>
            <p className="mb-6">{actionMessages.decline}</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDecline}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchCard;