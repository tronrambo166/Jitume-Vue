import React, { useState } from "react";

const CalendarDays = ({ onDateSelect, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Function to generate days in a month
    const generateMonthDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days = [];

        // Add empty spaces for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            // Create date with UTC time to prevent timezone issues
            const date = new Date(Date.UTC(year, month, day));

            // Format date in a consistent YYYY-MM-DD format
            const dateStr = `${date.getUTCFullYear()}-${String(
                date.getUTCMonth() + 1
            ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

            days.push({
                date: dateStr,
                dayNumber: day,
                isToday:
                    today.getDate() === day &&
                    today.getMonth() === month &&
                    today.getFullYear() === year,
                isWeekend: [0, 6].includes(new Date(year, month, day).getDay()),
            });
        }

        return days;
    };

    const handleDateSelect = (date) => {
        onDateSelect(date);
    };

    const prevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    const resetToCurrentMonth = () => {
        setCurrentMonth(new Date());
    };

    const monthDays = generateMonthDays();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="w-full bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                    &larr;
                </button>

                <div className="text-center">
                    <h2 className="text-lg font-semibold">
                        {currentMonth.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>
                    <button
                        onClick={resetToCurrentMonth}
                        className="text-xs text-blue-500 hover:underline"
                    >
                        Today
                    </button>
                </div>

                <button
                    onClick={nextMonth}
                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                    &rarr;
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, index) =>
                    day === null ? (
                        <div key={`empty-${index}`} className="p-2"></div>
                    ) : (
                        <button
                            key={day.date}
                            className={`p-2 rounded-lg flex flex-col items-center justify-center h-12
                                ${
                                    day.isToday
                                        ? "bg-blue-100 font-bold border-2 border-blue-300"
                                        : ""
                                }
                                ${day.isWeekend ? "text-red-500" : ""}
                                ${
                                    selectedDate === day.date
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "hover:bg-blue-50 active:bg-blue-100"
                                }
                            `}
                            onClick={() => handleDateSelect(day.date)}
                        >
                            <span className="text-lg">{day.dayNumber}</span>
                            {day.isToday && (
                                <span className="text-xs">Today</span>
                            )}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default CalendarDays;
