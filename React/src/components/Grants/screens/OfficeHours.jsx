import React, { useState } from "react";
import {
    Clock,
    Save,
    Calendar,
    ChevronDown,
    AlertCircle,
    Info,
} from "lucide-react";

const OfficeHours = () => {
    const [officeHours, setOfficeHours] = useState({
        monday: { isActive: true, start: "09:00", end: "17:00" },
        tuesday: { isActive: true, start: "09:00", end: "17:00" },
        wednesday: { isActive: true, start: "09:00", end: "17:00" },
        thursday: { isActive: true, start: "09:00", end: "17:00" },
        friday: { isActive: true, start: "09:00", end: "17:00" },
        saturday: { isActive: false, start: "09:00", end: "17:00" },
        sunday: { isActive: false, start: "09:00", end: "17:00" },
    });
    const [timezone, setTimezone] = useState("America/New_York");
    const [applyAll, setApplyAll] = useState(false);
    const [applyAllTimes, setApplyAllTimes] = useState({
        start: "09:00",
        end: "17:00",
    });
    const [saved, setSaved] = useState(false);

    const handleDayToggle = (day) => {
        setOfficeHours((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                isActive: !prev[day].isActive,
            },
        }));
        setSaved(false);
    };

    const handleTimeChange = (day, field, value) => {
        setOfficeHours((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
        setSaved(false);
    };

    const handleApplyAllChange = (field, value) => {
        setApplyAllTimes((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyToAllDays = () => {
        const updatedHours = { ...officeHours };
        for (const day in updatedHours) {
            if (updatedHours[day].isActive) {
                updatedHours[day] = {
                    ...updatedHours[day],
                    start: applyAllTimes.start,
                    end: applyAllTimes.end,
                };
            }
        }
        setOfficeHours(updatedHours);
        setApplyAll(false);
        setSaved(false);
    };

    const saveOfficeHours = () => {
        console.log("Saved office hours:", {
            timezone,
            officeHours,
        });
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    const days = [
        { id: "monday", label: "Monday" },
        { id: "tuesday", label: "Tuesday" },
        { id: "wednesday", label: "Wednesday" },
        { id: "thursday", label: "Thursday" },
        { id: "friday", label: "Friday" },
        { id: "saturday", label: "Saturday" },
        { id: "sunday", label: "Sunday" },
    ];

    const formatTimezone = (tz) => {
        const labels = {
            UTC: "UTC (Coordinated Universal Time)",
            "America/New_York": "Eastern Time (ET)",
            "America/Chicago": "Central Time (CT)",
            "America/Denver": "Mountain Time (MT)",
            "America/Los_Angeles": "Pacific Time (PT)",
            "Europe/London": "London Time (GMT/BST)",
        };
        return labels[tz] || tz;
    };

    // Calculate active days for summary
    const activeDays = Object.entries(officeHours)
        .filter(([_, hours]) => hours.isActive)
        .map(([day, hours]) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            hours: `${hours.start} - ${hours.end}`,
        }));

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 mb-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Calendar className="mr-3 text-emerald-600" />
                        Meeting Availability Settings
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-lg font-medium text-gray-800">
                                    Set Your Office Hours
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Define when you're available for meetings
                                    and appointments
                                </p>
                            </div>

                            {/* Timezone Selector */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="mb-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                        Your Timezone
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={timezone}
                                            onChange={(e) => {
                                                setTimezone(e.target.value);
                                                setSaved(false);
                                            }}
                                            className="block w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                        >
                                            <option value="UTC">
                                                UTC (Coordinated Universal Time)
                                            </option>
                                            <option value="America/New_York">
                                                Eastern Time (ET)
                                            </option>
                                            <option value="America/Chicago">
                                                Central Time (CT)
                                            </option>
                                            <option value="America/Denver">
                                                Mountain Time (MT)
                                            </option>
                                            <option value="America/Los_Angeles">
                                                Pacific Time (PT)
                                            </option>
                                            <option value="Europe/London">
                                                London Time (GMT/BST)
                                            </option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bulk Time Editor */}
                            {applyAll && (
                                <div className="p-6 border-b border-gray-200 bg-emerald-50">
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-emerald-800 mb-2">
                                            Apply Times to All Active Days
                                        </h3>
                                        <p className="text-xs text-emerald-600 mb-4">
                                            Set one schedule for all your active
                                            work days
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label
                                                    htmlFor="bulk-start"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Start Time
                                                </label>
                                                <input
                                                    type="time"
                                                    id="bulk-start"
                                                    value={applyAllTimes.start}
                                                    onChange={(e) =>
                                                        handleApplyAllChange(
                                                            "start",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="px-3 py-2 block w-full rounded-md border border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="bulk-end"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    End Time
                                                </label>
                                                <input
                                                    type="time"
                                                    id="bulk-end"
                                                    value={applyAllTimes.end}
                                                    onChange={(e) =>
                                                        handleApplyAllChange(
                                                            "end",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="px-3 py-2 block w-full rounded-md border border-emerald-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={applyToAllDays}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
                                        >
                                            Apply to All Active Days
                                        </button>
                                        <button
                                            onClick={() => setApplyAll(false)}
                                            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium rounded-md transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Daily Time Editors */}
                            <div className="divide-y divide-gray-200">
                                {days.map(({ id, label }) => (
                                    <div
                                        key={id}
                                        className={`p-4 sm:p-6 transition-colors ${
                                            officeHours[id].isActive
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            <div className="w-full sm:w-1/4 mb-3 sm:mb-0">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`${id}-active`}
                                                        checked={
                                                            officeHours[id]
                                                                .isActive
                                                        }
                                                        onChange={() =>
                                                            handleDayToggle(id)
                                                        }
                                                        className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                    />
                                                    <label
                                                        htmlFor={`${id}-active`}
                                                        className={`ml-3 font-medium ${
                                                            officeHours[id]
                                                                .isActive
                                                                ? "text-gray-900"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {label}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="w-full sm:w-3/4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label
                                                            htmlFor={`${id}-start`}
                                                            className={`block text-xs mb-1 ${
                                                                officeHours[id]
                                                                    .isActive
                                                                    ? "text-gray-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        >
                                                            Start Time
                                                        </label>
                                                        <input
                                                            type="time"
                                                            id={`${id}-start`}
                                                            value={
                                                                officeHours[id]
                                                                    .start
                                                            }
                                                            onChange={(e) =>
                                                                handleTimeChange(
                                                                    id,
                                                                    "start",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            disabled={
                                                                !officeHours[id]
                                                                    .isActive
                                                            }
                                                            className={`px-3 py-2 block w-full rounded-md border ${
                                                                officeHours[id]
                                                                    .isActive
                                                                    ? "border-gray-300 bg-white focus:border-emerald-500 focus:ring-emerald-500 text-gray-900"
                                                                    : "border-gray-200 bg-gray-100 text-gray-400"
                                                            } shadow-sm sm:text-sm`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor={`${id}-end`}
                                                            className={`block text-xs mb-1 ${
                                                                officeHours[id]
                                                                    .isActive
                                                                    ? "text-gray-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        >
                                                            End Time
                                                        </label>
                                                        <input
                                                            type="time"
                                                            id={`${id}-end`}
                                                            value={
                                                                officeHours[id]
                                                                    .end
                                                            }
                                                            onChange={(e) =>
                                                                handleTimeChange(
                                                                    id,
                                                                    "end",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            disabled={
                                                                !officeHours[id]
                                                                    .isActive
                                                            }
                                                            className={`px-3 py-2 block w-full rounded-md border ${
                                                                officeHours[id]
                                                                    .isActive
                                                                    ? "border-gray-300 bg-white focus:border-emerald-500 focus:ring-emerald-500 text-gray-900"
                                                                    : "border-gray-200 bg-gray-100 text-gray-400"
                                                            } shadow-sm sm:text-sm`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                                    <button
                                        onClick={() => setApplyAll(true)}
                                        className="px-4 py-2 bg-white hover:bg-gray-50 text-emerald-600 border border-emerald-600 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                    >
                                        Set Same Hours for All Days
                                    </button>
                                    <button
                                        onClick={saveOfficeHours}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {saved
                                            ? "Saved Successfully!"
                                            : "Save Office Hours"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Summary Panel */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Your Availability
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center text-sm text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">
                                            Current Timezone:
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900 ml-6">
                                        {formatTimezone(timezone)}
                                    </p>
                                </div>

                                {activeDays.length === 0 ? (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start mt-4">
                                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-yellow-700">
                                                No active days selected. You
                                                won't be available for meetings.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            Available Times:
                                        </h4>
                                        <ul className="space-y-2">
                                            {activeDays.map(
                                                ({ day, hours }) => (
                                                    <li
                                                        key={day}
                                                        className="flex text-sm border-b border-gray-100 pb-2"
                                                    >
                                                        <span className="w-24 font-medium text-gray-700">
                                                            {day}:
                                                        </span>
                                                        <span className="text-gray-900">
                                                            {hours}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Tip */}
                                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-md">
                                    <div className="flex">
                                        <Info className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-emerald-800 mb-1">
                                                Pro Tip
                                            </h4>
                                            <p className="text-xs text-emerald-700">
                                                Your office hours will be used
                                                to determine your availability
                                                for meeting requests. Only times
                                                within these hours will be
                                                offered to others.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficeHours;
