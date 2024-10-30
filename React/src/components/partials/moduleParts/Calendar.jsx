import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Calendar = ({ onDateSelect }) => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1; // Months are zero-indexed
    const todayDay = today.getDate();

    const [selectedDate, setSelectedDate] = useState(todayDay); // Set default selected date to today
    const [currentMonth, setCurrentMonth] = useState(todayMonth);
    const [currentYear, setCurrentYear] = useState(todayYear);

    const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

    const renderDays = () => {
        const totalDays = daysInMonth(currentMonth, currentYear);
        const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();

        const daysArray = Array.from({ length: firstDay }, () => null).concat(
            Array.from({ length: totalDays }, (_, i) => i + 1)
        );

        return daysArray.map((day, index) => {
            const isDisabled =
                currentYear < todayYear ||
                (currentYear === todayYear && currentMonth < todayMonth) ||
                (currentYear === todayYear &&
                    currentMonth === todayMonth &&
                    day < todayDay);

            return (
                <div
                    key={index}
                    className={`flex items-center justify-center aspect-square ${
                        isDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "cursor-pointer hover:bg-gray-200"
                    }`}
                    onClick={() => {
                        if (!isDisabled) {
                            const selected = new Date(
                                currentYear,
                                currentMonth - 1,
                                day
                            );
                            setSelectedDate(day);
                            onDateSelect(selected); // Call the parent handler
                        }
                    }}
                    title={isDisabled ? "Date not allowed" : ""}
                >
                    <div
                        className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full ${
                            day === selectedDate
                                ? "bg-green-700 text-white"
                                : ""
                        }`}
                    >
                        {day ? day : ""}
                    </div>
                </div>
            );
        });
    };

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getMonthName = (month) => {
        const date = new Date(currentYear, month - 1, 1);
        return date.toLocaleString("default", { month: "long" });
    };

    useEffect(() => {
        // Update selected date when the month changes
        if (currentMonth === todayMonth && currentYear === todayYear) {
            setSelectedDate(todayDay); // Reset selected date to today if in the current month
        }
    }, [currentMonth, currentYear, todayDay]);

    return (
        <div className="border rounded-lg p-3 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-3">
                <button onClick={handlePrevMonth}>
                    <FiChevronLeft size={20} />
                </button>
                <span className="text-sm font-semibold">{`${getMonthName(
                    currentMonth
                )} ${currentYear}`}</span>
                <button onClick={handleNextMonth}>
                    <FiChevronRight size={20} />
                </button>
            </div>

            {/* Weekday Names */}
            <div className="grid grid-cols-7 gap-1 text-center text-gray-500 text-xs">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            {/* Days of the Month */}
            <div className="grid grid-cols-7 gap-1 text-center mt-2">
                {renderDays()}
            </div>
        </div>
    );
};

export default Calendar;
