import React from "react";

const MeetingBrief = ({ meeting, onClick }) => {
    return (
        <div
            className={`text-xs p-1 rounded cursor-pointer hover:opacity-75 ${
                meeting.status === "confirmed"
                    ? "bg-green-100"
                    : "bg-yellow-100"
            }`}
            onClick={onClick}
        >
            <div className="font-medium truncate">{meeting.with}</div>
            <div className="truncate">{meeting.startTime}</div>
        </div>
    );
};

export default MeetingBrief;
