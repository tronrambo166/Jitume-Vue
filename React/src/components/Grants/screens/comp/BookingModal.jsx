import React from "react";

const BookingModal = ({
    profile,
    date,
    time,
    bookingDetails,
    onBookingChange,
    onClose,
    onSubmit,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Meeting Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600">
                        {profile.name} -{" "}
                        {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}{" "}
                        at {time}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Title
                        </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            value={bookingDetails.title}
                            onChange={(e) =>
                                onBookingChange("title", e.target.value)
                            }
                            placeholder="Quick catch-up"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            className="border border-gray-300 rounded-md p-2 w-full h-24"
                            value={bookingDetails.description}
                            onChange={(e) =>
                                onBookingChange("description", e.target.value)
                            }
                            placeholder="What would you like to discuss?"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Link
                        </label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            value={bookingDetails.meetingLink}
                            onChange={(e) =>
                                onBookingChange("meetingLink", e.target.value)
                            }
                            placeholder="https://meet.google.com/..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
                    >
                        Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
