import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import axiosClient from "../../../axiosClient";
import EditModal from "./EditModal";
import { useAlert } from "../../partials/AlertContext";
import ReusableTable from "./ReusableTable";

const MyBusinesses = () => {
    const navigate = useNavigate();
    const [business, setBusiness] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        const getBusinesses = () => {
            axiosClient
                .get("/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf3E_")
                .then(({ data }) => {
                    setBusiness(data.business);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getBusinesses();
    }, []);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        axiosClient
            .get(`/business/delete_listing/${id}`)
            .then(({ data }) => {
                if (data.status === 200) {
                    showAlert("success", "Listing deleted successfully.");
                    setBusiness(business.filter((item) => item.id !== id));
                } else {
                    showAlert(
                        "error",
                        "Failed to delete listing. Please try again."
                    );
                }
            })
            .catch(() => {
                showAlert("error", "An error occurred. Please try again.");
            });
    };

    const handleActivate = (id) => {
        axiosClient
            .get(`/business/activate_milestone/${id}`)
            .then(({ data }) => {
                if (data.status === 200) {
                    showAlert("success", data.message);
                    navigate(0); // Refresh the page
                } else if (data.status === 404) {
                    showAlert(
                        "error",
                        "Please add one or more milestones that cover full amount needed. Redirecting to add milestone page."
                    );
                    setTimeout(() => {
                        navigate(`/dashboard/add-milestone`);
                    }, 3000);
                }
            })
            .catch(() => {
                showAlert("error", "An error occurred. Please try again.");
            });
    };

    const handleSave = () => {
        setBusiness(
            business.map((item) => (item.id === editItem.id ? editItem : item))
        );
        setShowModal(false);
    };

    const ActionDropdown = ({ item }) => {
        const [showDropdown, setShowDropdown] = useState(false);
        const dropdownRef = React.useRef(null);

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
                    className="p-2 rounded-full hover:bg-gray-200"
                >
                    <BsThreeDots size={20} />
                </button>

                {showDropdown && (
                    <div className="absolute right-0 z-50 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {!item.active && (
                            <button
                                onClick={() => {
                                    handleActivate(item.id);
                                    setShowDropdown(false);
                                }}
                                className="block w-full px-4 py-2 text-left text-green-500 hover:bg-gray-100"
                            >
                                Activate
                            </button>
                        )}
                        <button
                            onClick={() => {
                                handleEdit(item);
                                setShowDropdown(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                handleDelete(item.id);
                                setShowDropdown(false);
                            }}
                            className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const headers = [
        "Name",
        "Category",
        "Details",
        "Amount Required",
        "Contact",
        "Action",
    ];

    const tableData = business.map((item) => ({
        name: (
            <div className="flex items-center space-x-4">
                <img
                    className="w-10 h-10 rounded-lg object-cover"
                    src={item.image}
                    alt={item.name}
                />
                <div className="font-medium">{item.name}</div>
            </div>
        ),
        category: <div className="pl-[19px]">{item.category}</div>,
        details: (
            <div className="pl-[40px] truncate max-w-[200px]">
                {item.details}
            </div>
        ),

        // Add padding to move it right
        "amount required": (
            <div className="pl-[12px]">{`$${item.investment_needed.toLocaleString()}`}</div>
        ),
        contact: item.contact,
        action: <ActionDropdown item={item} />,
    }));

    return (
        <div className="py-6 mt-6 lg:mt-0 px-0  sm:px-[21px] space-y-6">
            {/* Adjusted padding and added vertical spacing */}
            <section className="bg-white border border-gray-300 rounded-xl w-full">
                {/* Added padding, border and rounded corners for all edges */}
                <h1 className="text-[#2D3748] font-semibold text-xl ml-6 mt-6 sm:text-2xl mb-4">
                    My Businesses
                </h1>
                <ReusableTable
                    headers={headers}
                    data={tableData}
                    rowsPerPage={5}
                    tableId="businessTable" // Pass unique table ID
                />
            </section>

            {/* Edit Modal */}
            {showModal && (
                <EditModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    editItem={editItem}
                    setEditItem={setEditItem}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default MyBusinesses;
