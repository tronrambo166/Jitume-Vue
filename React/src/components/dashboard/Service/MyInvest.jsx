import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";
import ReusableTable from "../business/ReusableTable";
import { FaChartLine } from "react-icons/fa";
import TujitumeLogo from "../../../images/Tujitumelogo.svg";
import { BsThreeDots } from "react-icons/bs";
import {
    useNavigate,
    useLocation,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useMessage } from "./msgcontext"; // Import the custom hook
import { BarLoader } from "react-spinners";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const MyInvest = () => {
    const locationUrl = useLocation();
    const [myInvest, setMyInvest] = useState([]);
    const [activeInvest, setActiveInvest] = useState([]);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const navigate = useNavigate(); // Use React Router's navigate hook
    const [inputModal, setInputModal] = useState(false); // Modal state
    const { setdashmsg } = useMessage(); // Use the context to update the message
    const [name, setName] = useState("");
    const [activeFilter, setActiveFilter] = useState("pending"); // Default to "pending"
    const [Investname, SetInvestname] = useState("");
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const b_idToVWPM = searchParams.get("b_idToVWPM");
        const b_idToVWBO = searchParams.get("b_idToVWBO");
        const agreetobid = searchParams.get("agreetobid");

        if (agreetobid != null ) {
            if(agreetobid == 'yes')
            showAlert("success", 'Your vote succesfully collected');
            if(agreetobid == 'equipment_released')
            showAlert("success", 'Equipment Released Succesfully!');
        }

        if (b_idToVWPM != null) {
            navigateToProjectManager(base64_decode(b_idToVWPM));
        } else if (b_idToVWBO != null) {
            verifyRequestBO(base64_decode(b_idToVWBO));
        }

        const getInvestments = () => {
            setIsLoading(true);
            setTimeout(() => {
                axiosClient
                    .get("/business/dashhome/" + "myInvest")
                    .then(({ data }) => {
                        setMyInvest(data.pending);
                        setActiveInvest(data.active)
                        console.log("MyINvest", data);
                        //setName(data.user_name);
                        //SetInvestname(data.results[0].name);
                        //setUserId(data.results[0].user_id);
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoading(false);
                    });
            }, 500);
        };
        getInvestments();
    }, []);

    // Cance logic here
    const handleCancel = (id) => {
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
                    setLoading(true);
                    axiosClient
                        .get("business/remove_bids/" + id)
                        .then(({ data }) => {
                             setLoading(false);
                            console.log(data); // Log response data
                            if (data.status == 200)
                                showAlert("success", data.message);
                            else showAlert("success", data.message);
                        })
                        .catch((err) => {
                             setLoading(false);
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
    // End of cancel logic

    // WithdrawInvestment logic here
    const WithdrawInvestment = () => {
        $.confirm({
            title: false, // Remove the default title to have full control over placement
            content: `
                    <div style="display: flex; align-items: center;">
                        <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                    </div>
                    <p>Are you sure you want to withdraw this bid?</p>
                `,
            buttons: {
                confirm: function () {
                    axiosClient
                        .get("business/withdraw_investment") //This is a test api it doesnt work
                        .then(({ data }) => {
                            if (data.status == 200)
                                showAlert("success", data.message);
                            else showAlert("success", data.message);
                            console.log(data); // Log response data
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
    // End of cancel logic

    // navigateToProjectManager
    const navigateToProjectManager = (bid_id) => {
        let ids = "";
        axiosClient
            .get("FindProjectManagers/" + bid_id)
            .then(({ data }) => {
                if (data.status == 200) {
                    Object.entries(data.results).forEach((entry) => {
                        const [index, row] = entry;
                        ids = ids + row.id + ",";
                    });
                    console.log(data.results);
                    if (!ids) ids = 0;

                    sessionStorage.setItem("queryLat", data.lat);
                    sessionStorage.setItem("queryLng", data.lng);

                    navigate(
                        "/projectManagers/" + base64_encode(ids) + "/" + data.loc 
                        + "/" + bid_id
                    );
                    if (locationUrl.pathname.includes("serviceResults"))
                        window.scrollTo(0, 0);
                } else console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Modal Toggle Logic for Starting a Conversation

    const StartConvorsation = (owner_id) => {
        const message = `Could you please confirm the accuracy of the following asset details for ${Investname}:`; // const sender = Nurul; // Example sender name
        const sender = name;
        const SenderuserId = userId;

        // Set the new message using the context

        const newMsg = `Hello, I'm ${sender}, ${message} (User ID: ${SenderuserId})`; // Optionally include userId in the message

        setdashmsg(newMsg);

        // Navigate to the messages page
        navigate("/dashboard/messages");
    };

    // End of Modal Logic

    // StartConversation
    // Function to handle sending the conversation
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

    // End of conversation Logic

    // Dropdown ref
    const ActionDropdown = ({ item, handleCancel }) => {
        const [showDropdown, setShowDropdown] = useState(false);
        const dropdownRef = useRef(null);

        const toggleDropdown = () => setShowDropdown((prev) => !prev);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target)
                ) {
                    setShowDropdown(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none transition duration-200 ease-in-out flex items-center gap-2"
                    aria-expanded={showDropdown}
                    aria-label="Toggle Actions"
                >
                    {loading ? (
                        <AiOutlineLoading3Quarters
                            className="animate-spin text-gray-600"
                            size={20}
                        />
                    ) : (
                        <BsThreeDots size={20} />
                    )}
                </button>
                {showDropdown && (
                    <div
                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-55 z-10 overflow-hidden"
                        style={{ bottom: "10px" }} // Adjust the bottom space here
                    >
                        <ul className="text-sm text-gray-700">
                            {item.status === "Pending" && (
                                <li>
                                    <button
                                        onClick={() =>
                                            handleCancel(item.bid_id)
                                        }
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 transition duration-150 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                </li>
                            )}
                            {item.status === "Confirmed" &&
                                item.type === "Asset" && (
                                    <ul className="divide-y divide-gray-200 bg-white shadow rounded-lg">
                                        <li>
                                            <button
                                                onClick={() =>
                                                    navigateToProjectManager(
                                                        item.bid_id
                                                    )
                                                }
                                                className="flex items-center w-full text-left px-5 py-3 hover:bg-gray-50 text-green-800 transition duration-150 ease-in-out"
                                            >
                                                <span className="mr-2">
                                                    <i className="fas fa-briefcase text-green-500"></i>
                                                </span>
                                                <span>
                                                    Verify With A Project
                                                    Manager
                                                </span>
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                onClick={() =>
                                                    verifyRequestBO(item.bid_id)
                                                }
                                                className="flex items-center w-full text-left px-5 py-3 hover:bg-gray-50 text-slate-600 transition duration-150 ease-in-out"
                                            >
                                                <span className="mr-2">
                                                    <i className="fas fa-user-check text-blue-500"></i>
                                                </span>
                                                <span>
                                                    Verify With A Business Owner
                                                </span>
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                onClick={WithdrawInvestment}
                                                className="flex items-center w-full text-left px-5 py-3 hover:bg-gray-50 text-pink-700 transition duration-150 ease-in-out"
                                            >
                                                <span className="mr-2">
                                                    <i className="fas fa-money-bill-wave text-pink-500"></i>
                                                </span>
                                                <span>Withdraw Investment</span>
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            {item.status === "Confirmed" &&
                                item.type === "Monetary" && (
                                    <ul>
                                        <li>
                                            <button
                                                onClick={WithdrawInvestment}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-pink-700 transition duration-150 ease-in-out"
                                            >
                                                Withdraw Investment
                                            </button>
                                        </li>

                                        <li>
                                            <Link
                                                to={`/business-milestones/${btoa(
                                                    btoa(item.id)
                                                )}`}
                                                className="block px-4 py-2 hover:bg-gray-100 transition duration-150 ease-in-out"
                                            >
                                                View Milestones
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                        </ul>
                    </div>
                )}
            </div>
        );
    };
    // End of Dropdown

    // Define headers for ReusableTable
    const headers = [
        "Name",
        "Category",
        "Value Needed",
        "Type",
        "Amount",
        "Business Share Request",
        "My Share",
        // "Total Shares",
        "Status",
        "Action",
    ];

    // switch logic

    // Filter the investments based on the selected status
    const filteredInvestments = myInvest.filter((investment) => {
        const status = investment.status.toLowerCase();
        if (activeFilter === "pending") {
            return status === "pending";
        } else if (activeFilter === "confirmed") {
            return status === "confirmed";
        }
        return true; // Default case (if needed)
    });

    console.log(filteredInvestments);

    // Map the filtered investments to the table data format
    const tableData = filteredInvestments.map((item) => ({
        name: item.name,
        category: item.category,
        "value needed": item.investment_needed,
        type: item.type == "Asset" ? "Equipment" : item.type,
        amount: item.amount,
        "business share request": `${item.share}%`,
        "my share": `${item.myShare.toFixed(2)}%`,
        // "total shares": (
        //     <p className="text-green-500 font-bold text-center">
        //         {item.share || 90}{" "}
        //         {/* Replace 90 with actual default value */}
        //     </p>
        // ),
        status: (
            <p className="text-green-700 uppercase text-center">
                {item.status}
            </p>
        ),
        action: (
            // <div className="flex space-x-2">
            //     {/* View Milestones Button */}
            //     <Link to={`/business-milestones/${btoa(btoa(item.id))}`}>
            //         <button className="text-yellow-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
            //             View milestones
            //         </button>
            //     </Link>
            //     {/* Cancel Button */}
            //     {item.status =='Pending' &&
            //     <button
            //         onClick={() => handleCancel(item.bid_id)} // Replace with your cancel logic
            //         className="text-black border border-red-500 hover:bg-red-100 rounded-lg py-1 px-3 text-xs"
            //     >
            //         Cancel
            //     </button>
            //     }
            // </div>
            <ActionDropdown item={item} handleCancel={handleCancel} />
        ),
    }));

    // End

    return (
        <div className="py-4 mt-8 lg:mt-0 px-0 sm:px-[21px] overflow-x-auto  dynamic-max-width">
            {" "}
            <section className="bg-white border  pb-2 pl-1 pr-2 rounded-xl  w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <BarLoader color="#38a169" width={150} />
                        <p className="text-gray-600 mt-4">
                            Loading investments, please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        {myInvest.length > 0 ? (
                            <section>
                                {/* Section Title */}
                                <h1 className="text-[#2D3748] ml-6 mt-4 font-semibold text-xl sm:text-2xl">
                                    My Investments
                                </h1>

                                {/* Filters */}
                                <div className="flex justify-start ml-6 mt-4 m gap-6 items-center">
                                    <h3
                                        onClick={() =>
                                            setActiveFilter("pending")
                                        }
                                        className={`text-sm font-light cursor-pointer border-b-2 ${
                                            activeFilter === "pending"
                                                ? "text-green border-green"
                                                : "text-gray-500 border-transparent"
                                        } transition-all`}
                                        aria-label="Pending Investments Filter"
                                    >
                                        Pending Investments
                                    </h3>
                                    <h3
                                        onClick={() =>
                                            setActiveFilter("confirmed")
                                        }
                                        className={`text-sm font-light cursor-pointer border-b-2 ${
                                            activeFilter === "confirmed"
                                                ? "text-green border-green"
                                                : "text-gray-500 border-transparent"
                                        } transition-all`}
                                        aria-label="Active Investments Filter"
                                    >
                                        Active Investments
                                    </h3>
                                </div>

                                {/* Table */}
                                <div className="whitespace-nowrap scroll-thin overflow-x-auto max-w-full">
                                    <ReusableTable
                                        headers={headers}
                                        data={tableData}
                                        rowsPerPage={5}
                                        tableId="myInvestTable"
                                    />
                                </div>
                            </section>
                        ) : (
                            /* No Investments Section */
                            <section className="bg-white border border-gray-300 rounded-xl w-full py-6 px-6">
                                <div className="flex flex-col items-center">
                                    <FaChartLine
                                        size={30}
                                        className="text-gray-500 mb-4"
                                        aria-hidden="true"
                                    />
                                    <h3 className="text-[#2D3748] font-semibold text-xl sm:text-l mb-4">
                                        No Investments Found
                                    </h3>
                                    <p className="text-gray-600 text-center">
                                        You don't have any investments yet.
                                        Please start investing to see your
                                        portfolio grow.
                                    </p>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default MyInvest;
