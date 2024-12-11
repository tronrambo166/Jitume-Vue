import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import EditModal from "./EditModal";
import { useAlert } from "../../partials/AlertContext";

const MyBusinesses = () => {
    const navigate = useNavigate();
    const [business, setBusiness] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        const getBusinesses = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/bBQhdsfE_WWe4Q-_f7ieh7Hdhf3E_")
                    .then(({ data }) => {
                        setBusiness(data.business);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 500);
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
                        "Milestone not found. Redirecting to add milestone page."
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

    return (
        <div className="py-4">
            <section className="bg-white border mt-4 rounded-xl w-full px-4 py-6 sm:px-8">
                <h1 className="text-[#2D3748] font-semibold text-xl sm:text-2xl mb-6">
                    My Businesses
                </h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr className="text-gray-500">
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="pl-[96px] py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Amount Required
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {business.length > 0 ? (
                                business.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 flex items-center space-x-4">
                                            <img
                                                className="w-10 h-10 rounded-lg object-cover"
                                                src={`../${item.image}`}
                                                alt={item.name}
                                            />
                                            <div className=" text-sm ">
                                                <div className="font-medium">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pl-[95px] py-2 text-sm">
                                            {item.category}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {item.details}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            ${item.investment_needed}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {item.contact}
                                        </td>
                                        <td className="px-4 py-2 text-center text-sm">
                                            <div className="flex items-center justify-center space-x-2">
                                                {!item.active && (
                                                    <button
                                                        onClick={() =>
                                                            handleActivate(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs hover:bg-green-100"
                                                        aria-label="Activate"
                                                    >
                                                        Activate
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    className="text-gray-900 border border-gray-500 rounded-lg py-1 px-3 text-xs hover:bg-gray-200"
                                                    aria-label="Edit"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-red-500 border border-gray-500 rounded-lg py-1 px-3 text-xs hover:bg-red-100"
                                                    aria-label="Delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-6 text-center text-gray-500 text-sm"
                                    >
                                        No businesses available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

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
