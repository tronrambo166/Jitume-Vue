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
  Code
} from 'lucide-react';

const PitchesOutlet = ({ grantId }) => {
  const [pitches, setPitches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [htmlResponse, setHtmlResponse] = useState(null);
  const [openPitchId, setOpenPitchId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    fetchPitches();
  }, [grantId, retryCount]);

  const fetchPitches = async () => {
    console.log(`[PitchesOutlet] Fetching pitches for grant ID: ${grantId}`);
    try {
      setIsLoading(true);
      setError(null);
      setHtmlResponse(null);
      
      const response = await fetch(`/grant/pitches/${grantId}`);
      console.log(`[PitchesOutlet] API response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`API returned error status: ${response.status}`);
      }
      
      const rawData = await response.text();
      console.log(`[PitchesOutlet] Raw data length: ${rawData.length}`);
      
      // Check if the response appears to be HTML instead of JSON
      if (rawData.trim().toLowerCase().startsWith('<!doctype html>') || 
          rawData.trim().toLowerCase().startsWith('<html')) {
        console.error("[PitchesOutlet] Server returned HTML instead of JSON");
        
        // Store HTML response for debugging
        setHtmlResponse(rawData.substring(0, 500)); // Store first 500 chars for debugging
        
        throw new Error("Server returned an HTML page instead of JSON data. The server might be experiencing issues.");
      }
  
      // Skip if empty response
      if (!rawData.trim()) {
        console.warn("[PitchesOutlet] Empty response from server");
        throw new Error("Empty response from server");
      }
  
      // Check if JSON is valid
      let data;
      try {
        data = JSON.parse(rawData);
        console.log(`[PitchesOutlet] Successfully parsed JSON with ${Array.isArray(data) ? data.length : 'object'}`);
      } catch (e) {
        console.error("[PitchesOutlet] Failed to parse JSON response:", e);
        // Store non-JSON response for debugging
        setHtmlResponse(rawData.substring(0, 500));
        throw new Error("API returned invalid JSON. Check debug info for details.");
      }
  
      setPitches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[PitchesOutlet] Error fetching pitches:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const retryFetch = () => {
    console.log("[PitchesOutlet] Retrying fetch...");
    setRetryCount(prevCount => prevCount + 1);
  };

  const togglePitch = (id) => {
    console.log(`[PitchesOutlet] Toggling pitch ID: ${id}`);
    setOpenPitchId(openPitchId === id ? null : id);
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-50 rounded w-3/4"></div>
          <div className="h-4 bg-gray-50 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center flex-col p-6">
          <AlertCircle size={32} className="text-red-500 mb-4" />
          <p className="text-gray-800 font-medium text-center mb-2">{error}</p>
          
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
            <h2 className="text-xl font-bold text-gray-900 mb-1">Available Pitches</h2>
            <p className="text-gray-500 text-sm">Browse through pitches submitted for this grant opportunity</p>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium text-green-700">
            {pitches.length} {pitches.length === 1 ? 'Pitch' : 'Pitches'}
          </div>
        </div>
        
        {pitches.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-600">No pitches have been submitted yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pitches.map((pitch) => (
              <div 
                key={pitch.id} 
                className="border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div 
                  onClick={() => togglePitch(pitch.id)}
                  className="w-full p-5 text-left cursor-pointer group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{pitch.title || "Untitled Pitch"}</h3>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Briefcase size={14} className="mr-1.5 text-gray-400" />
                          {pitch.company || "No company"}
                        </span>
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1.5 text-gray-400" />
                          {pitch.location || "Location not specified"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {pitch.funding_amount && (
                        <div className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-700 hidden md:block">
                          ${pitch.funding_amount.toLocaleString()}
                        </div>
                      )}
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-green-50 transition-colors">
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 group-hover:text-green-500 transition-transform duration-200 ${
                            openPitchId === pitch.id ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {openPitchId === pitch.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Pitch Overview */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                          <div className="w-1 h-4 bg-green-400 rounded-full mr-2"></div>
                          Overview
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {pitch.description || "No description provided"}
                        </p>
                      </div>
                      
                      {/* Funding Details */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                          <div className="w-1 h-4 bg-black rounded-full mr-2"></div>
                          Funding Request
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                            <div className="p-1.5 bg-green-50 rounded-lg">
                              <DollarSign className="text-green-600" size={16} />
                            </div>
                            <div>
                              <span className="text-xs block text-gray-500">Amount Requested:</span>
                              <span className="font-medium text-gray-900">
                                ${pitch.funding_amount ? pitch.funding_amount.toLocaleString() : "Not specified"}
                              </span>
                            </div>
                          </div>
                          {pitch.equity_offered && (
                            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                              <div className="p-1.5 bg-gray-50 rounded-lg">
                                <Briefcase className="text-gray-600" size={16} />
                              </div>
                              <div>
                                <span className="text-xs block text-gray-500">Equity Offered:</span>
                                <span className="font-medium text-gray-900">{pitch.equity_offered}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                          <div className="w-1 h-4 bg-gray-400 rounded-full mr-2"></div>
                          Contact
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                            <div className="p-1.5 bg-gray-50 rounded-lg">
                              <Mail className="text-gray-600" size={16} />
                            </div>
                            <div>
                              <span className="text-xs block text-gray-500">Email:</span>
                              <span className="font-medium text-gray-900 text-sm">{pitch.contact_email || "Not provided"}</span>
                            </div>
                          </div>
                          {pitch.contact_phone && (
                            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                              <div className="p-1.5 bg-gray-50 rounded-lg">
                                <Phone className="text-gray-600" size={16} />
                              </div>
                              <div>
                                <span className="text-xs block text-gray-500">Phone:</span>
                                <span className="font-medium text-gray-900 text-sm">{pitch.contact_phone}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Pitch Documents */}
                    {pitch.documents && pitch.documents.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-800 mb-3">Supporting Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {pitch.documents.map((doc, index) => (
                            <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-green-50 transition-colors">
                                <FileText size={16} className="text-gray-500 group-hover:text-green-500 transition-colors" />
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.type}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button 
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={16} className="inline-block mr-1.5" />
                        Express Interest
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchesOutlet;