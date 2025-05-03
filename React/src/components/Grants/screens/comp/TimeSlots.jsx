import React from "react";

const TimeSlots = ({ onTimeSelect }) => {
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
            slots.push(`${hour.toString().padStart(2, "0")}:30`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    return (
        <div>
            <h4 className="font-medium mb-2">Select a time</h4>
            <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                    <button
                        key={time}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-center"
                        onClick={() => onTimeSelect(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TimeSlots;