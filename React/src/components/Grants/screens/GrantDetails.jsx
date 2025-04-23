import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, FileText, DollarSign, Award, ChevronLeft, Clock, CheckCircle, Target, Star } from 'lucide-react';
import axiosClient from "../../../axiosClient";
import { useStateContext } from "../../../contexts/contextProvider";

export default function GrantDetailsDashboard() {
  const { id } = useParams(); // Get the grant ID from the URL
  const [grant, setGrant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token, setUser, setToken } = useStateContext();

  useEffect(() => {
    const fetchGrantDetails = async () => {
      setLoading(true);
      setError(null);
  
      try {
        // Fetching all grants
        const response = await axiosClient.get("/grant/grants");
  
        // Log the entire response to inspect the structure
        console.log("API Response:", response);
  
        // Check if response data contains grants
        const rawData = Array.isArray(response.data?.grants) ? response.data.grants : [];
  
        // Clean and transform the data
        const cleanedData = rawData.map((grant) => ({
          ...grant,
          title: grant.grant_title || "",
          organization: grant.organization || "",
          impact: grant.impact || "",
          status: grant.status || "",
          techLevel: grant.techLevel || "",
          regions: grant.regions || [],
          sectors: grant.sectors || [],
          keyFocus: grant.keyFocus || [],
          documentsRequired: grant.documentsRequired || [],
          totalFund: grant.totalFund === "N/A" ? "N/A" : Number(grant.totalFund).toLocaleString(),
          maxGrantPerStartup: grant.maxGrantPerStartup === "N/A" ? "N/A" : Number(grant.maxGrantPerStartup).toLocaleString(),
          funding_per_business: grant.funding_per_business ? Number(grant.funding_per_business).toLocaleString() : "N/A",
          total_grant_amount: grant.total_grant_amount ? Number(grant.total_grant_amount).toLocaleString() : "N/A",
          application_deadline: grant.application_deadline || "No deadline",
          created_at: grant.created_at || "",
          grant_focus: grant.grant_focus || "",
          startup_stage_focus: grant.startup_stage_focus || "",
          eligibility_criteria: grant.eligibility_criteria || "",
          evaluation_criteria: grant.evaluation_criteria || "",
          impact_objectives: grant.impact_objectives || "",
          required_documents: grant.required_documents || "",
          grant_brief_pdf: grant.grant_brief_pdf || "",
        }));
  
        // Log the `id` and `cleanedData` to ensure they match
        console.log("Selected Grant ID:", id);
        console.log("All Grants Data:", cleanedData);
  
        // Find the specific grant by ID (convert both to string for comparison)
        const selectedGrant = cleanedData.find(grant => String(grant.id) === String(id));
  
        // If no grant found, throw error
        if (!selectedGrant) {
          throw new Error(`Grant with ID "${id}" not found`);
        }
  
        // Set the selected grant data
        setGrant(selectedGrant);
        console.log("Selected Grant:", selectedGrant);
  
      } catch (err) {
        console.error("Failed to fetch grant details:", err);
  
        // Set error message based on error response
        const errorMessage =
          err.response?.status === 401
            ? "Session expired. Please login again."
            : err.message || "Failed to load grant details. Please try again later.";
  
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    // Ensure `id` is available before making the API call
    if (id) fetchGrantDetails();
  
  }, [id]); // Re-fetch if `id` changes
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    const numAmount = parseFloat(amount.toString().replace(/,/g, ''));
    return isNaN(numAmount) 
      ? `$${amount}` 
      : numAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-200 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading grant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center space-y-2 text-red-500">
          <p>{error}</p>
          <button className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No grant details found for ID: {id}</p>
      </div>
    );
  }

  const daysRemaining = () => {
    const deadline = new Date(grant.application_deadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const deadlineStatus = () => {
    const days = daysRemaining();
    if (days === 0) return { text: "Deadline today", color: "text-yellow-500" };
    if (days < 0) return { text: "Deadline passed", color: "text-red-500" };
    if (days <= 7) return { text: `${days} days left`, color: "text-yellow-500" };
    return { text: `${days} days left`, color: "text-green-500" };
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-500 p-6">
      <button
  onClick={() => window.history.back()}
  className="absolute top-4 left-4 flex items-center text-white hover:bg-white/10 p-2 rounded-full transition"
>
  <ChevronLeft className="w-5 h-5" />
  <span className="ml-1 text-sm">Back</span>
</button>
        
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-white">{grant.grant_title || grant.title}</h1>
          <div className="flex items-center mt-2 text-white/90">
            <Award className="w-4 h-4 mr-1" />
            <span className="text-sm">{grant.organization || "Grant Provider"}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
            <DollarSign className="w-4 h-4 text-white" />
            <span className="ml-1 text-sm text-white">{formatCurrency(grant.total_grant_amount)}</span>
          </div>
          
          <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
            <Clock className="w-4 h-4 text-white" />
            <span className="ml-1 text-sm text-white">{formatDate(grant.application_deadline)}</span>
          </div>
          
          <div className={`flex items-center bg-white/20 rounded-full px-3 py-1 ${deadlineStatus().color}`}>
            <span className="text-sm text-white">{deadlineStatus().text}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6">
        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">FUNDING DETAILS</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="text-xs text-gray-500">Total Fund</div>
                <div className="text-lg font-semibold text-green-600">{formatCurrency(grant.total_grant_amount)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Max Per Startup</div>
                <div className="text-lg font-semibold text-green-600">{formatCurrency(grant.funding_per_business)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">APPLICATION TIMELINE</h3>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-xs text-gray-500">Deadline</div>
                <div className="text-base font-medium">{formatDate(grant.application_deadline)}</div>
              </div>
              <div className={`ml-auto text-sm font-medium ${deadlineStatus().color}`}>
                {deadlineStatus().text}
              </div>
            </div>
          </div>
        </div>
        
        {/* Grant Focus */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">GRANT FOCUS</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{grant.grant_focus}</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{grant.startup_stage_focus}</span>
            {grant.sectors && grant.sectors.map((sector, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{sector}</span>
            ))}
            {grant.keyFocus && grant.keyFocus.map((focus, index) => (
              <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">{focus}</span>
            ))}
          </div>
        </div>
        
        {/* Criteria & Requirements */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">ELIGIBILITY & REQUIREMENTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</h4>
              <p className="text-sm text-gray-600">{grant.eligibility_criteria || "Not specified"}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required Documents</h4>
              {grant.documentsRequired && grant.documentsRequired.length > 0 ? (
                <ul className="text-sm text-gray-600">
                  {grant.documentsRequired.map((doc, index) => (
                    <li key={index} className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-green-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">{grant.required_documents || "None specified"}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Impact & Evaluation */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">IMPACT & EVALUATION</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Impact Objectives</h4>
              <p className="text-sm text-gray-600">{grant.impact_objectives || grant.impact || "Not specified"}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluation Criteria</h4>
              <p className="text-sm text-gray-600">{grant.evaluation_criteria || "Not specified"}</p>
            </div>
          </div>
        </div>
        
        {/* Documentation */}
        {grant.grant_brief_pdf && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">DOCUMENTATION</h3>
            <a href={grant.grant_brief_pdf} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
              <FileText className="w-5 h-5" />
              <span>Download Grant Brief PDF</span>
            </a>
          </div>
        )}
        
        {/* Action Button */}
        {!user.investor && (

        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2">
            <span>Apply for Grant</span>
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>
)}
      </div>
    </div>
  );
}