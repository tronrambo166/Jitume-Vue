import React, { useState } from "react";
import CalendarDays from "./CalendarDays";
import TimeSlots from "./TimeSlots";

const ProfileModal = ({ profile, onClose, onDateSelect, onTimeSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [showTimeSelection, setShowTimeSelection] = useState(false);

    const handleDateConfirm = (date) => {
        setSelectedDate(date);
        setShowTimeSelection(true);
        onDateSelect(date);
    };

    const handleBackToCalendar = () => {
        setShowTimeSelection(false);
    };

    const handleTimeSelection = (time) => {
        onTimeSelect(time);
        // Don't close the modal here, let the parent component handle it
    };

    // This function ensures the correct date is displayed
    const formatSelectedDate = (dateStr) => {
        if (!dateStr) return "";

        // Parse the ISO date string but adjust for timezone offset
        const [year, month, day] = dateStr.split("-").map(Number);

        // Create date with UTC time to prevent timezone shifting
        const date = new Date(Date.UTC(year, month - 1, day));

        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: "UTC", // Ensure the date stays fixed
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                {!showTimeSelection ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">SELECT DATE</h3>
                            <button onClick={onClose} className="text-2xl">
                                &times;
                            </button>
                        </div>
                        <CalendarDays
                            onDateSelect={handleDateConfirm}
                            selectedDate={selectedDate}
                        />
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={handleBackToCalendar}
                                className="text-blue-600 font-bold"
                            >
                                ← BACK
                            </button>
                            <h3 className="text-xl font-bold">SELECT TIME</h3>
                            <button onClick={onClose} className="text-2xl">
                                &times;
                            </button>
                        </div>
                        <div className="mb-2 text-center bg-blue-50 py-2 rounded-lg">
                            <span className="font-bold">
                                {formatSelectedDate(selectedDate)}
                            </span>
                        </div>
                        <TimeSlots onTimeSelect={handleTimeSelection} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
