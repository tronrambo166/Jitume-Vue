// components/NotificationDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, MessageSquare, AlertTriangle } from "lucide-react";
import axiosClient from "../../../axiosClient"; // or your axiosClient
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Replace with your actual API endpoint
                const { data } = await axiosClient.get(
                    "business/notifications"
                );

                if (
                    JSON.stringify(data.data) !== JSON.stringify(notifications)
                ) {
                    setNotifications(data.data);
                    setUnreadCount(
                        data.data.filter((notif) => notif.new === 1).length
                    );
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        // Optional: Add polling if needed
        const interval = setInterval(fetchNotifications, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        setOpen(!open);

        // Mark as read when opening
        if (!open && unreadCount > 0) {
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, new: 0 }))
            );

            // API call to mark as read
            axiosClient
                .get("business/notifSetRead")
                .catch((err) => console.error(err));
        }
    };

    const handleAction = (notification) => {
        switch (notification.link) {
            case "verify_request":
                // Handle verification request
                navigate(`/messages/${notification.customer_id}`);
                break;
            case "bid_cancel_confirm":
                // Handle bid cancellation
                handleCancelBid(notification.bid_id);
                break;
            // Add other cases as needed
            default:
                navigate(`/${notification.link}`);
        }
        setOpen(false);
    };

    const handleCancelBid = (bidId) => {
        // Implement your cancellation logic
        console.log("Cancelling bid:", bidId);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "message":
                return <MessageSquare size={16} className="text-blue-500" />;
            case "alert":
                return <AlertTriangle size={16} className="text-yellow-500" />;
            default:
                return <Check size={16} className="text-green-500" />;
        }
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="text-gray-600 hover:text-blue-600 relative"
                onClick={handleToggle}
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md border border-gray-200 z-50 overflow-hidden">
                    <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-medium text-gray-800">
                            Notifications
                        </h3>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No new notifications
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {notifications.map((notification, index) => (
                                    <li
                                        key={index}
                                        className="p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`text-sm ${
                                                        notification.new
                                                            ? "font-medium text-gray-900"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    {notification.text}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {notification.date}
                                                </p>
                                                {/* {notification.link && (
                                                    <div className="mt-2 flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleAction(
                                                                    notification
                                                                )
                                                            }
                                                            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                        >
                                                            {notification.link ===
                                                            "verify_request"
                                                                ? "Agree"
                                                                : "View"}
                                                        </button>
                                                        {notification.link ===
                                                            "verify_request" && (
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/messages/${notification.customer_id}`
                                                                    )
                                                                }
                                                                className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                                                            >
                                                                Message
                                                            </button>
                                                        )}
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-2 border-t border-gray-200 bg-gray-50 text-right">
                            <button
                                onClick={clearAllNotifications}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
