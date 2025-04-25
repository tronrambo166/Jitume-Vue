import React, { useEffect, useState } from 'react';
import { useStateContext } from "../../../contexts/contextProvider";
import { useNavigate } from "react-router-dom";
import { Award, DollarSign, Clock, TrendingUp, Briefcase, Rocket } from "lucide-react";
import axiosClient from "../../../axiosClient";

const DashboardHome = () => {
    const { token, user } = useStateContext();
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    // State for grants and capital opportunities
    const [grants, setGrants] = useState([]);
    const [capitalOpportunities, setCapitalOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState({
        grants: false,
        capital: false
    });
    const [error, setError] = useState({
        grants: null,
        capital: null
    });

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            fetchGrants();
            fetchCapitalOffers();
        }
    }, [token, navigate]);

    const fetchGrants = async () => {
        setIsLoading(prev => ({...prev, grants: true}));
        setError(prev => ({...prev, grants: null}));

        try {
            const response = await axiosClient.get("/grant/grants");
            const rawData = Array.isArray(response.data?.grants) 
                ? response.data.grants 
                : [];

            const cleanedData = rawData.map(grant => ({
                ...grant,
                title: grant.grant_title || "Untitled Grant",
                amount: grant.funding_per_business ? 
                    parseInt(grant.funding_per_business.replace(/,/g, '')) : 
                    grant.total_grant_amount ? 
                    parseInt(grant.total_grant_amount.replace(/,/g, '')) : 
                    0,
                deadline: grant.application_deadline || "No deadline",
                status: grant.application_deadline && new Date(grant.application_deadline) > new Date() ? 
                    "Open" : "Closed",
                type: "grant",
                focus: grant.grant_focus || "General"
            }));

            setGrants(cleanedData);
            addToast("Grants data loaded successfully", "success");
        } catch (err) {
            console.error("Failed to fetch grants:", err);
            setError(prev => ({
                ...prev, 
                grants: err.response?.data?.message || "Failed to load grants"
            }));
            addToast("Failed to load grants", "error");
        } finally {
            setIsLoading(prev => ({...prev, grants: false}));
        }
    };

    const fetchCapitalOffers = async () => {
        setIsLoading(prev => ({...prev, capital: true}));
        setError(prev => ({...prev, capital: null}));

        try {
            const response = await axiosClient.get("capital/capital-offers");
            const data = response.data?.capital || response.data || [];

            const cleanedData = data.map(opportunity => ({
                ...opportunity,
                title: opportunity.title || opportunity.name || "Untitled Opportunity",
                amount: opportunity.amount || opportunity.funding_amount || 0,
                deadline: opportunity.deadline || opportunity.application_deadline || "No deadline",
                status: opportunity.status || (opportunity.deadline && new Date(opportunity.deadline) > new Date() ? 
                    "Open" : "Closed"),
                type: "capital",
                focus: opportunity.focus_area || "General"
            }));

            setCapitalOpportunities(cleanedData);
            addToast("Investment opportunities loaded", "success");
        } catch (err) {
            console.error("Failed to fetch capital offers:", err);
            setError(prev => ({
                ...prev, 
                capital: err.response?.data?.message || "Failed to load investments"
            }));
            addToast("Failed to load investment opportunities", "error");
        } finally {
            setIsLoading(prev => ({...prev, capital: false}));
        }
    };

    const statsCards = [
        {
            icon: <Award className="text-purple-500" />,
            title: "Total Grants Applied",
            value: "12",
            color: "bg-purple-50",
        },
        {
            icon: <DollarSign className="text-blue-500" />,
            title: "Total Funding Received",
            value: "$225,000",
            color: "bg-blue-50",
        },
        {
            icon: <TrendingUp className="text-indigo-500" />,
            title: "Success Rate",
            value: "75%",
            color: "bg-indigo-50",
        },
    ];

    const OpportunityCard = ({ title, amount, deadline, status, type }) => (
        <div
            className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => addToast(`Clicked on ${title} ${type}`, "info")}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    {type === "grant" ? (
                        <Award className="mr-2 text-purple-500" size={16} />
                    ) : (
                        <Briefcase className="mr-2 text-blue-500" size={16} />
                    )}
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs ${
                        status === "Open"
                            ? "bg-blue-100 text-blue-700"
                            : status === "Closed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {status}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center">
                    <DollarSign className="mr-2 text-green-500" size={16} />
                    <span className="text-sm text-gray-600">
                        ${typeof amount === 'number' ? amount.toLocaleString() : amount}
                    </span>
                </div>
                <div className="flex items-center">
                    <Clock className="mr-2 text-indigo-500" size={16} />
                    <span className="text-sm text-gray-600">{deadline}</span>
                </div>
            </div>
            <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                    type === "grant" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-blue-100 text-blue-700"
                }`}>
                    {type === "grant" ? "Grant" : "Investment"}
                </span>
            </div>
        </div>
    );

    // Combine and sort opportunities (most recent first)
    const recentOpportunities = [...grants.slice(0, 3), ...capitalOpportunities.slice(0, 3)]
        .sort((a, b) => new Date(b.created_at || b.deadline) - new Date(a.created_at || a.deadline));

    return (
        <div className="p-6">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {statsCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.color} rounded-lg p-4 flex items-center space-x-4`}
                        onClick={() => addToast(`Viewing ${card.title}`, "info")}
                    >
                        <div className="p-3 rounded-full bg-white">
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Opportunities */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Rocket className="mr-2 text-indigo-500" />
                    Recent Opportunities
                </h2>
                
                {isLoading.grants || isLoading.capital ? (
                    <div className="text-center py-4">Loading opportunities...</div>
                ) : error.grants || error.capital ? (
                    <div className="text-red-500 p-4">
                        {error.grants && <p>Grants error: {error.grants}</p>}
                        {error.capital && <p>Investments error: {error.capital}</p>}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentOpportunities.map((opp, index) => (
                            <OpportunityCard
                                key={`${opp.type}-${opp.id || index}`}
                                title={opp.title}
                                amount={opp.amount}
                                deadline={opp.deadline}
                                status={opp.status}
                                type={opp.type}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Grants Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <Award className="mr-2 text-purple-500" />
                        Grant Opportunities
                    </h2>
                    {grants.length > 3 && (
                        <button 
                            className="text-sm text-purple-600 hover:underline"
                            onClick={() => addToast("Viewing all grants", "info")}
                        >
                            View All
                        </button>
                    )}
                </div>
                
                {isLoading.grants ? (
                    <div className="text-center py-4">Loading grants...</div>
                ) : error.grants ? (
                    <div className="text-red-500 p-4">{error.grants}</div>
                ) : grants.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        {grants.slice(0, 3).map((grant) => (
                            <OpportunityCard
                                key={`grant-${grant.id}`}
                                title={grant.title}
                                amount={grant.amount}
                                deadline={grant.deadline}
                                status={grant.status}
                                type="grant"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-purple-50 rounded-lg p-8 text-center">
                        <h3 className="text-lg font-medium text-purple-800">No grants available</h3>
                        <p className="text-purple-600 mt-2">Check back later for funding opportunities</p>
                    </div>
                )}
            </div>

            {/* Capital Opportunities Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <Briefcase className="mr-2 text-blue-500" />
                        Investment Opportunities
                    </h2>
                    {capitalOpportunities.length > 3 && (
                        <button 
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => addToast("Viewing all investments", "info")}
                        >
                            View All
                        </button>
                    )}
                </div>
                
                {isLoading.capital ? (
                    <div className="text-center py-4">Loading investments...</div>
                ) : error.capital ? (
                    <div className="text-red-500 p-4">{error.capital}</div>
                ) : capitalOpportunities.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        {capitalOpportunities.slice(0, 3).map((opp) => (
                            <OpportunityCard
                                key={`capital-${opp.id}`}
                                title={opp.title}
                                amount={opp.amount}
                                deadline={opp.deadline}
                                status={opp.status}
                                type="capital"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-blue-50 rounded-lg p-8 text-center">
                        <h3 className="text-lg font-medium text-blue-800">No investments available</h3>
                        <p className="text-blue-600 mt-2">Explore funding opportunities</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;