import React from "react";
import CalendarDays from "./CalendarDays";
import TimeSlots from "./TimeSlots";

const ProfileModal = ({ profile, onClose, onDateSelect, onTimeSelect }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                        Schedule with {profile.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <CalendarDays onDateSelect={onDateSelect} />
                <TimeSlots onTimeSelect={onTimeSelect} />
            </div>
        </div>
    );
};

export default ProfileModal;
