import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";
import ReusableTable from "../business/ReusableTable";
import { FaChartLine } from "react-icons/fa";
import TujitumeLogo from "../../../images/Tujitumelogo.svg";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineLoading3Quarters,
} from "react-icons/ai";
const MyInvest = () => {
    const [myInvest, setMyInvest] = useState([]);
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const navigate = useNavigate(); // Use React Router's navigate hook
    const [inputModal, setInputModal] = useState(false); // Modal state

    const [showpending, setShowpending] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [activeFilter, setActiveFilter] = useState("pending"); // Default to "pending"

    useEffect(() => {
        const getInvestments = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/dashhome")
                    .then(({ data }) => {
                        setMyInvest(data.results);
                        // console.log("test data",data);
                    })
                    .catch((err) => {
                        console.error(err);
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
                    axiosClient
                        .get("business/remove_bids/" + id)
                        .then(({ data }) => {
                            console.log(data); // Log response data
                            if (data.status == 200)
                                showAlert("success", data.message);
                            else showAlert("success", data.message);
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
                        .get("business/withdraw_bids") //This is a test api it doesnt work
                        .then(({ data }) => {
                            console.log(data); // Log response data
                            if (data.status == 200)
                                showAlert("success", data.message);
                            else showAlert("success", data.message);
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
    const navigateToProjectManager = () => {
        navigate("#"); // Adjust the path to match your route
    };

    // Modal Toggle Logic for Starting a Conversation
    const toggleModal = () => {
        setInputModal(!inputModal);
    };
    // End of Modal Logic

    // StartConversation
    // Function to handle sending the conversation
    const StartConversation = () => {
        axiosClient
            .get("business/start_conversation") // This is your API request
            .then(({ data }) => {
                console.log(data); // Log the response data
                if (data.status === 200) {
                    showAlert("success", "Your message was sent successfully!"); // Show success alert
                    $.confirm({
                        title: false, // Remove the default title to have full control over placement
                        content: `
                        <div style="display: flex; align-items: center;">
                            <img src="${TujitumeLogo}" alt="Tujitume Logo" style="max-width: 100px; margin-right: 10px;" class="jconfirm-logo">
                        </div>
                        <p>Do you want to start a new conversation?</p>
                    `,
                        buttons: {
                            confirm: function () {
                                navigate("/dashboard/conversation"); // Navigate to the messages page
                            },
                            cancel: function () {
                                toggleModal(); // Close the modal if the user cancels
                            },
                        },
                    });
                } else {
                    showAlert(
                        "error",
                        "Failed to send your message. Please try again."
                    );
                }
            })
            .catch((err) => {
                const response = err.response;
                console.log(response); // Log the error response
                showAlert("error", "An error occurred. Please try again.");
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
                    className="text-gray-600 hover:text-gray-800 focus:outline-none transition duration-200 ease-in-out"
                    aria-expanded={showDropdown}
                    aria-label="Toggle Actions"
                >
                    <BsThreeDots size={20} />
                </button>
                {showDropdown && (
                    <div
                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-10 overflow-hidden"
                        style={{ bottom: "10px" }} // Adjust the bottom space here
                    >
                        <ul className="text-sm text-gray-700">
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
                                    <ul>
                                        <li>
                                            <button
                                                onClick={
                                                    navigateToProjectManager
                                                }
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 transition duration-150 ease-in-out"
                                            >
                                                Verify With A Project<br></br>{" "}
                                                Manager
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={toggleModal}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-yellow-600 transition duration-150 ease-in-out"
                                            >
                                                Verify With A Business <br></br>
                                                Owner
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            {item.status === "Confirmed" &&
                                item.type === "Monetery" && (
                                    <li>
                                        <button
                                            onClick={WithdrawInvestment}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600 transition duration-150 ease-in-out"
                                        >
                                            Withdraw Investment
                                        </button>
                                    </li>
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
        "Contact",
        "Amount",
        "Business Share Request",
        "My Share",
        "Total Shares",
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
        contact: item.contact,
        amount: item.amount,
        "business share request": `${item.share}%`,
        "my share": `${item.myShare.toFixed()}%`,
        "total shares": (
            <p className="text-green-500 font-bold text-center">
                {item.totalShares || 90}{" "}
                {/* Replace 90 with actual default value */}
            </p>
        ),
        status: (
            <p className="text-green-500 font-bold text-center">
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
        <div className="py-4 mt-8 lg:mt-0 px-0 sm:px-[21px]">
            <section className="bg-white border rounded-xl w-full">
                {myInvest.length > 0 ? (
                    <section>
                        {/* Section Title */}
                        <h1 className="text-[#2D3748] ml-6 mt-4 font-semibold text-xl sm:text-2xl">
                            My Investments
                        </h1>

                        {/* Filters */}
                        <div className="flex justify-start ml-6 mt-4 m gap-6 items-center">
                            <h3
                                onClick={() => setActiveFilter("pending")}
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
                                onClick={() => setActiveFilter("confirmed")}
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
                        <div className="whitespace-nowrap justify-center">
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
                                You don't have any investments yet. Please start
                                investing to see your portfolio grow.
                            </p>
                        </div>
                    </section>
                )}
            </section>

            {/* Modal */}
            {inputModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            Start a Conversation
                        </h3>
                        <textarea
                            className="w-full p-4 mt-4 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-green transition duration-200"
                            placeholder="Type your message here..."
                            rows="6"
                        />
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                                onClick={toggleModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green text-white px-6 py-2 rounded-md btn-primary transition duration-200"
                                onClick={StartConversation} // Add functionality for starting the conversation here
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyInvest;
