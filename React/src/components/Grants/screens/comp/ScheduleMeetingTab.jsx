import React from "react";

const ScheduleMeetingTab = ({ engagements, onProfileSelect }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Select Profile</h3>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profiles
                </label>
                <select
                    className="border border-gray-300 rounded-md p-2 w-full"
                    onChange={(e) =>
                        onProfileSelect(
                            engagements.find(
                                (p) => p.id === parseInt(e.target.value)
                            )
                        )
                    }
                >
                    <option value="">Select a person</option>
                    {engagements.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                            {profile.name} - {profile.company} ({profile.role})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ScheduleMeetingTab;
