import { useState, useEffect, useRef } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import { Link } from "react-router-dom";

const NotificationBell = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    // Fetch notifications on component mount
    useEffect(() => {
        const fetchNotifications = () => {
            axiosClient
                .get("business/notifications")
                .then(({ data }) => {
                    setNotifications(data.data);
                    console.log("Notifications = ");
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchNotifications();
    }, []);

    // Unread count is calculated based on "new" field in the notification
    const unreadCount = notifications.filter((notif) => notif.new === 1).length;

    // Toggle dropdown
    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
        if (unreadCount > 0) {
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) => ({
                    ...notif,
                    new: 0, // Mark all as read when dropdown is opened
                }))
            );

            //Set as Read/ New ==0
            axiosClient
                .get("business/notifSetRead")
                .then(({ data }) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
                //Set as Read/ New ==0
        }
    };

    // Clear all notifications
    const clearNotifications = () => {
        setNotifications([]);
    };

    // Remove a single notification
    const removeNotification = (index) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((_, i) => i !== index)
        );
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close the dropdown when a notification link is clicked
    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex items-center">
                <FaBell
                    className="cursor-pointer text-2xl text-white"
                    onClick={toggleDropdown}
                />
                {unreadCount > 0 && (
                    <div className="absolute flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-3">
                        {unreadCount}
                    </div>
                )}
            </div>

            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-lg rounded-lg p-4 z-20"
                >
                    {/* Fixed Header */}
                    <div className="flex justify-between items-center mb-2 border-b border-gray-200 p-2 sticky top-0 bg-white z-10">
                        <span className="font-semibold text-gray-700 text-sm">
                            Notifications
                        </span>
                        <FaTimes
                            className="cursor-pointer text-gray-500 text-xs"
                            onClick={() => setDropdownOpen(false)}
                        />
                    </div>

                    {/* Scrollable Notifications */}
                    <div className="max-h-72 overflow-y-auto scroll-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-lg">
                        {notifications.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            <ul>
                                {notifications.map((notif, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start space-x-2 py-2 border-b border-gray-200"
                                    >
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-xl">
                                                {notif.icon}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-semibold text-gray-800">
                                                {notif.name}
                                            </div>
                                            <div
                                                className={`${
                                                    notif.new === 0
                                                        ? "text-gray-500"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {notif.text}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {notif.date}
                                            </div>
                                            <div className="mt-2 flex space-x-2">
                                                <Link
                                                    to={`./${notif.link}`}
                                                    onClick={closeDropdown}
                                                >
                                                    <button className="text-blue-600 text-xs hover:text-blue-800">
                                                        View More
                                                    </button>
                                                </Link>
                                                <button
                                                    className="text-red-600 text-xs hover:text-red-800"
                                                    onClick={() =>
                                                        removeNotification(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                        <button
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={clearNotifications}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
