import { useState, useEffect, useRef } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import axiosClient from "../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "../dashboard/Service/msgcontext";
import TujitumeLogo from "../../images/Tujitumelogo.svg";
import { useAlert } from "./AlertContext";

const NotificationBell = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { setdashmsg } = useMessage();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

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

    const startConversation = (customer_id) =>{
        const message = `Hi, thank you for considering investing in my business. Let me know how to best verify this equipment.`; // const sender = Nurul; // Example sender name

        // Set the new message using the context
        setdashmsg(message);

        // Navigate to the messages page
        navigate("/dashboard/messages", {
                            state: { customer_id: customer_id },
        });
    }

//Request Project M./Owner Func.
        const verifyRequestBO = (bid_id) => {
        $.confirm({
            title: false, // Remove the default title to have full control over placement
            content: `
                      <div style="display: flex; align-items: center;">
                            <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                        </div>
                      <p>Do you want to send a request to verify your asset details ?</p>
                    `,
            buttons: {
                confirm: {
                    text: "Yes",
                    btnClass: "btn-success",
                    action: () => {
                        axiosClient
                            .get("business/requestOwnerToVerify/" + bid_id)
                            .then(({ data }) => {
                                console.log(data);
                                if (data.status === 200) {
                                    showAlert("success", data.message);
                                } else {
                                    showAlert("error", data.message);
                                }
                            })
                            .catch((err) => {
                                const response = err.response;
                                console.log(response);
                                showAlert(
                                    "error",
                                    "An error occurred. Please try again."
                                );
                            });
                    },
                },
                cancel: {
                    text: "No",
                    btnClass: "btn-danger",
                    action: () => {},
                },
            },
        });
    };

        // navigateToProjectManager
    const navigateToProjectManager = (bid_id) => {
            let ids = "";
            axiosClient
            .get("FindProjectManagers/" + bid_id)
            .then(({ data }) => {
                if(data.status == 200){
                    Object.entries(data.results).forEach((entry) => {
                    const [index, row] = entry;
                    ids = ids + row.id + ",";
                    });
                    console.log(data.results);
                    if (!ids) ids = 0;

                    sessionStorage.setItem("queryLat", data.lat);
                    sessionStorage.setItem("queryLng", data.lng);

                    navigate(
                    "/serviceResults/" + base64_encode(ids) + "/" + data.loc
                    );
                    if (locationUrl.pathname.includes("serviceResults"))
                        window.scrollTo(0, 0);
                }
                else{
                    console.log(data)
                    showAlert( "error", data.message);
                }
                
            })
            .catch((err) => {
                console.log(err);
            });
    };

        // Cance logic here
    const CancelBid = (id) => {
        $.confirm({
            title: false, // Remove the default title to have full control over placement
            content: `
                    <div style="display: flex; align-items: center;">
                        <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                    </div>
                    <p>Are you sure you want to cancel this bid?</p>
                `,
            buttons: {
                confirm: function () {
                    axiosClient
                        .get("business/remove_active_bids/" + id)
                        .then(({ data }) => {
                            console.log(data); // Log response data
                            if (data.status == 200)
                                showAlert("success", data.message);
                            else showAlert("error", data.message);
                        })
                        .catch((err) => {
                            const response = err.response;
                            console.log(response);
                        });
                },
                cancel: function () {
                    $.alert("You have canceled"); // Alert if canceled
                },
            },
        });
    };


    const AskInvestorToVerify = (bid_id) => {
        $.confirm({
            title: false, // Remove the default title to have full control over placement
            content: `<div style="display: flex; align-items: center;">
                        <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                    </div>
                    <p>Are you sure you want to ask investor to verify instead?</p>`,
            buttons: {
                confirm: function () {
                    axiosClient
                        .get("business/askInvestorToVerify/" + bid_id)
                        .then(({ data }) => {
                            console.log(data); // Log response data
                            if (data.status == 200)
                                showAlert("success", data.message);
                            else showAlert("error", data.message);
                        })
                        .catch((err) => {
                            const response = err.response;
                            console.log(response);
                        });
                },
                cancel: function () {
                    $.alert("You have canceled"); // Alert if canceled
                },
            },
        });
    };

    
//Request Project M./Owner Func.

    

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
                                                
                                                    {notif.link =='verify_request'?(
                                                    <div>
                                                    <button onClick={() =>
                                                        startConversation(notif.customer_id)} className="text-green-700 text-xs hover:text-blue-800">
                                                        Agree
                                                    </button> <br></br>
                                                    <button onClick={() =>
                                                         AskInvestorToVerify(notif.bid_id)} style={{fontSize: '11px'}} className="text-green-700 text-xs hover:text-blue-800">
                                                        Ask Investor To Verify With Project Manager
                                                    </button>
                                                    <br></br>

                                                    </div>
                                                    ):notif.link =='bid_cancel_confirm'?(
                                                    <div>
                                                    <button onClick={() =>
                                                        CancelBid(notif.bid_id)} className="text-green-700 text-xs hover:text-blue-800">
                                                        OK
                                                    </button> <br></br>
                                                    <button onClick={() =>
                                                        navigateToProjectManager(notif.bid_id)} style={{fontSize: '11px'}} className="text-green-700 text-xs hover:text-blue-800">
                                                         Request Project Manager
                                                   to Verify
                                                    </button>

                                                    <button onClick={() =>
                                                        verifyRequestBO(notif.bid_id)} style={{fontSize: '11px'}} className="text-green-700 text-xs hover:text-blue-800">
                                                         Request Business Owner to Verify
                                                    </button>
                                                
                                                    </div>
                                                    ):(

                                                    <Link
                                                    to={`./${notif.link}`}
                                                    onClick={closeDropdown}
                                                    ><button className="text-blue-600 text-xs hover:text-blue-800">
                                                        View More
                                                    </button> &nbsp;
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

                                                    </Link>
                                                    )}

                                                
                                                
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
