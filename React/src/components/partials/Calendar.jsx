import React, { useState } from "react";
import {
    AiOutlineCalendar,
    AiOutlineLeft,
    AiOutlineRight,
} from "react-icons/ai";

const CalendarDropdown = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

 const handleDateChange = (date) => {
     setSelectedDate(
         `${String(date.day).padStart(2, "0")}/${String(date.month).padStart(
             2,
             "0"
         )}/${date.year}`
     );
     setShowCalendar(false);
     if (onDateSelect) {
         onDateSelect(date);
     }
 };


    const Calendar = ({ onSelectDate }) => {
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
        const [viewYear, setViewYear] = useState(false);

        const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        const handlePreviousMonth = () => {
            const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            setCurrentMonth(newMonth);
            setCurrentYear(newYear);
        };

        const handleNextMonth = () => {
            const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            if (
                newYear < eighteenYearsAgo.getFullYear() ||
                (newYear === eighteenYearsAgo.getFullYear() &&
                    newMonth <= eighteenYearsAgo.getMonth())
            ) {
                setCurrentMonth(newMonth);
                setCurrentYear(newYear);
            }
        };

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentYear, currentMonth, day);
        if (selectedDate <= eighteenYearsAgo) {
            onSelectDate({
                year: currentYear,
                month: currentMonth + 1, // Months are 0-indexed
                day,
            });
        }
    };


        const renderYearView = () => {
            const startYear = eighteenYearsAgo.getFullYear();
            const years = Array.from({ length: 101 }, (_, i) => startYear - i);

            return (
                <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-50 shadow-md">
                    {years.map((year) => (
                        <button
                            key={year}
                            className={`block p-2 w-full text-left text-sm text-black rounded hover:bg-green-600 hover:text-white ${
                                year === currentYear
                                    ? "bg-green text-white font-bold"
                                    : ""
                            }`}
                            onClick={() => {
                                setCurrentYear(year);
                                setCurrentMonth(0);
                                setViewYear(false);
                            }}
                            aria-label={`Select year ${year}`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            );
        };

        return (
            <div className="p-2 border rounded-md bg-white w-64 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <button
                        type="button"
                        onClick={handlePreviousMonth}
                        className="text-gray-500 hover:text-black text-sm font-semibold"
                        aria-label="Previous Month"
                    >
                        <AiOutlineLeft />
                    </button>
                    <span
                        className="text-sm font-bold text-black cursor-pointer"
                        onClick={() => setViewYear(true)}
                    >
                        {new Date(currentYear, currentMonth).toLocaleString(
                            "default",
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </span>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="text-gray-500 hover:text-black text-sm font-semibold"
                        aria-label="Next Month"
                    >
                        <AiOutlineRight />
                    </button>
                </div>

                {viewYear ? (
                    renderYearView()
                ) : (
                    <>
                        <div className="grid grid-cols-7 text-center text-xs text-gray-600 mb-1">
                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                            ].map((day) => (
                                <div key={day} className="font-medium">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 text-center">
                            {Array(firstDayOfMonth)
                                .fill(null)
                                .map((_, index) => (
                                    <div
                                        key={`empty-${index}`}
                                        className="p-1"
                                    ></div>
                                ))}
                            {Array(daysInMonth)
                                .fill(null)
                                .map((_, index) => {
                                    const day = index + 1;
                                    const isSelectable =
                                        new Date(
                                            currentYear,
                                            currentMonth,
                                            day
                                        ) <= eighteenYearsAgo;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDateClick(day)}
                                            className={`p-1 text-xs rounded-full ${
                                                isSelectable
                                                    ? "text-gray-700 hover:bg-gray-100"
                                                    : "text-gray-300 cursor-not-allowed"
                                            }`}
                                            disabled={!isSelectable}
                                            aria-label={`Select date ${day}`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="calendar-dropdown-container relative">
            <label className="block text-gray-700 mb-2">
                Select Date of Birth:
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={selectedDate}
                    placeholder="DD/MM/YYYY"
                    className="border text-black rounded px-3 py-2 w-full pl-10 focus:outline-green"
                    onClick={() => setShowCalendar(!showCalendar)}
                    readOnly
                />
                <AiOutlineCalendar
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
                    size={20}
                />
            </div>

            {showCalendar && (
                <div className="absolute top-full mt-2 z-10">
                    <Calendar onSelectDate={handleDateChange} />
                </div>
            )}
        </div>
    );
};

export default CalendarDropdown;
