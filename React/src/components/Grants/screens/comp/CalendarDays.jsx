import React from "react";

const CalendarDays = ({ onDateSelect }) => {
    const generateCalendarDays = () => {
        const today = new Date();
        const days = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({
                date: date.toISOString().split("T")[0],
                dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
                dayNumber: date.getDate(),
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="mb-4">
            <h4 className="font-medium mb-2">Select a date</h4>
            <div className="flex space-x-2">
                {calendarDays.map((day) => (
                    <button
                        key={day.date}
                        className={`p-2 rounded-lg text-center w-20 bg-gray-100 hover:bg-gray-200`}
                        onClick={() => onDateSelect(day.date)}
                    >
                        <div className="text-sm">{day.dayName}</div>
                        <div className="text-lg font-semibold">
                            {day.dayNumber}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CalendarDays;