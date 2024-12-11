import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import ServEditModal from "./ServEditModal";
import { useAlert } from "../../partials/AlertContext";

const ServiceTable = () => {
    const [business, setBusiness] = useState([]);
    const [service, setService] = useState([]);
    const [myInvest, setMyInvest] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null); // To track the selected service for editing
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert

    useEffect(() => {
        const getBusinessAndServices = () => {
            setTimeout(() => {
                axiosClient
                    .get("/business/dashhome")
                    .then(({ data }) => {
                        setBusiness(data.business);
                        setService(data.services);
                        setMyInvest(data.results);
                        console.log("services", data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 500);
        };
        getBusinessAndServices();
    }, []);
    const openEditModal = (service) => {
        setSelectedService(service); // Set the service being edited
        setIsEditModalOpen(true); // Open the modal
    };

    const handleDelete = (id) => {
        axiosClient
            .get("/business/delete_service/" + id)
            .then(({ data }) => {
                setService(service.filter((item) => item.id !== id));
                showAlert("success", "Service deleted successfully.");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="py-4">
            {/* My Investments Section */}

            {/* My Services Section */}
            <section className="bg-white border mt-4 rounded-xl w-full px-4 py-6 sm:px-8 ">
                <h1 className="text-[#2D3748] font-semibold text-xl sm:text-2xl mb-6">
                    My Services
                </h1>
                <div className="overflow-x-auto min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr className="text-gray-500">
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                    Service Fee
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {service.length > 0 ? (
                                service.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 flex items-center space-x-4">
                                            <img
                                                className="w-10 h-10 rounded-lg object-cover"
                                                src={`../${item.image}`}
                                                alt="Service"
                                            />
                                            <div className="text-sm">
                                                <div className="font-medium">
                                                    {item.name}
                                                </div>
                                                <div>{item.contact}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {item.category}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {item.details}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            ${item.price}
                                        </td>
                                        <td className="px-4 py-2 text-center text-sm">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Link
                                                    to={`/service-milestones/${btoa(
                                                        btoa(item.id)
                                                    )}`}
                                                >
                                                    <button className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs hover:bg-green-100">
                                                        View Milestones
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(item)
                                                    } // Trigger modal
                                                    className="text-gray-900 border border-gray-500 rounded-lg py-1 px-3 text-xs hover:bg-gray-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="text-red-500 border border-gray-500 rounded-lg py-1 px-3 text-xs hover:bg-red-100"
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
                                        colSpan="5"
                                        className="px-4 py-6 text-center text-gray-500 text-sm"
                                    >
                                        No services available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {isEditModalOpen && (
                <ServEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        console.log("Closing modal");
                        setIsEditModalOpen(false);
                    }}
                    service={selectedService} // Pass selectedService data
                    onUpdate={(updatedData) => {
                        // Handle updating the service here if needed
                    }}
                />
            )}
        </div>
    );
};

export default ServiceTable;
