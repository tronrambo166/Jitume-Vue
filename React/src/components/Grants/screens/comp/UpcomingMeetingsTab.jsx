import React from "react";
import MeetingCard from "./MeetingCard";

const UpcomingMeetingsTab = ({ meetings }) => {
    return (
        <div>
            <div className="space-y-4">
                {meetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                ))}

                {meetings.length === 0 && (
                    <div className="text-center py-6">
                        <p className="text-gray-500">No upcoming meetings</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpcomingMeetingsTab;
