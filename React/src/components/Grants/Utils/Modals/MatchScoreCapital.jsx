import React, { useEffect, useState } from "react";
import {
    X,
    AlertTriangle,
    TrendingUp,
    CheckCircle,
    XCircle,
    Zap,
    Globe,
    Calendar,
} from "lucide-react";
import axiosClient from "../../../../axiosClient";
import ScoreCapitalMobile from "./ScoreCapitalMobile";

const MatchScoreCapital = ({ capitalId, formData, hasDeliverables }) => {
    const [score, setScore] = useState(null);
    const [result, setResult] = useState("");
    const [breakdown, setBreakdown] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showScoreMobile, setShowScoreMobile] = useState(false);

    // Helper functions for mobile modal
    const getMatchColor = (score) => {
        if (score >= 80)
            return "bg-gradient-to-r from-green-500 to-emerald-600";
        if (score >= 60)
            return "bg-gradient-to-r from-yellow-500 to-orange-500";
        if (score >= 40) return "bg-gradient-to-r from-orange-500 to-red-500";
        return "bg-gradient-to-r from-red-500 to-red-600";
    };

    const getMatchIcon = (score) => {
        if (score >= 80) return <CheckCircle className="w-6 h-6" />;
        if (score >= 60) return <TrendingUp className="w-6 h-6" />;
        return <XCircle className="w-6 h-6" />;
    };

    const getMatchLevel = (score) => {
        if (score >= 80) return "Excellent Match";
        if (score >= 60) return "Good Match";
        if (score >= 40) return "Fair Match";
        return "Needs Revision";
    };

    const getMatchLevelColor = (score) => {
        if (score >= 80) return "bg-green-50 text-green-700";
        if (score >= 60) return "bg-yellow-50 text-yellow-700";
        if (score >= 40) return "bg-orange-50 text-orange-700";
        return "bg-red-50 text-red-700";
    };

    useEffect(() => {
        // Open modal on mobile when upload starts
        if (uploadProgress > 0 && uploadProgress < 100) {
            setShowScoreMobile(true);
        }
    }, [uploadProgress]);

    useEffect(() => {
        if (!capitalId || !hasDeliverables) return;

        setLoading(true);
        setUploadProgress(0);

        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        axiosClient
            .post(`capital/match-score/${capitalId}`, formData)
            .then((res) => {
                const responseData = res.data?.original || res.data;
                setTimeout(() => {
                    setScore(responseData?.score ?? null);
                    setResult(responseData?.result ?? "");
                    setBreakdown(responseData?.score_breakdown ?? {});
                    setUploadProgress(100);
                }, 1000);
            })
            .catch((err) => {
                console.error("[MatchScoreCapital] Error:", err);
                setScore(null);
                setResult("");
                setBreakdown({});
                clearInterval(progressInterval);
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 1500);
            });

        return () => clearInterval(progressInterval);
    }, [capitalId, hasDeliverables, formData]);

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="md:w-80 w-full border-l border-gray-200 hidden lg:block h-full overflow-y-auto">
                <div className="p-6 bg-emerald-50 h-screen flex flex-col items-center">
                    {/* Header Section */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="h-6 w-6 bg-emerald-500 rounded-full animate-pulse"></div>
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-yellow-600">
                                Match Score Analysis
                            </h3>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                            <span className="text-sm font-medium px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full">
                                Powered by Tujitume AI
                            </span>
                        </div>
                    </div>

                    {/* Empty State (matches your image exactly) */}
                    {!loading && score === null && (
                        <div className="text-center p-6">
                            <div className="w-20 h-20 mx-auto mb-4 relative">
                                <div className="absolute inset-0 bg-emerald-100 rounded-xl rotate-6"></div>
                                <div className="absolute inset-0 bg-emerald-200 rounded-xl -rotate-3"></div>
                                <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center border border-emerald-100">
                                    <AlertTriangle className="w-8 h-8 text-emerald-400" />
                                </div>
                            </div>
                            <p className="text-emerald-600 font-medium bg-emerald-50 py-2 px-4 rounded-lg inline-block">
                                Complete fields for Tujitume analysis
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center py-4">
                            <div className="relative mb-4 w-32 h-32">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 bg-white bg-opacity-30 backdrop-blur-sm overflow-hidden">
                                    <div
                                        className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-yellow-400 transition-all duration-1000 ease-in-out"
                                        style={{
                                            height: `${uploadProgress}%`,
                                            boxShadow:
                                                "0 -5px 15px rgba(99, 102, 241, 0.5)",
                                            borderTopLeftRadius:
                                                uploadProgress < 95
                                                    ? "100%"
                                                    : "0",
                                            borderTopRightRadius:
                                                uploadProgress < 95
                                                    ? "100%"
                                                    : "0",
                                        }}
                                    ></div>
                                    <div className="absolute top-0 left-0 w-full h-8 bg-white bg-opacity-20 transform -skew-y-12"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-yellow-600">
                                            {Math.round(uploadProgress)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-emerald-700 text-center">
                                {uploadProgress < 30
                                    ? "Initializing..."
                                    : uploadProgress < 60
                                    ? "Processing..."
                                    : uploadProgress < 90
                                    ? "Calculating..."
                                    : "Finalizing..."}
                            </p>
                        </div>
                    )}

                    {/* Data Loaded State */}
                    {!loading && score !== null && (
                        <div className="w-full">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-yellow-50 border border-emerald-100">
                                    <div
                                        className={`w-24 h-24 rounded-xl ${getMatchColor(
                                            score
                                        )} flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm bg-opacity-90 shadow-lg`}
                                    >
                                        {score}%
                                    </div>
                                </div>
                                <div
                                    className={`absolute -right-1 -top-1 rounded-full p-1.5 ${getMatchColor(
                                        score
                                    )} text-white shadow-lg`}
                                >
                                    {getMatchIcon(score)}
                                </div>
                                <div className="absolute -left-0.5 -bottom-0.5 h-6 w-6 rounded-lg bg-emerald-600 flex items-center justify-center rotate-12 shadow-lg">
                                    <span className="text-white text-xs font-bold">
                                        T
                                    </span>
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <span className="font-semibold text-base text-emerald-700">
                                    {result || getMatchLevel(score)}
                                </span>
                            </div>

                            <div className="w-full space-y-4">
                                {/* Score Breakdown */}
                                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm backdrop-blur-sm">
                                    <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center">
                                        <span className="w-1 h-4 bg-emerald-500 rounded-sm mr-2"></span>
                                        Score Breakdown
                                    </h4>
                                    <div className="space-y-3">
                                        {Object.keys(breakdown).length > 0 ? (
                                            Object.entries(breakdown).map(
                                                ([key, value]) => (
                                                    <div
                                                        className="flex justify-between items-center"
                                                        key={key}
                                                    >
                                                        <span className="text-gray-600 capitalize font-medium text-sm">
                                                            {key.replace(
                                                                /_/g,
                                                                " "
                                                            )}
                                                        </span>
                                                        <div className="flex items-center">
                                                            <div className="h-2 w-16 bg-emerald-100 rounded-full mr-2">
                                                                <div
                                                                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                                                                    style={{
                                                                        width: `${value}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-bold text-emerald-700">
                                                                {value}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-gray-400 text-sm text-center">
                                                No breakdown available yet.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Capital Matches */}
                                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold text-emerald-700 flex items-center">
                                            <span className="w-1 h-4 bg-emerald-500 rounded-sm mr-2"></span>
                                            Capital Matches
                                        </h4>
                                        <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-emerald-100 to-yellow-100 text-emerald-600 rounded-lg font-medium">
                                            Tujitume
                                        </span>
                                    </div>
                                    {score >= 60 ? (
                                        <div className="space-y-3">
                                            <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                                <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                    <Zap className="w-3 h-3 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-700">
                                                        Growth Capital Fund
                                                    </p>
                                                    <p className="text-xs text-emerald-500">
                                                        $500k-2M Series A
                                                    </p>
                                                </div>
                                            </div>
                                            {score >= 80 && (
                                                <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                                    <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                        <Globe className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-emerald-700">
                                                            Impact Ventures
                                                        </p>
                                                        <p className="text-xs text-emerald-500">
                                                            $100k-500k Seed
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-emerald-500 p-2 rounded-lg bg-emerald-50 flex items-center">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                                            Complete more fields for capital
                                            matches
                                        </div>
                                    )}
                                </div>

                                {/* Application Deadlines */}
                                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold text-emerald-700 flex items-center">
                                            <span className="w-1 h-4 bg-emerald-500 rounded-sm mr-2"></span>
                                            Application Deadlines
                                        </h4>
                                        <span className="text-xs font-medium px-2 py-0.5 bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-600 rounded-lg">
                                            2 upcoming
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                            <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                <Calendar className="w-3 h-3 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-emerald-700">
                                                    July 15, 2025
                                                </p>
                                                <p className="text-xs text-emerald-500">
                                                    Tech Innovation Fund
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-100">
                                            <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg p-1.5 mr-3 shadow-sm">
                                                <Calendar className="w-3 h-3 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-emerald-700">
                                                    August 30, 2025
                                                </p>
                                                <p className="text-xs text-emerald-500">
                                                    Venture Capital Round
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ScoreCapitalMobile
                open={showScoreMobile}
                onClose={() => setShowScoreMobile(false)}
                isUploading={loading}
                uploadProgress={uploadProgress}
                matchScore={score}
                scoreBreakdown={breakdown}
                getMatchColor={getMatchColor}
                getMatchIcon={getMatchIcon}
                getMatchLevel={getMatchLevel}
                getMatchLevelColor={getMatchLevelColor}
            />
        </>
    );
};

export default MatchScoreCapital;
