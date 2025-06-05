import React from "react";
import { AlertTriangle, Check, Zap, Globe, Calendar, X } from "lucide-react";

export default function ScoreCapitalMobile({
    open,
    onClose,
    isUploading,
    uploadProgress,
    matchScore,
    scoreBreakdown,
    getMatchColor,
    getMatchIcon,
    getMatchLevel,
    getMatchLevelColor,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm lg:hidden p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 border border-emerald-100 relative">
                <button
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="h-6 w-6 bg-emerald-500 rounded-full animate-pulse"></div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-yellow-600">
                            Match Score Analysis
                        </h3>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-medium px-3 py-2 bg-emerald-100 text-emerald-600 rounded-full">
                            Powered by Tujitume AI
                        </span>
                    </div>
                </div>

                {isUploading ? (
                    <div className="flex flex-col items-center py-8">
                        <div className="relative mb-8 w-40 h-40">
                            <div className="absolute inset-0 rounded-full border-6 border-emerald-100 bg-white bg-opacity-30 backdrop-blur-sm overflow-hidden">
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-yellow-400 transition-all duration-1000 ease-in-out"
                                    style={{
                                        height: `${Math.round(
                                            uploadProgress
                                        )}%`,
                                        boxShadow:
                                            "0 -5px 15px rgba(99, 102, 241, 0.5)",
                                        borderTopLeftRadius:
                                            uploadProgress < 95 ? "100%" : "0",
                                        borderTopRightRadius:
                                            uploadProgress < 95 ? "100%" : "0",
                                    }}
                                ></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-yellow-600">
                                        {Math.round(uploadProgress)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center space-y-3 px-4">
                            <p className="text-base font-bold text-emerald-700">
                                {uploadProgress < 30
                                    ? "Initializing Quantum Analysis..."
                                    : uploadProgress < 60
                                    ? "Processing Smart Data Points..."
                                    : uploadProgress < 90
                                    ? "Calculating Match Parameters..."
                                    : "Finalizing Tujitume Analysis..."}
                            </p>
                            <p className="text-sm text-emerald-500 flex items-center justify-center gap-2">
                                <span className="flex space-x-1">
                                    <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                                    <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                                    <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                                </span>
                                Jitume data verification in progress
                            </p>
                        </div>
                    </div>
                ) : matchScore !== null ? (
                    <div className="flex flex-col items-center">
                        <div className="relative mb-8">
                            <div className="w-40 h-40 rounded-3xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-yellow-50 border-2 border-emerald-100">
                                <div
                                    className={`w-32 h-32 rounded-2xl ${getMatchColor(
                                        matchScore
                                    )} flex items-center justify-center text-white text-4xl font-bold backdrop-blur-sm bg-opacity-90 shadow-lg`}
                                >
                                    {matchScore}%
                                </div>
                            </div>
                            <div
                                className={`absolute -right-3 -top-3 rounded-full p-3 ${getMatchColor(
                                    matchScore
                                )} text-white shadow-lg`}
                            >
                                {getMatchIcon(matchScore)}
                            </div>
                        </div>

                        <div
                            className={`text-center mb-8 py-3 px-8 rounded-2xl backdrop-blur-sm ${getMatchLevelColor(
                                matchScore
                            )} shadow-sm border border-emerald-100`}
                        >
                            <span className="font-bold text-base">
                                {getMatchLevel(matchScore)}
                            </span>
                        </div>

                        <div className="w-full space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm backdrop-blur-sm">
                                <h4 className="text-base font-bold text-emerald-700 mb-4 flex items-center">
                                    <span className="w-1.5 h-5 bg-emerald-500 rounded-sm mr-3"></span>
                                    Smart Score Breakdown
                                </h4>
                                <div className="space-y-4">
                                    {scoreBreakdown &&
                                        Object.entries(scoreBreakdown).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex justify-between items-center"
                                                >
                                                    <span className="text-gray-600 capitalize font-medium text-sm">
                                                        {key}
                                                    </span>
                                                    <div className="flex items-center">
                                                        <div className="h-3 w-20 bg-emerald-100 rounded-full mr-3">
                                                            <div
                                                                className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                                                                style={{
                                                                    width: `${value}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="font-bold text-emerald-700 text-sm min-w-[3rem] text-right">
                                                            {value}%
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-emerald-100 rounded-2xl rotate-6"></div>
                            <div className="absolute inset-0 bg-emerald-200 rounded-2xl -rotate-3"></div>
                            <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center border border-emerald-100">
                                <AlertTriangle className="w-10 h-10 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-emerald-600 font-medium bg-emerald-50 py-3 px-6 rounded-xl inline-block text-base">
                            Complete fields for Tujitume analysis
                        </p>
                    </div>
                )}

                {/* Bottom safe area for mobile */}
                <div className="h-4"></div>
            </div>
        </div>
    );
}
