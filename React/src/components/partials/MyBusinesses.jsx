import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axiosClient";
import EditModal from "./EditModal";

const MyBusinesses = () => {
    const navigate = useNavigate();
    const [business, setBusiness] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getBusinessAndServices = () => {
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
        getBusinessAndServices();
    }, []);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        axiosClient
            .get("/business/delete_listing/" + id)
            .then(({ data }) => {
                setBusiness(business.filter((item) => item.id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleActivate = (id) => {
        axiosClient
            .get("/business/activate_milestone/" + id)
            .then(({ data }) => {
                alert(data.message);
                if (data.status === 200) getBusinessAndServices();

                if (data.status === 404) navigate(`/dashboard/add-milestone`);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSave = () => {
        setBusiness(
            business.map((item) => (item.id === editItem.id ? editItem : item))
        );
        setShowModal(false);
    };

    return (
        <div className="bg-white shadow-md mt-20 rounded-xl w-full px-4 py-6 sm:px-8">
           

            <h1 className="text-[#2D3748] font-semibold text-xl sm:text-2xl mb-6">
                My Businesses
            </h1>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 text-black">
                    {business.length>0 &&
                        <thead className="bg-gray-100">
                        <tr className="text-gray-500">
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                                Amount Required
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                                Details
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    }
                    <tbody className="bg-white divide-y divide-gray-200">
                        {business.map((item) => (
                            <tr key={item.id}>
                                <td className="px-2 sm:px-4 py-4 flex items-center">
                                    <img
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                                        src="https://plus.unsplash.com/premium_photo-1680859126164-ac4fd8f56625?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Business"
                                    />
                                    <div className="ml-3 text-xs sm:text-sm font-medium">
                                        {item.name}
                                    </div>
                                </td>
                                <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                                    {item.category}
                                </td>
                                <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                                    {item.investment_needed}
                                </td>
                                <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                                    {item.details}
                                </td>
                                <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                                    {item.contact}
                                </td>
                                <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm">
                                    <div className="flex space-x-2">
                                        {!item.active && (
                                            <button
                                                onClick={() =>
                                                    handleActivate(item.id)
                                                }
                                                className="text-black py-1 px-2 border rounded-lg hover:underline"
                                            >
                                                Activate
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-black py-1 px-2 border rounded-lg hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="text-red-600 py-1 px-2 border rounded-lg hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
