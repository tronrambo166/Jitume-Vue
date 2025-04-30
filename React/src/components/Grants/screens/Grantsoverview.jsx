import { useStateContext } from "../../../contexts/contextProvider";
import axiosClient from "../../../axiosClient";
import React, { useState, useEffect } from "react";
import {
    Outlet,
    Link,
    useLocation,
    useNavigate,
    Routes,
    Route,
} from "react-router-dom";
import { UserOutlined, BellOutlined, LogoutOutlined } from "@ant-design/icons";

import {
    Briefcase,
    PlusCircle,
    Search,
    Home,
    DollarSign,
    TrendingUp,
    Award,
    Settings,
    LogOut,
    Menu,
    Clock,
    CreditCard,
    Bell,
    User,
    ChevronDown,
    BarChart2,
    Users,
    Bookmark,
    FileText,
    Video,
    MessageSquare,
    Grid,
    X,
} from "lucide-react";
import GrantApplicationModal from "../Utils/Modals/Newgrant";
// import OfferGrantModal from "../Utils/Modals/AddnewGrant";
import TujitumeLogo from "../../../images/Tujitumelogo.svg";

import NotificationDropdown from "../components/NotificationDropdown"; // adjust path if needed
import OfferGrantModal from "../Utils/Modals/AddnewGrant";




// Toast Notification Component
const ToastNotification = ({ message, type = "info", onClose }) => {
    const bgColor = {
        success: "bg-green-100 border-green-300",
        error: "bg-red-100 border-red-300",
        warning: "bg-yellow-100 border-yellow-300",
        info: "bg-green-100 border-green-300",
    }[type];

    const textColor = {
        success: "text-green-700",
        error: "text-red-700",
        warning: "text-yellow-700",
        info: "text-green-700",
    }[type];

    const icon = {
        success: <CheckCircle className="text-green-500" size={18} />,
        error: <XCircle className="text-red-500" size={18} />,
        warning: <AlertTriangle className="text-yellow-500" size={18} />,
        info: <Info className="text-green-500" size={18} />,
    }[type];

    return (
        <div
            className={`fixed top-4 right-4 z-50 border rounded-lg p-4 shadow-lg ${bgColor} ${textColor} flex items-start max-w-sm`}
        >
            <div className="mr-3 mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-gray-500 hover:text-gray-700"
            >
                <X size={18} />
            </button>
        </div>
    );
};

// Toast Context and Provider
const ToastContext = React.createContext();

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info", duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
                {toasts.map((toast) => (
                    <ToastNotification
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

// Icons needed for toast notifications
const CheckCircle = (props) => (
    <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const XCircle = (props) => (
    <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

const AlertTriangle = (props) => (
    <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const Info = (props) => (
    <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

// Shared Components
const Navigation = {
    Sidebar: ({ isMobile, onClose }) => {
        const location = useLocation();
        const [openMenus, setOpenMenus] = useState({});
        const { token, setToken } = useStateContext();
        const navigate = useNavigate();
        const { addToast } = useToast();

        useEffect(() => {
            if (!token) {
                navigate("/");
            }
        }, [token, navigate]);

        // Initialize open menus based on current path
        useEffect(() => {
            const initialOpenState = {};
            navItems.forEach((item) => {
                if (item.children) {
                    initialOpenState[item.to] = location.pathname.startsWith(
                        item.to
                    );
                }
            });
            setOpenMenus(initialOpenState);
        }, [location.pathname]);

        const toggleMenu = (to) => {
            setOpenMenus((prev) => ({
                ...prev,
                [to]: !prev[to],
            }));
        };

        const handleLogout = () => {
            setToken(null);
            setUser(null);
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("USER");
            addToast("Logged out successfully", "success");
            navigate("/");
        };

        const NavItem = ({
            icon: Icon,
            label,
            to,
            hasChildren,
            isActive,
            isLogout = false,
        }) => (
            <div>
                {isLogout ? (
                    <button
                        onClick={handleLogout}
                        className={`
              flex items-center px-4 py-3 rounded-lg transition-colors
              w-full text-left
              hover:bg-gray-100 text-gray-700 hover:text-green-700
            `}
                    >
                        <Icon className="mr-3" size={20} />
                        <span className="flex-1">{label}</span>
                    </button>
                ) : (
                    <Link
                        to={to}
                        className={`
              flex items-center px-4 py-3 rounded-lg transition-colors
              ${
                  isActive
                      ? "bg-gray-100 text-green-700"
                      : "hover:bg-gray-100 text-gray-700 hover:text-green-700"
              }
            `}
                        onClick={(e) => {
                            if (isMobile && !hasChildren) onClose();
                            if (hasChildren) {
                                e.preventDefault();
                                toggleMenu(to);
                            }
                        }}
                    >
                        <Icon className="mr-3" size={20} />
                        <span className="flex-1">{label}</span>
                        {hasChildren && (
                            <ChevronDown
                                className={`ml-2 transition-transform duration-200 ${
                                    openMenus[to] ? "rotate-180" : ""
                                }`}
                                size={16}
                            />
                        )}
                    </Link>
                )}
                {hasChildren && openMenus[to] && (
                    <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
                        {navItems
                            .find((item) => item.to === to)
                            .children.map((child) => (
                                <SubItem
                                    key={child.to}
                                    label={child.label}
                                    to={child.to}
                                    isActive={location.pathname === child.to}
                                    onClose={onClose}
                                />
                            ))}
                    </div>
                )}
            </div>
        );

        const SubItem = ({ label, to, isActive, onClose }) => (
            <Link
                to={to}
                className={`
          block px-3 py-2 text-sm rounded transition-colors
          ${
              isActive
                  ? "bg-gray-100 text-green-700"
                  : "hover:bg-gray-100 text-gray-600 hover:text-green-700"
          }
        `}
                onClick={isMobile ? onClose : undefined}
            >
                {label}
            </Link>
        );
        const { user, setUser } = useStateContext();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchUserData = async () => {
                setLoading(true);

                try {
                    const { data } = await axiosClient.get("/checkAuth");
                    setUser(data.user);
                    setLoading(false);

                    console.log("My dara :", data);

                    if (data.user.investor == 1) navigate("/dashboard");
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }, []);
        console.log("user", user);

        const navItems = [
            ...(user?.investor
                ? [
                      {
                          icon: Home,
                          label: "Dashboard",
                          to: "/Dashboard",
                          exact: true,
                      },
                  ]
                : []),
            // Hide if user.investor === 3
            ...(user?.investor !== 3
                ? [
                      {
                          icon: Briefcase,
                          label: "Grants Funding",
                          to: "/Dashboard/grants",
                          children: [
                              //   {
                              //       label: "Discover Grants",
                              //       to: "/grants-overview/grants/discover",
                              //   },
                              ...(user?.investor
                                  ? [
                                        {
                                            label: "Add New Grants",
                                            to: "/Dashboard/grants/discover",
                                        },
                                        {
                                            label: "Pitches",
                                            to: "/Dashboard/pitch",
                                        },
                                    ]
                                  : [
                                        {
                                            label: "Apply for Grant",
                                            to: "/Dashboard/grants/discover",
                                        },
                                    ]),
                          ],
                      },
                  ]
                : []),
            // Hide if user.investor === 2
            ...(user?.investor !== 2
                ? [
                      {
                          icon: CreditCard,
                          label: "Investment Funding",
                          to: "/Dashboard/funding",
                          children: [
                              ...(user?.investor
                                  ? [
                                        {
                                            label: "Add New Investment",
                                            to: "/Dashboard/funding/investments",
                                        },
                                        {
                                            label: "Pitches",
                                            to: "/Dashboard/capital-pitch",
                                        },
                                    ]
                                  : [
                                        {
                                            label: "Apply for Investment",
                                            to: "/Dashboard/funding/investments",
                                        },
                                    ]),
                          ],
                      },
                  ]
                : []),

            ...(user?.investor
                ? [
                      {
                          icon: BarChart2,
                          label: "Analytics",
                          to: "/Dashboard/impact",
                          children: [
                              {
                                  label: "Metrics Dashboard",
                                  to: "/Dashboard/analytics",
                              },
                          ],
                      },
                      {
                          icon: Users,
                          label: "Profile",
                          to: "/Dashboard/network",
                          children: [
                              {
                                  label: "Profile",
                                  to: "/Dashboard/profile",
                              },
                          ],
                      },
                      {
                          icon: Clock,
                          label: "Office Hours",
                          to: "/Dashboard/office-hours",
                      },
                      {
                          icon: Settings,
                          label: "Schedule",
                          to: "/Dashboard/settings",
                          children: [
                              {
                                  label: "Profile",
                                  to: "/Dashboard/settings/profile",
                              },
                              {
                                  label: "Notification.php",
                                  to: "/Dashboard/settings/notifications",
                              },
                              {
                                  label: "Security",
                                  to: "/Dashboard/settings/security",
                              },
                          ],
                      },
                  ]
                : []),
        ].filter(Boolean); // Remove any undefined entries
        return (
            <>
                <div
                    className={`
        fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
                >
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-2">
                            {/* Logo - Add your logo import and img tag if needed */}
                            <h2 className="text-2xl font-bold text-green-600">
                                Tujitume
                            </h2>
                            {/* <div className="flex items-center justify-between p-2">
                                <Link className="flex items-center" to="/">
                                    <img
                                        src={TujitumeLogo}
                                        alt="Logo"
                                        className="w-[120px] transition-transform duration-300"
                                    />
                                </Link>
                            </div> */}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {user.investor === 2
                                ? "Impact funding for African innovators"
                                : user.investor === 3
                                ? "Investment opportunities across Africa"
                                : "Your gateway to growth capital"}
                        </p>
                    </div>
                    <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-120px)]">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.to}
                                icon={item.icon}
                                label={
                                    <span
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "inline-block",
                                            maxWidth: "100%",
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                }
                                to={item.to}
                                hasChildren={!!item.children}
                                isActive={
                                    item.exact
                                        ? location.pathname === item.to
                                        : location.pathname.startsWith(item.to)
                                }
                            />
                        ))}
                        <div className="pt-1 mt-2 text-green-500 border-t">
                            <NavItem
                                icon={LogOut}
                                label="Logout"
                                to="/logout"
                                isActive={location.pathname === "/logout"}
                                hasChildren={false}
                                isLogout={true}
                            />
                        </div>
                    </nav>
                </div>
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <img
                                src={TujitumeLogo}
                                alt="Tujitume Logo"
                                className="w-32 h-auto"
                            />
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
                        </div>
                    </div>
                )}
            </>
        );
    },

    TopNavigation: () => {
        const [isProfileOpen, setIsProfileOpen] = useState(false);
        const profileRef = React.useRef(null);
        const { token, setToken, user } = useStateContext();
        const [GetuserRole, setGetuserRole] = useState(null);
        const navigate = useNavigate();
        const { addToast } = useToast();

        // useEffect(() => {
        //   if (user.incestor) {
        //     navigate('/');
        //   }
        // }, [token, navigate]);

        // console.log("user",user)

        // Close profile dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (
                    profileRef.current &&
                    !profileRef.current.contains(event.target)
                ) {
                    setIsProfileOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        const handleLogout = () => {
            setToken(null);
            setUser(null);
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("USER");
            addToast("Logged out successfully", "success");
            navigate("/");
        };

        return (
            <div className="bg-white shadow-sm p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-full md:w-64"
                        />
                        <Search
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4" ref={profileRef}>
                    <NotificationDropdown />

                    <button
                        className="flex items-center space-x-2 text-gray-700 hover:text-green-700 relative"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="flex items-center space-x-2 text-gray-700 hover:text-green-700 relative">
                            <div className="flex flex-col items-end">
                                <span className="hidden md:inline text-sm font-medium">
                                    {user?.fname || "User"} {user?.lname || ""}
                                </span>
                                <span className="hidden md:inline text-xs text-gray-500">
                                    {user?.email || ""}
                                </span>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${
                                            user?.fname || "User"
                                        }+${
                                            user?.lname || ""
                                        }&background=random&length=1&size=64`}
                                        alt="Profile"
                                        className="w-full h-full"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Dropdown positioned directly below */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg p-2 w-56 z-50 border border-gray-200">
                                <div className="flex items-center px-3 py-3 border-b border-gray-100 gap-3">
                                    <img
                                        src={
                                            user?.image ||
                                            `https://ui-avatars.com/api/?name=${
                                                user?.investor
                                                    ? user.fname
                                                    : `${user.fname}+${user.lname}`
                                            }&background=random&size=128`
                                        }
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                        alt="Profile"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {user?.fname || "User"}
                                            {!user?.investor &&
                                                user?.lname &&
                                                ` ${user.lname}`}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email || "No email provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 mt-2">
                                    {user?.investor && (
                                        <Link
                                            to="/grants-overview/profile"
                                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                        >
                                            <UserOutlined className="mr-2 text-base" />
                                            My Profile
                                        </Link>
                                    )}

                                    <Link
                                        to="/grants-overview/settings/notifications"
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <BellOutlined className="mr-2 text-base" />
                                        Notifications
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                                    >
                                        <LogoutOutlined className="mr-2 text-base" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        );
    },

    Breadcrumbs: () => {
        const location = useLocation();
        const navigate = useNavigate();
        const pathnames = location.pathname.split("/").filter((x) => x);

        return (
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link
                    to="/"
                    className="text-gray-500 hover:text-green-600 flex items-center"
                >
                    <Home className="mr-1" size={16} />
                    Home
                </Link>
                <Link
                    to="/grants-overview"
                    className="text-gray-500 hover:text-green-600 flex items-center"
                >
                    <Grid className="mr-1" size={16} />
                    Overview
                </Link>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames
                        .slice(0, index + 1)
                        .join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    const displayName = name
                        .replace(/-/g, " ")
                        .replace("grantsoverview", "");

                    return (
                        <span key={routeTo} className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            {isLast ? (
                                <span className="text-green-600 capitalize">
                                    {displayName}
                                </span>
                            ) : (
                                <Link
                                    to={routeTo}
                                    className="text-gray-500 hover:text-green-600 capitalize"
                                >
                                    {displayName}
                                </Link>
                            )}
                        </span>
                    );
                })}
            </div>
        );
    },
};

// Main Layout Component
const GrantsOverview = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const { token, user } = useStateContext();
    const navigate = useNavigate();

    const { addToast } = useToast();

    const toggleOfferModal = () => {
      setIsOfferModalOpen(prev => !prev);
    };
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const toggleApplicationModal = () => {
        setIsApplicationModalOpen((prev) => !prev);
    };

    // const toggleOfferModal = () => {
    //     setIsOfferModalOpen((prev) => !prev);
    // };

    const location = useLocation();


    const sidebarRef = React.useRef(null);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.addEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    if (!token) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div ref={sidebarRef}>
                <Navigation.Sidebar
                    isMobile={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-0 md:ml-64 overflow-y-auto transition-all duration-300">
                {/* Mobile Header */}
                <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu />
                    </button>
                    <div className="flex items-center">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg mr-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-green-600">
                            Tujitume
                        </h1>
                    </div>
                </div>

                {/* Top Navigation */}
                <Navigation.TopNavigation />

                <div className="p-6 bg-gray-50 min-h-screen">
    {/* Header Section */}
    <div className="mb-6">
        <Navigation.Breadcrumbs />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
            {/* Left side - Title and description */}
            <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <Briefcase className="mr-3 text-black" />
                    {user.investor === 2
                        ? "Grant Funding Dashboard"
                        : user.investor === 3
                        ? "Investment Capitals Dashboard"
                        : "Entrepreneur Dashboard"}
                </h1>
                <div className="text-gray-500 mt-2">
                    {user.investor === 2
                        ? "Track your funding applications and matches"
                        : user.investor === 3
                        ? "Discover and negotiate investment opportunities"
                        : "Explore and manage grant opportunities"}
                </div>
            </div>

            {/* Right side - Button (only for investor 2) */}
            {user.investor === 2 && location.pathname !== "/Dashboard/grants/discover" && (
  <button
    onClick={toggleOfferModal}
    className="px-4 py-2 bg-gradient-to-r from-green-700 to-yellow-500
    text-white font-medium rounded-md hover:brightness-110
    transition-all duration-200 flex items-center gap-2
    shadow-md hover:shadow-green-200/30 active:scale-[0.98]"  >
    <PlusCircle className="mr-2" />
    Add New Grant
  </button>
)}

        </div>
    </div>

    {/* Main Content Area */}
    <div className="">
        <Outlet />
    </div>

    {/* Modal */}
    {isOfferModalOpen && <OfferGrantModal onClose={toggleOfferModal} />}
</div>
            </div>

            {/* Modal Components */}
            {isApplicationModalOpen && (
                <GrantApplicationModal
                    isOpen={isApplicationModalOpen}
                    onClose={toggleApplicationModal}
                    onSubmit={(formData) => {
                        console.log("Grant application submitted:", formData);
                        toggleApplicationModal();
                    }}
                />
            )}

            {/* {isOfferModalOpen && (
        <OfferGrantModal
          isOpen={isOfferModalOpen}
          onClose={toggleOfferModal}
          onSubmit={(formData) => {
            console.log('Grant offer submitted:', formData);
            toggleOfferModal();
          }}
        />
      )} */}
              {isOfferModalOpen && <OfferGrantModal onClose={toggleOfferModal} />}

        </div>

    );
};

// Page Components (remain exactly the same as before)
const DashboardHome = () => {
    const { token } = useStateContext();
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const statsCards = [
        {
            icon: <Award className="text-purple-500" />,
            title: "Total Grants Applied",
            value: "12",
            color: "bg-purple-50",
        },
        {
            icon: <DollarSign className="text-green-500" />,
            title: "Total Funding Received",
            value: "$225,000",
            color: "bg-green-50",
        },
        {
            icon: <TrendingUp className="text-indigo-500" />,
            title: "Success Rate",
            value: "75%",
            color: "bg-indigo-50",
        },
    ];

    const grants = [
        {
            id: 1,
            title: "Agricultural Innovation Grant",
            amount: 50000,
            deadline: "May 30, 2024",
            status: "Open",
        },
        {
            id: 2,
            title: "Renewable Energy Startup Fund",
            amount: 75000,
            deadline: "June 15, 2024",
            status: "Upcoming",
        },
        {
            id: 3,
            title: "Tech for Social Impact",
            amount: 100000,
            deadline: "April 22, 2024",
            status: "Closed",
        },
    ];

    const GrantCard = ({ title, amount, deadline, status }) => (
        <div
            className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => addToast(`Clicked on ${title} grant`, "info")}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <span
                    className={`px-2 py-1 rounded-full text-xs ${
                        status === "Open"
                            ? "bg-green-100 text-green-700"
                            : status === "Closed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {status}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                    <DollarSign className="mr-2 text-green-500" size={16} />
                    <span className="text-sm text-gray-600">
                        ${amount.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center">
                    <Clock className="mr-2 text-indigo-500" size={16} />
                    <span className="text-sm text-gray-600">{deadline}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                {statsCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.color} rounded-lg p-4 flex items-center space-x-4`}
                        onClick={() =>
                            addToast(`Viewing ${card.title}`, "info")
                        }
                    >
                        <div className="p-3 rounded-full bg-white">
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                {card.title}
                            </p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {card.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Grants Listing */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Recent Grant Opportunities
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {grants.map((grant) => (
                        <GrantCard
                            key={grant.id}
                            title={grant.title}
                            amount={grant.amount}
                            deadline={grant.deadline}
                            status={grant.status}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const GrantsList = () => {
    const { token } = useStateContext();
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const grants = [
        {
            id: 1,
            title: "Agriculturals Innovation Grant",
            organization: "Green Future Foundation",
            amount: 50000,
            deadline: "May 30, 2024",
            status: "Open",
        },
        {
            id: 2,
            title: "Renewable Energy Startup Fund",
            organization: "Sustainable Tech Ventures",
            amount: 75000,
            deadline: "June 15, 2024",
            status: "Upcoming",
        },
        {
            id: 3,
            title: "Tech for Social Impact",
            organization: "Digital Empowerment Network",
            amount: 100000,
            deadline: "April 22, 2024",
            status: "Closed",
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Available Grants
            </h1>
            <div className="space-y-4">
                {grants.map((grant) => (
                    <div
                        key={grant.id}
                        className="bg-white border border-gray-100 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer"
                        onClick={() =>
                            addToast(`Selected ${grant.title}`, "info")
                        }
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {grant.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {grant.organization}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                                <div className="flex items-center">
                                    <DollarSign
                                        className="mr-2 text-green-500"
                                        size={16}
                                    />
                                    <span className="text-sm text-gray-600">
                                        ${grant.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Clock
                                        className="mr-2 text-indigo-500"
                                        size={16}
                                    />
                                    <span className="text-sm text-gray-600">
                                        {grant.deadline}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${
                                grant.status === "Open"
                                    ? "bg-green-100 text-green-700"
                                    : grant.status === "Closed"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {grant.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const GrantApplication = () => {
    const { token } = useStateContext();
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const [formData, setFormData] = useState({
        title: "",
        organization: "",
        description: "",
        amount: "",
        category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        addToast("Grant application submitted successfully!", "success");
        console.log("Grant Application Submitted", formData);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Apply for a Grant
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Grant Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Organization
                    </label>
                    <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Requested Amount
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="energy">Renewable Energy</option>
                            <option value="technology">Technology</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                    >
                        Submit Grant Application
                    </button>
                </div>
            </form>
        </div>
    );
};

// Wrap the exports with ToastProvider
const GrantsOverviewWithToast = () => (
    <ToastProvider>
        <GrantsOverview />
    </ToastProvider>
);

const DashboardHomeWithToast = () => (
    <ToastProvider>
        <DashboardHome />
    </ToastProvider>
);

const GrantsListWithToast = () => (
    <ToastProvider>
        <GrantsList />
    </ToastProvider>
);

const GrantApplicationWithToast = () => (
    <ToastProvider>
        <GrantApplication />
    </ToastProvider>
);

export {
    GrantsOverviewWithToast as GrantsOverview,
    DashboardHomeWithToast as DashboardHome,
    GrantsListWithToast as GrantsList,
    GrantApplicationWithToast as GrantApplication,
    ToastProvider,
    useToast,
};
