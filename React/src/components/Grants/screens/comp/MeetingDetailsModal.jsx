import React from "react";

const MeetingDetailsModal = ({ meeting, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{meeting.with}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-gray-600">{meeting.company}</p>
                        <div className="mt-2">
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

                    {meeting.title && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-500">
                                Title
                            </h4>
                            <p>{meeting.title}</p>
                        </div>
                    )}

                    {meeting.description && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-500">
                                Description
                            </h4>
                            <p>{meeting.description}</p>
                        </div>
                    )}

                    <div>
                        <h4 className="font-medium text-sm text-gray-500">
                            Date & Time
                        </h4>
                        <p>
                            {new Date(meeting.date).toLocaleDateString(
                                "en-US",
                                {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                            <br />
                            {meeting.startTime} - {meeting.endTime}
                        </p>
                    </div>

                    {meeting.link && (
                        <div className="mt-6">
                            <a
                                href={meeting.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Join Meeting
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingDetailsModal;