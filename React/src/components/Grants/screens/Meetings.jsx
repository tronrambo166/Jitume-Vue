import React, { useState } from "react";
import MeetingsTabs from "./comp/MeetingsTabs";
import ScheduleMeetingTab from "./comp/ScheduleMeetingTab";
import UpcomingMeetingsTab from "./comp/UpcomingMeetingsTab";
import ProfileModal from "./comp/ProfileModal";
import BookingModal from "./comp/BookingModal";
import { mockEngagements, mockMeetings } from "./comp/meetingsData";

const Meetings = () => {
    const [activeTab, setActiveTab] = useState("schedule");
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [bookingDetails, setBookingDetails] = useState({
        title: "",
        description: "",
        meetingLink: "",
    });
    const [meetings, setMeetings] = useState(mockMeetings);

    const handleProfileSelect = (profile) => {
        setSelectedProfile(profile);
        setShowProfileModal(true);
    };

    const handleBookingSubmit = () => {
        // Create new meeting object
        const newMeeting = {
            id: meetings.length + 1, // Simple ID generation (in real app, use UUID or server-generated ID)
            with: selectedProfile.name,
            company: selectedProfile.company,
            date: selectedDate,
            startTime: selectedTime,
            endTime: getEndTime(selectedTime),
            link: bookingDetails.meetingLink,
            status: "pending",
            title: bookingDetails.title,
            description: bookingDetails.description,
        };

        // Add to meetings array
        setMeetings([...meetings, newMeeting]);

        // Reset form and close modals
        setShowBookingModal(false);
        setShowProfileModal(false);
        setBookingDetails({
            title: "",
            description: "",
            meetingLink: "",
        });

        // Switch to upcoming tab to show the new meeting
        setActiveTab("upcoming");
    };

    // Helper function to calculate end time (30 minutes later)
    const getEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(":").map(Number);
        let endHours = hours;
        let endMinutes = minutes + 30;

        if (endMinutes >= 60) {
            endHours += 1;
            endMinutes -= 60;
        }

        return `${endHours.toString().padStart(2, "0")}:${endMinutes
            .toString()
            .padStart(2, "0")}`;
    };

    const handleBookingChange = (field, value) => {
        setBookingDetails({
            ...bookingDetails,
            [field]: value,
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Meetings</h2>

            <MeetingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "schedule" && (
                <ScheduleMeetingTab
                    engagements={mockEngagements}
                    onProfileSelect={handleProfileSelect}
                />
            )}

            {activeTab === "upcoming" && (
                <UpcomingMeetingsTab meetings={meetings} />
            )}

            {showProfileModal && selectedProfile && (
                <ProfileModal
                    profile={selectedProfile}
                    onClose={() => setShowProfileModal(false)}
                    onDateSelect={setSelectedDate}
                    onTimeSelect={(time) => {
                        setSelectedTime(time);
                        setShowBookingModal(true);
                    }}
                />
            )}

            {showBookingModal &&
                selectedProfile &&
                selectedDate &&
                selectedTime && (
                    <BookingModal
                        profile={selectedProfile}
                        date={selectedDate}
                        time={selectedTime}
                        bookingDetails={bookingDetails}
                        onBookingChange={handleBookingChange}
                        onClose={() => setShowBookingModal(false)}
                        onSubmit={handleBookingSubmit}
                    />
                )}
        </div>
    );
};

export default Meetings;
