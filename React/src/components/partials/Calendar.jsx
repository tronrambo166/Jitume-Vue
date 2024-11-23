import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons

const Calendar = ({ onDateSelect }) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    );

    const [currentMonth, setCurrentMonth] = useState(
        eighteenYearsAgo.getMonth()
    );
    const [currentYear, setCurrentYear] = useState(
        eighteenYearsAgo.getFullYear()
    );
    const [selectedDay, setSelectedDay] = useState(eighteenYearsAgo.getDate());

    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const handlePreviousMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const firstDateOfMonth = new Date(newYear, newMonth, 1);

        if (firstDateOfMonth <= eighteenYearsAgo) {
            setCurrentMonth(newMonth);
            setCurrentYear(newYear);
        }
    };

    const handleNextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        const firstDateOfMonth = new Date(newYear, newMonth, 1);

        if (firstDateOfMonth <= eighteenYearsAgo) {
            setCurrentMonth(newMonth);
            setCurrentYear(newYear);
        }
    };

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentYear, currentMonth, day);
        if (selectedDate > eighteenYearsAgo) return;

        setSelectedDay(day);
        const formattedDate = `${String(day).padStart(2, "0")}/${String(
            currentMonth + 1
        ).padStart(2, "0")}/${currentYear}`;
        onDateSelect(formattedDate);
    };

    const handleMonthYearSelection = (month, year) => {
        setCurrentMonth(month);
        setCurrentYear(year);
        setShowMonthYearPicker(false);
    };

    return (
        <div className="p-2 border rounded-md bg-white w-64">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <button
                    onClick={handlePreviousMonth}
                    className="text-gray-500 hover:text-black text-sm font-semibold"
                    aria-label="Previous Month"
                >
                    <FaChevronLeft />
                </button>
                <span
                    className="text-sm font-bold text-black cursor-pointer"
                    onClick={() => setShowMonthYearPicker(!showMonthYearPicker)} // Toggle picker visibility
                >
                    {new Date(currentYear, currentMonth).toLocaleString(
                        "default",
                        {
                            month: "short",
                            year: "numeric",
                        }
                    )}
                </span>
                <button
                    onClick={handleNextMonth}
                    className="text-gray-500 hover:text-black text-sm font-semibold"
                    aria-label="Next Month"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Month-Year Picker (Dropdown) */}
            {showMonthYearPicker && (
                <div className="absolute bg-white shadow-lg p-2 border rounded-md w-full sm:w-64 md:w-80 z-10">
                    <div className="flex flex-wrap justify-between mb-2 gap-2">
                        <select
                            value={currentMonth}
                            onChange={(e) =>
                                handleMonthYearSelection(
                                    parseInt(e.target.value),
                                    currentYear
                                )
                            }
                            className="border rounded-md p-1 bg-white text-gray-500 flex-1"
                        >
                            {[
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                            ].map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <select
                            value={currentYear}
                            onChange={(e) =>
                                handleMonthYearSelection(
                                    currentMonth,
                                    parseInt(e.target.value)
                                )
                            }
                            className="border rounded-md p-1 bg-white text-gray-500 flex-1"
                        >
                            {Array.from(
                                { length: 100 },
                                (_, i) => today.getFullYear() - i
                            )
                                .filter(
                                    (year) =>
                                        year <= eighteenYearsAgo.getFullYear()
                                ) // Filter years greater than 18 years ago
                                .map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Days of the week */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-600 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div key={day} className="font-medium">
                            {day}
                        </div>
                    )
                )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 text-center">
                {Array(firstDayOfMonth)
                    .fill(null)
                    .map((_, index) => (
                        <div key={`empty-${index}`} className="p-1"></div>
                    ))}
                {Array(daysInMonth)
                    .fill(null)
                    .map((_, index) => {
                        const day = index + 1;
                        const date = new Date(currentYear, currentMonth, day);
                        const isToday =
                            currentYear === eighteenYearsAgo.getFullYear() &&
                            currentMonth === eighteenYearsAgo.getMonth() &&
                            day === eighteenYearsAgo.getDate();

                        const isSelected = day === selectedDay;
                        const isDisabled = date > eighteenYearsAgo;

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                disabled={isDisabled}
                                className={`p-1 text-xs rounded-full ${
                                    isSelected
                                        ? "bg-green-700 text-white"
                                        : isToday
                                        ? "border border-green-500 text-green-500"
                                        : isDisabled
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                                aria-label={`Day ${day}`}
                            >
                                {day}
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default Calendar;
