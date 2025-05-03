import React from "react";

const MeetingCard = ({ meeting }) => {
    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold">{meeting.with}</h3>
                    <p className="text-sm text-gray-600">{meeting.company}</p>
                    {meeting.title && (
                        <p className="text-sm font-medium mt-1">
                            {meeting.title}
                        </p>
                    )}
                    {meeting.description && (
                        <p className="text-sm text-gray-600 mt-1">
                            {meeting.description}
                        </p>
                    )}
                    <p className="text-sm mt-1">
                        {new Date(meeting.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                        <span className="mx-1">•</span>
                        {meeting.startTime} - {meeting.endTime}
                    </p>
                    {meeting.link && (
                        <a
                            href={meeting.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                        >
                            Join Meeting
                        </a>
                    )}
                </div>
                <div>
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${
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
            </div>
        </div>
    );
};

export default MeetingCard;
