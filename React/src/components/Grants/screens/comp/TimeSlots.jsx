import React from "react";

const TimeSlots = ({ onTimeSelect }) => {
    const generateTimeSlots = () => {
        const morning = [];
        const afternoon = [];

        // Morning slots (9AM-12PM)
        for (let hour = 9; hour < 12; hour++) {
            const h = hour.toString().padStart(2, "0");
            morning.push(`${h}:00`);
            morning.push(`${h}:30`);
        }

        // Afternoon slots (12PM-5PM)
        for (let hour = 12; hour < 17; hour++) {
            const h = hour.toString().padStart(2, "0");
            afternoon.push(`${h}:00`);
            afternoon.push(`${h}:30`);
        }

        return { morning, afternoon };
    };

    const { morning, afternoon } = generateTimeSlots();

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-bold mb-2 text-gray-700">MORNING</h4>
                <div className="grid grid-cols-3 gap-2">
                    {morning.map((time) => (
                        <button
                            key={time}
                            className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg font-medium"
                            onClick={() => onTimeSelect(time)}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-bold mb-2 text-gray-700">AFTERNOON</h4>
                <div className="grid grid-cols-3 gap-2">
                    {afternoon.map((time) => (
                        <button
                            key={time}
                            className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg font-medium"
                            onClick={() => onTimeSelect(time)}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimeSlots;
