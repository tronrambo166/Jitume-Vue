import React from "react";

const MeetingsTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex border-b mb-6">
            <button
                className={`py-2 px-4 font-medium ${
                    activeTab === "schedule"
                        ? "text-emerald-600 border-b-2 border-emerald-600"
                        : "text-gray-500"
                }`}
                onClick={() => setActiveTab("schedule")}
            >
                Schedule Meeting
            </button>
            <button
                className={`py-2 px-4 font-medium ${
                    activeTab === "upcoming"
                        ? "text-emerald-600 border-b-2 border-emerald-600"
                        : "text-gray-500"
                }`}
                onClick={() => setActiveTab("upcoming")}
            >
                Upcoming Meetings
            </button>
        </div>
    );
};

export default MeetingsTabs;
