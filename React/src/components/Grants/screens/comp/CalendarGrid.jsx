import React from "react";
import CalendarDay from "./CalendarDay";

const CalendarGrid = ({ currentDate, meetings, onMeetingClick }) => {
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );

    const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const generateCalendarDays = () => {
        const days = [];
        const meetingsByDate = {};

        meetings.forEach((meeting) => {
            const dateKey = new Date(meeting.date).toDateString();
            if (!meetingsByDate[dateKey]) {
                meetingsByDate[dateKey] = [];
            }
            meetingsByDate[dateKey].push(meeting);
        });

        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push({ day: null, meetings: [] });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );
            const dateKey = date.toDateString();
            days.push({
                day,
                date,
                meetings: meetingsByDate[dateKey] || [],
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="border rounded-lg overflow-hidden bg-white">
            <div className="grid grid-cols-7 border-b">
                {weekdays.map((day) => (
                    <div
                        key={day}
                        className="p-2 text-center font-medium bg-gray-50"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {calendarDays.map((dayObj, index) => (
                    <CalendarDay
                        key={index}
                        dayObj={dayObj}
                        currentDate={currentDate}
                        onMeetingClick={onMeetingClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalendarGrid;
