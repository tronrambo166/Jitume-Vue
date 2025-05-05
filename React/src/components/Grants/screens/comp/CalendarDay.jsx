import React from "react";
import MeetingBrief from "./MeetingBrief";

const CalendarDay = ({ dayObj, currentDate, onMeetingClick }) => {
    const isToday =
        dayObj.day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

    return (
        <div
            className={`min-h-32 p-2 border-r border-b relative ${
                dayObj.day === null ? "bg-gray-50" : ""
            } ${isToday ? "bg-blue-50" : ""}`}
        >
            {dayObj.day && (
                <>
                    <div className="font-medium text-sm mb-1">{dayObj.day}</div>
                    <div className="space-y-1">
                        {dayObj.meetings.map((meeting, idx) => (
                            <MeetingBrief
                                key={idx}
                                meeting={meeting}
                                onClick={() => onMeetingClick(meeting)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CalendarDay;