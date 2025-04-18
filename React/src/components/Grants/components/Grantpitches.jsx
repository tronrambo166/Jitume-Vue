import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Briefcase, 
  MapPin, 
  FileText, 
  DollarSign,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Code,
  Loader,
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import axiosClient from '../../../axiosClient'; // Update with your actual path

const PitchesOutlet = ({ grantId }) => {
  const [pitches, setPitches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [htmlResponse, setHtmlResponse] = useState(null);
  const [openPitchId, setOpenPitchId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedPitch, setSelectedPitch] = useState(null);

  useEffect(() => {
    fetchPitches();
  }, [grantId, retryCount]);

  const fetchPitches = async () => {
    console.log(`[PitchesOutlet] Fetching pitches for grant ID:`, grantId);
    
    try {
      setIsLoading(true);
      setError(null);
      setHtmlResponse(null);
      
      const response = await axiosClient.get(`grant/pitches/${grantId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('[PitchesOutlet] Response data:', response.data);
      
      // Handle empty response
      if (!response.data) {
        throw new Error("Empty response from server");
      }
      
      // Check if response.data has a pitches property, if so use that, otherwise use response.data directly
      const pitchesData = response.data.pitches || response.data;
      setPitches(Array.isArray(pitchesData) ? pitchesData : []);
    } catch (err) {
      console.error("[PitchesOutlet] Error fetching pitches:", err);
      
      if (err.response) {
        // Server responded with error status
        const errorData = err.response.data;
        
        // Check for HTML error response
        if (typeof errorData === 'string' && 
            (errorData.trim().toLowerCase().startsWith('<!doctype html>') || 
             errorData.trim().toLowerCase().startsWith('<html'))) {
          setHtmlResponse(errorData.substring(0, 500));
          setError("Server returned an HTML error page. Please try again later.");
        } else {
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error - could not connect to server");
      } else {
        // Other errors
        setError(err.message || "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryFetch = () => {
    console.log("[PitchesOutlet] Retrying fetch...");
    setRetryCount(prevCount => prevCount + 1);
  };

  const togglePitch = (id) => {
    setOpenPitchId(openPitchId === id ? null : id);
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const handleActionClick = (pitch, action) => {
    setSelectedPitch(pitch);
    setModalAction(action);
    setShowConfirmModal(true);
  };

 const handleConfirmAction = async () => {
     try {
         setIsLoading(true);
         console.groupCollapsed(
             `[Pitch Action] Starting ${modalAction} action for pitch ${selectedPitch.id}`
         );
         console.log("Action:", modalAction);
         console.log("Pitch ID:", selectedPitch.id);
         console.log("Current pitch data:", selectedPitch);

         // Use the correct API endpoint based on the action
         const endpoint =
             modalAction === "accept"
                 ? `grant/accept/${selectedPitch.id}`
                 : `grant/reject/${selectedPitch.id}`;

         console.log("Making GET request to:", endpoint);

         const response = await axiosClient.get(endpoint, {
             headers: {
                 Accept: "application/json",
                 "Content-Type": "application/json",
             },
         });

         console.groupCollapsed("Backend Response");
         console.log("Status:", response.status);
         console.log("Headers:", response.headers);
         console.log("Response Data:", response.data);
         console.groupEnd();

         // Update local state to reflect the change
         setPitches((prevPitches) =>
             prevPitches.map((pitch) =>
                 pitch.id === selectedPitch.id
                     ? {
                           ...pitch,
                           status:
                               modalAction === "accept"
                                   ? "accepted"
                                   : "rejected",
                           // Include any additional data from the backend response
                           ...(response.data.updatedData || {}),
                           updatedAt: new Date().toISOString(), // Add timestamp
                       }
                     : pitch
             )
         );

         setShowConfirmModal(false);
         setSelectedPitch(null);

         if (response.data.message) {
             console.log("Success message:", response.data.message);
             // Uncomment if you have toast notifications
             // toast.success(response.data.message);
         }

         // Refresh data to ensure consistency
         console.log("Refreshing pitches data...");
         await fetchPitches();

         console.groupEnd();
     } catch (err) {
         console.groupCollapsed(
             `[Pitch Action Error] ${modalAction} action failed`
         );
         console.error("Error details:", err);

         if (err.response) {
             console.log("Error response status:", err.response.status);
             console.log("Error response data:", err.response.data);
             console.log("Error response headers:", err.response.headers);
         } else if (err.request) {
             console.log("No response received:", err.request);
         } else {
             console.log("Request setup error:", err.message);
         }

         const errorMessage = err.response?.data?.message
             ? `Failed to ${modalAction} pitch: ${err.response.data.message}`
             : `Failed to ${modalAction} pitch. Please try again.`;

         console.log("User error message:", errorMessage);
         setError(errorMessage);

         // Uncomment if you have toast notifications
         // toast.error(errorMessage);

         console.groupEnd();
     } finally {
         setIsLoading(false);
         console.log("Loading state set to false");
     }
 };
  const handleContinueToPitchDeck = (pitchDeckUrl) => {
    window.open(pitchDeckUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-6">
            <div className="absolute inset-0 border-t-4 border-gray-300 rounded-full animate-pulse opacity-30"></div>
            <div className="absolute inset-0 border-t-4 border-gray-800 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-medium text-gray-900">Loading</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center flex-col p-6">
          <AlertCircle size={32} className="text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Pitches</h3>
          <p className="text-gray-800 text-center mb-2">{error}</p>
          
          {htmlResponse && (
            <div className="w-full mt-4">
              <button 
                onClick={toggleDebugInfo}
                className="text-sm text-gray-500 flex items-center justify-center mx-auto mb-2"
              >
                <Code size={16} className="mr-1" />
                {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
              </button>
              
              {showDebugInfo && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2 overflow-auto max-h-64">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                    {htmlResponse}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          <div className="flex space-x-3 mt-6">
            <button 
              onClick={retryFetch}
              className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                          Available Pitches
                      </h2>
                      <p className="text-gray-500 text-sm">
                          Browse through pitches submitted for this grant
                          opportunity
                      </p>
                  </div>
                  <div className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium text-green-700">
                      {pitches.length}{" "}
                      {pitches.length === 1 ? "Pitch" : "Pitches"}
                  </div>
              </div>

              {pitches.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                      <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <FileText size={24} className="text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                              No Pitches Found
                          </h3>
                          <p className="text-gray-600">
                              No pitches have been submitted for this grant yet.
                          </p>
                      </div>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {pitches.map((pitch) => (
                          <PitchCard
                              key={pitch.id}
                              pitch={pitch}
                              isOpen={openPitchId === pitch.id}
                              onToggle={togglePitch}
                              onAccept={() =>
                                  handleActionClick(pitch, "accept")
                              }
                              onDecline={() =>
                                  handleActionClick(pitch, "decline")
                              }
                              onContinueToPitchDeck={() =>
                                  handleContinueToPitchDeck(
                                      pitch.pitch_deck_file
                                  )
                              }
                          />
                      ))}
                  </div>
              )}
          </div>

          {/* Confirmation Modal */}
          {showConfirmModal && selectedPitch && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                              {modalAction === "accept"
                                  ? "Accept Pitch"
                                  : "Reject Pitch"}
                          </h3>
                          <button
                              onClick={() => setShowConfirmModal(false)}
                              className="p-1 rounded-full hover:bg-gray-100"
                          >
                              <X size={20} className="text-gray-500" />
                          </button>
                      </div>
                      <div className="mb-6">
                          <p className="text-gray-700">
                              Are you sure you want to {modalAction} the pitch
                              from{" "}
                              <strong>
                                  {selectedPitch.startup_name || "this startup"}
                              </strong>
                              ?
                          </p>
                          {modalAction === "decline" && (
                              <p className="mt-2 text-gray-500 text-sm">
                                  This action cannot be undone and will notify
                                  the startup of your decision.
                              </p>
                          )}
                      </div>
                      <div className="flex space-x-3 justify-end">
                          <button
                              onClick={() => setShowConfirmModal(false)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50"
                          >
                              Cancel
                          </button>
                          <button
                              onClick={handleConfirmAction}
                              className={`px-4 py-2 rounded-full text-sm text-white ${
                                  modalAction === "accept"
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-red-600 hover:bg-red-700"
                              }`}
                          >
                              {modalAction === "accept" ? "Accept" : "Reject"}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

// Extracted PitchCard component for better readability
const PitchCard = ({ pitch, isOpen, onToggle, onAccept, onDecline, onContinueToPitchDeck }) => {
  const isPitchStatusDefined = pitch.status === 'accepted' || pitch.status === 'declined';

  return (
      <div
          className={`border rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden ${
              isPitchStatusDefined
                  ? pitch.status === "accepted"
                      ? "border-green-200 bg-green-50/30"
                      : "border-red-200 bg-red-50/30"
                  : "border-gray-100"
          }`}
      >
          <div className="p-5">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  {/* Left side - Pitch info */}
                  <div className="flex-grow">
                      <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">
                              {pitch.startup_name || "Untitled Pitch"}
                          </h3>
                          {pitch.status === 1 && (
                              <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  Accepted
                              </span>
                          )}
                          {pitch.status === 2 && (
                              <span className="ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                  Declined
                              </span>
                          )}
                      </div>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                              <Briefcase
                                  size={14}
                                  className="mr-1.5 text-gray-400"
                              />
                              {pitch.sector || "No sector"}
                          </span>
                          <span className="flex items-center">
                              <MapPin
                                  size={14}
                                  className="mr-1.5 text-gray-400"
                              />
                              {pitch.headquarters_location ||
                                  "Location not specified"}
                          </span>
                          {pitch.revenue_last_12_months && (
                              <span className="flex items-center">
                                  <DollarSign
                                      size={14}
                                      className="mr-1.5 text-gray-400"
                                  />
                                  $
                                  {parseFloat(
                                      pitch.revenue_last_12_months
                                  ).toLocaleString()}
                              </span>
                          )}
                      </div>
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex items-center space-x-2 md:justify-end">
                      {pitch.status === 0 && (
                          <div className="flex space-x-2">
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onDecline();
                                  }}
                                  className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors flex items-center"
                              >
                                  <ThumbsDown size={14} className="mr-1.5" />
                                  Decline
                              </button>
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onAccept();
                                  }}
                                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
                              >
                                  <ThumbsUp size={14} className="mr-1.5" />
                                  Accept
                              </button>
                          </div>
                      )}
                      {pitch.pitch_deck_file && (
                          <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  onContinueToPitchDeck(pitch.pitch_deck_file);
                              }}
                              className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center whitespace-nowrap"
                          >
                              <FileText size={14} className="mr-1.5" />
                              View Pitch Deck
                          </button>
                      )}
                      <button
                          onClick={() => onToggle(pitch.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
                      >
                          <ChevronDown
                              size={18}
                              className={`text-gray-400 hover:text-green-500 transition-transform duration-200 ${
                                  isOpen ? "transform rotate-180" : ""
                              }`}
                          />
                      </button>
                  </div>
              </div>
          </div>

          {isOpen && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                              <div className="w-1 h-4 bg-green-400 rounded-full mr-2"></div>
                              Overview
                          </h4>
                          <p className="text-gray-600 text-sm">
                              <strong>Stage:</strong>{" "}
                              {pitch.stage || "Not specified"}
                              <br />
                              <strong>Social Impact:</strong>{" "}
                              {pitch.social_impact_areas || "Not specified"}
                              <br />
                              <strong>Traction KPIs:</strong>{" "}
                              {pitch.traction_kpis || "Not specified"}
                              <br />
                              <strong>Team Experience:</strong>{" "}
                              {pitch.team_experience_avg_years}{" "}
                              {pitch.team_experience_avg_years === 1
                                  ? "year"
                                  : "years"}{" "}
                              average
                          </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                              <div className="w-1 h-4 bg-black rounded-full mr-2"></div>
                              Financial Information
                          </h4>
                          <div className="space-y-2">
                              <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                  <div className="p-1.5 bg-green-50 rounded-lg">
                                      <DollarSign
                                          className="text-green-600"
                                          size={16}
                                      />
                                  </div>
                                  <div>
                                      <span className="text-xs block text-gray-500">
                                          Revenue (Last 12 Months):
                                      </span>
                                      <span className="font-medium text-gray-900">
                                          $
                                          {pitch.revenue_last_12_months
                                              ? parseFloat(
                                                    pitch.revenue_last_12_months
                                                ).toLocaleString()
                                              : "Not specified"}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                              <div className="w-1 h-4 bg-gray-400 rounded-full mr-2"></div>
                              Contact
                          </h4>
                          <div className="space-y-2">
                              <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                  <div className="p-1.5 bg-gray-50 rounded-lg">
                                      <Mail
                                          className="text-gray-600"
                                          size={16}
                                      />
                                  </div>
                                  <div>
                                      <span className="text-xs block text-gray-500">
                                          Contact Person:
                                      </span>
                                      <span className="font-medium text-gray-900 text-sm">
                                          {pitch.contact_person_name ||
                                              "Not provided"}
                                      </span>
                                  </div>
                              </div>
                              <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                  <div className="p-1.5 bg-gray-50 rounded-lg">
                                      <Mail
                                          className="text-gray-600"
                                          size={16}
                                      />
                                  </div>
                                  <div>
                                      <span className="text-xs block text-gray-500">
                                          Email:
                                      </span>
                                      <span className="font-medium text-gray-900 text-sm">
                                          {pitch.contact_person_email ||
                                              "Not provided"}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {(pitch.pitch_deck_file ||
                      pitch.business_plan_file ||
                      pitch.pitch_video) && (
                      <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-800 mb-3">
                              Supporting Documents
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {pitch.pitch_deck_file && (
                                  <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
                                      <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-green-50 transition-colors">
                                          <FileText
                                              size={16}
                                              className="text-gray-500 group-hover:text-green-500 transition-colors"
                                          />
                                      </div>
                                      <div className="truncate flex-grow">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                              Pitch Deck
                                          </p>
                                          <p className="text-xs text-gray-500">
                                              PDF Document
                                          </p>
                                      </div>
                                      <button
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              onContinueToPitchDeck(
                                                  pitch.pitch_deck_file
                                              );
                                          }}
                                          className="ml-2 text-sm text-green-600 hover:text-green-700 flex items-center"
                                      >
                                          <ExternalLink
                                              size={14}
                                              className="mr-1"
                                          />
                                          View
                                      </button>
                                  </div>
                              )}
                              {pitch.business_plan_file && (
                                  <a
                                      href={pitch.business_plan_file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                                  >
                                      <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-green-50 transition-colors">
                                          <FileText
                                              size={16}
                                              className="text-gray-500 group-hover:text-green-500 transition-colors"
                                          />
                                      </div>
                                      <div className="truncate">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                              Business Plan
                                          </p>
                                          <p className="text-xs text-gray-500">
                                              PDF Document
                                          </p>
                                      </div>
                                  </a>
                              )}
                              {pitch.pitch_video && (
                                  <a
                                      href={pitch.pitch_video}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                                  >
                                      <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-green-50 transition-colors">
                                          <FileText
                                              size={16}
                                              className="text-gray-500 group-hover:text-green-500 transition-colors"
                                          />
                                      </div>
                                      <div className="truncate">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                              Pitch Video
                                          </p>
                                          <p className="text-xs text-gray-500">
                                              Video
                                          </p>
                                      </div>
                                  </a>
                              )}
                          </div>
                      </div>
                  )}
              </div>
          )}
      </div>
  );
};

export default PitchesOutlet;