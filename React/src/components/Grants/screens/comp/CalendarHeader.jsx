import React from "react";

const CalendarHeader = ({ currentDate, setCurrentDate }) => {
    const prevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const monthYearString = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={prevMonth}
                className="p-2 rounded hover:bg-gray-100"
            >
                &lt; Prev
            </button>
            <h2 className="text-xl font-bold">{monthYearString}</h2>
            <button
                onClick={nextMonth}
                className="p-2 rounded hover:bg-gray-100"
            >
                Next &gt;
            </button>
        </div>
    );
};

export default CalendarHeader;
