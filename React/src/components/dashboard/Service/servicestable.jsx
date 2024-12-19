import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import ServEditModal from "./ServEditModal";
import { useAlert } from "../../partials/AlertContext";
import ReusableTable from "../business/ReusableTable";
import { BsThreeDots } from "react-icons/bs";

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
            .then(() => {
                setService(service.filter((item) => item.id !== id));
                showAlert("success", "Service deleted successfully.");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUpdate = (updatedService) => {
        setService(
            service.map((item) =>
                item.id === updatedService.id ? updatedService : item
            )
        );
        setIsEditModalOpen(false);
    };

    const ActionDropdown = ({ item }) => {
        const [showDropdown, setShowDropdown] = useState(false);

        const toggleDropdown = () => setShowDropdown((prev) => !prev);

        return (
            <div className="relative">
                {/* Three dots button */}
                <button
                    onClick={toggleDropdown}
                    className="p-2 rounded-full hover:bg-gray-200"
                >
                    <BsThreeDots size={20} />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                    <div
                        className="absolute right-0 z-50 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <Link to={`/service-milestones/${btoa(btoa(item.id))}`}>
                            <button className="block w-full px-4 py-2 text-left text-green-500 hover:bg-gray-100">
                                View Milestones
                            </button>
                        </Link>
                        <button
                            onClick={() => {
                                openEditModal(item);
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

    const headers = ["Name", "Category", "Details", "Service Fee", "Actions"];

    // Map service data to match ReusableTable format
    const tableData = service.map((item) => ({
        name: (
            <div className="flex items-center space-x-4">
                <img
                    className="w-10 h-10 rounded-lg object-cover"
                    src={`../${item.image}`}
                    alt="Service"
                />
                <div className="text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div>{item.contact}</div>
                </div>
            </div>
        ),
        category: item.category,
        details: item.details,
        details: (
            <div className="max-w-[170px] truncate overflow-ellipsis">
                {item.details}
            </div>
        ),

        "service fee": (
            <span className="-ml-5">${item.price.toLocaleString()}</span>
        ),

        actions: <ActionDropdown item={item} />,
    }));

    return (
        <div className="py-4 px-[21px]">
            {/* My Services Section */}
            <section className="bg-white border rounded-xl w-full">
                <h1 className="text-[#2D3748] ml-6 mt-6 font-semibold text-xl sm:text-2xl mb-6">
                    My Services
                </h1>
                <ReusableTable
                    headers={headers}
                    data={tableData}
                    rowsPerPage={5}
                    tableId="service-table" // Pass unique table ID
                />
            </section>

            {isEditModalOpen && (
                <ServEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    service={selectedService} // Pass selectedService data
                    onUpdate={handleUpdate} // Update service in state
                />
            )}
        </div>
    );
};

export default ServiceTable;
