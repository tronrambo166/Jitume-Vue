import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import UpcomingMeetingsList from "./UpcomingMeetingsList";
import MeetingDetailsModal from "./MeetingDetailsModal";

const CalendarView = ({ meetings = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    const handleMeetingClick = (meeting) => {
        setSelectedMeeting(meeting);
    };

    const closeMeetingDetails = () => {
        setSelectedMeeting(null);
    };

    return (
        <div className="w-full">
            <CalendarHeader
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />

            <CalendarGrid
                currentDate={currentDate}
                meetings={meetings}
                onMeetingClick={handleMeetingClick}
            />

            <UpcomingMeetingsList
                meetings={meetings}
                onMeetingClick={handleMeetingClick}
            />

            {selectedMeeting && (
                <MeetingDetailsModal
                    meeting={selectedMeeting}
                    onClose={closeMeetingDetails}
                />
            )}
        </div>
    );
};

export default CalendarView;
