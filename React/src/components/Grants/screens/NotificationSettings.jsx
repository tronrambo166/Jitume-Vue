import React, { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    User,
    Users,
    Bell,
    ChevronLeft,
    ChevronRight,
    Info,
    Plus,
    Video,
    Settings,
    X,
} from "lucide-react";

const CalendarView = () => {
    // Current date state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAddMeeting, setShowAddMeeting] = useState(false);

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        meetingReminders: true,
        bookingRequests: true,
        meetingUpdates: true,
        reschedulingNotifications: true,
    });

    // Mock meetings data
    const [meetings, setMeetings] = useState([
        {
            id: 1,
            title: "Product Review",
            with: "Michael Thompson",
            company: "Acme Inc.",
            date: "2025-05-03",
            startTime: "09:00",
            endTime: "10:00",
            status: "confirmed",
            color: "bg-blue-500",
        },
        {
            id: 2,
            title: "Weekly Team Sync",
            with: "Team Members",
            company: "Internal",
            date: "2025-05-03",
            startTime: "11:00",
            endTime: "12:00",
            status: "confirmed",
            color: "bg-purple-500",
        },
        {
            id: 3,
            title: "Client Proposal",
            with: "Sarah Wilson",
            company: "TechForward",
            date: "2025-05-05",
            startTime: "14:00",
            endTime: "15:00",
            status: "pending",
            color: "bg-yellow-500",
        },
        {
            id: 4,
            title: "Interview with Candidate",
            with: "James Miller",
            company: "N/A",
            date: "2025-05-06",
            startTime: "10:00",
            endTime: "11:00",
            status: "confirmed",
            color: "bg-green-500",
        },
        {
            id: 5,
            title: "Project Kickoff",
            with: "Jennifer Lee",
            company: "Innovate Corp",
            date: "2025-05-07",
            startTime: "13:00",
            endTime: "14:30",
            status: "confirmed",
            color: "bg-red-500",
        },
    ]);

    // Mock profiles for meeting scheduling
    const [profiles, setProfiles] = useState([
        { id: 1, name: "Emily Johnson", company: "TechStart", role: "CEO" },
        {
            id: 2,
            name: "David Williams",
            company: "Global Solutions",
            role: "Marketing Director",
        },
        {
            id: 3,
            name: "Sarah Wilson",
            company: "TechForward",
            role: "Project Manager",
        },
        {
            id: 4,
            name: "Michael Thompson",
            company: "Acme Inc.",
            role: "Product Manager",
        },
        { id: 5, name: "Jennifer Lee", company: "Innovate Corp", role: "CTO" },
    ]);

    // New meeting form state
    const [newMeeting, setNewMeeting] = useState({
        title: "",
        with: "",
        company: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
    });

    const [selectedProfile, setSelectedProfile] = useState(null);

    // Calendar functions
    const daysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    const handleNotificationToggle = (setting) => {
        setNotificationSettings({
            ...notificationSettings,
            [setting]: !notificationSettings[setting],
        });
    };

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const handleDateClick = (day) => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
        );
        setSelectedDate(newDate);
    };

    const handleProfileSelect = (e) => {
        const profileId = parseInt(e.target.value);
        if (profileId) {
            const profile = profiles.find((p) => p.id === profileId);
            setSelectedProfile(profile);
            setNewMeeting({
                ...newMeeting,
                with: profile.name,
                company: profile.company,
            });
        } else {
            setSelectedProfile(null);
        }
    };

    const handleAddMeeting = () => {
        if (
            !newMeeting.title ||
            !newMeeting.date ||
            !newMeeting.startTime ||
            !newMeeting.endTime
        ) {
            alert("Please fill all required fields");
            return;
        }

        const newMeetingObj = {
            id: meetings.length + 1,
            ...newMeeting,
            status: "confirmed",
            color: getRandomColor(),
        };

        setMeetings([...meetings, newMeetingObj]);
        setShowAddMeeting(false);
        setNewMeeting({
            title: "",
            with: "",
            company: "",
            date: "",
            startTime: "",
            endTime: "",
            description: "",
        });
        setSelectedProfile(null);
    };

    const getRandomColor = () => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-red-500",
            "bg-yellow-500",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleInputChange = (field, value) => {
        setNewMeeting({
            ...newMeeting,
            [field]: value,
        });
    };

    // Render calendar grid
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthName = currentDate.toLocaleString("default", {
            month: "long",
        });
        const daysCount = daysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        // Calendar days header
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Get today for highlighting
        const today = new Date();
        const isCurrentMonth =
            today.getMonth() === month && today.getFullYear() === year;
        const todayDate = today.getDate();

        // Calendar cells array
        const calendarCells = [];

        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            calendarCells.push(
                <div
                    key={`empty-${i}`}
                    className="h-24 border border-gray-200 bg-gray-50"
                ></div>
            );
        }

        // Add cells for each day in month
        for (let day = 1; day <= daysCount; day++) {
            const date = new Date(year, month, day);
            const formattedDate = formatDate(date);
            const dayMeetings = meetings.filter(
                (meeting) => meeting.date === formattedDate
            );

            const isToday = isCurrentMonth && day === todayDate;
            const isSelected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            calendarCells.push(
                <div
                    key={`day-${day}`}
                    className={`h-24 border border-gray-200 relative overflow-hidden ${
                        isToday ? "bg-blue-50" : ""
                    } ${isSelected ? "ring-2 ring-blue-500 z-10" : ""}`}
                    onClick={() => handleDateClick(day)}
                >
                    <div
                        className={`absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-sm
            ${isToday ? "bg-blue-500 text-white rounded-full" : ""}`}
                    >
                        {day}
                    </div>
                    <div className="mt-6 px-1 overflow-y-auto max-h-16">
                        {dayMeetings.slice(0, 2).map((meeting) => (
                            <div
                                key={meeting.id}
                                className={`text-xs mb-1 px-1 py-0.5 rounded truncate text-white ${meeting.color}`}
                                title={`${meeting.title} with ${meeting.with} (${meeting.startTime}-${meeting.endTime})`}
                            >
                                {meeting.startTime} {meeting.title}
                            </div>
                        ))}
                        {dayMeetings.length > 2 && (
                            <div className="text-xs text-gray-500 px-1">
                                + {dayMeetings.length - 2} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">
                        {monthName} {year}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        >
                            Today
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="py-2 text-center text-sm font-medium text-gray-500 border-b"
                        >
                            {day}
                        </div>
                    ))}
                    {calendarCells}
                </div>
            </div>
        );
    };

    // Get meetings for selected date
    const selectedDateMeetings = meetings
        .filter((meeting) => meeting.date === formatDate(selectedDate))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 mb-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <Calendar className="mr-3 text-blue-600" />
                            Meeting Calendar
                        </h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowAddMeeting(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Meeting
                            </button>
                            <button
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                                className="p-2 relative rounded-full hover:bg-gray-100"
                            >
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Calendar */}
                    <div className="lg:col-span-3">
                        {renderCalendar()}

                        {/* Selected day meetings */}
                        <div className="mt-6 bg-white rounded-lg shadow">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="font-medium text-gray-800">
                                    Meetings for{" "}
                                    {selectedDate.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </h3>
                                {selectedDateMeetings.length > 0 && (
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {selectedDateMeetings.length}{" "}
                                        {selectedDateMeetings.length === 1
                                            ? "meeting"
                                            : "meetings"}
                                    </span>
                                )}
                            </div>

                            <div className="p-4">
                                {selectedDateMeetings.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <p>
                                            No meetings scheduled for this day
                                        </p>
                                        <button
                                            onClick={() =>
                                                setShowAddMeeting(true)
                                            }
                                            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                                        >
                                            Schedule Meeting
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedDateMeetings.map((meeting) => (
                                            <div
                                                key={meeting.id}
                                                className="flex border rounded-lg overflow-hidden"
                                            >
                                                <div
                                                    className={`w-2 ${meeting.color}`}
                                                ></div>
                                                <div className="flex-1 p-4">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium text-gray-900">
                                                            {meeting.title}
                                                        </h4>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${
                                                                meeting.status ===
                                                                "confirmed"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {meeting.status ===
                                                            "confirmed"
                                                                ? "Confirmed"
                                                                : "Pending"}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {meeting.startTime} -{" "}
                                                        {meeting.endTime}
                                                    </div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                                        <User className="w-4 h-4 mr-1" />
                                                        {meeting.with}{" "}
                                                        {meeting.company &&
                                                            `(${meeting.company})`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow sticky top-6">
                            <div className="p-4 border-b">
                                <h3 className="font-medium text-gray-800">
                                    Upcoming Meetings
                                </h3>
                            </div>

                            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                                {meetings
                                    .filter(
                                        (m) =>
                                            new Date(m.date) >=
                                            new Date(
                                                new Date().setHours(0, 0, 0, 0)
                                            )
                                    )
                                    .sort(
                                        (a, b) =>
                                            new Date(
                                                a.date + "T" + a.startTime
                                            ) -
                                            new Date(b.date + "T" + b.startTime)
                                    )
                                    .slice(0, 5)
                                    .map((meeting) => (
                                        <div
                                            key={meeting.id}
                                            className="flex items-start p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                                        >
                                            <div
                                                className={`w-3 h-3 mt-1 rounded-full mr-3 ${meeting.color}`}
                                            ></div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {meeting.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(
                                                        meeting.date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                    , {meeting.startTime}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center">
                                                        <User className="w-3 h-3 mr-1" />{" "}
                                                        {meeting.with}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                {meetings.filter(
                                    (m) => new Date(m.date) >= new Date()
                                ).length === 0 && (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        No upcoming meetings
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t">
                                <button
                                    onClick={() => setShowNotifications(true)}
                                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium flex items-center justify-center"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Notification Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification settings modal */}
            {showNotifications && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                                Notification Settings
                            </h3>
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            <p className="text-gray-600 mb-4">
                                Manage how you receive notifications about
                                meetings and booking requests.
                            </p>

                            <div className="space-y-3">
                                {Object.entries(notificationSettings).map(
                                    ([key, value]) => {
                                        const labelMap = {
                                            emailNotifications:
                                                "Email Notifications",
                                            meetingReminders:
                                                "Meeting Reminders",
                                            bookingRequests: "Booking Requests",
                                            meetingUpdates: "Meeting Updates",
                                            reschedulingNotifications:
                                                "Rescheduling Suggestions",
                                        };

                                        const descriptionMap = {
                                            emailNotifications:
                                                "Receive email notifications for important updates",
                                            meetingReminders:
                                                "Receive notifications 30 minutes before scheduled meetings",
                                            bookingRequests:
                                                "Receive notifications when someone requests a meeting",
                                            meetingUpdates:
                                                "Receive notifications when a meeting is updated or rescheduled",
                                            reschedulingNotifications:
                                                "Receive notifications when someone suggests a different meeting time",
                                        };

                                        return (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800">
                                                        {labelMap[key]}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {descriptionMap[key]}
                                                    </p>
                                                </div>
                                                <div className="ml-4">
                                                    <button
                                                        type="button"
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                                            value
                                                                ? "bg-blue-600"
                                                                : "bg-gray-200"
                                                        }`}
                                                        onClick={() =>
                                                            handleNotificationToggle(
                                                                key
                                                            )
                                                        }
                                                        aria-pressed={value}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                value
                                                                    ? "translate-x-6"
                                                                    : "translate-x-1"
                                                            }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Meeting Modal */}
            {showAddMeeting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                                Schedule New Meeting
                            </h3>
                            <button
                                onClick={() => setShowAddMeeting(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meeting Title
                                </label>
                                <input
                                    type="text"
                                    value={newMeeting.title}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter meeting title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Participant
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={
                                        selectedProfile
                                            ? selectedProfile.id
                                            : ""
                                    }
                                    onChange={handleProfileSelect}
                                >
                                    <option value="">Select a person</option>
                                    {profiles.map((profile) => (
                                        <option
                                            key={profile.id}
                                            value={profile.id}
                                        >
                                            {profile.name} - {profile.company} (
                                            {profile.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newMeeting.date}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "date",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={newMeeting.startTime}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "startTime",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={newMeeting.endTime}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "endTime",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={newMeeting.description}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Meeting details..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAddMeeting(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMeeting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Schedule Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
