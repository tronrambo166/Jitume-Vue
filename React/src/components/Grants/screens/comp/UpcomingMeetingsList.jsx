import React from "react";
import MeetingListItem from "./MeetingListItem";

const UpcomingMeetingsList = ({ meetings, onMeetingClick }) => {
    const sortedMeetings = [...meetings].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Upcoming Meetings</h3>
            <div className="space-y-2">
                {sortedMeetings.length > 0 ? (
                    sortedMeetings.map((meeting, idx) => (
                        <MeetingListItem
                            key={idx}
                            meeting={meeting}
                            onClick={() => onMeetingClick(meeting)}
                        />
                    ))
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        No upcoming meetings
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpcomingMeetingsList;