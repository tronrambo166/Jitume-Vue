import React from "react";

const MeetingListItem = ({ meeting, onClick }) => {
    return (
        <div
            className="flex p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex-grow">
                <div className="flex justify-between">
                    <div>
                        <h4 className="font-semibold">{meeting.with}</h4>
                        <p className="text-sm text-gray-600">
                            {meeting.company}
                        </p>
                    </div>
                    <span
                        className={`h-fit px-2 py-1 text-xs rounded-full ${
                            meeting.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {meeting.status === "confirmed"
                            ? "Confirmed"
                            : "Pending"}
                    </span>
                </div>

                <div className="text-sm mt-2">
                    {new Date(meeting.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}
                    <span className="mx-1">•</span>
                    {meeting.startTime} - {meeting.endTime}
                </div>
            </div>
        </div>
    );
};

export default MeetingListItem;
