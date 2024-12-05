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
            <section className="bg-white border rounded-lg mb-6 px-10 py-6 ">
                <h1 className="text-[#2D3748] font-semibold text-xl mb-3">
                    My Services
                </h1>
                <div className="overflow-x-auto">
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
                            {service.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 flex items-center">
                                        <img
                                            className="w-10 h-10 rounded-lg"
                                            src={"../" + item.image}
                                            alt="Service"
                                        />
                                        <div className="ml-3 text-sm">
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
                                                <button className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                                                    View milestones
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    openEditModal(item)
                                                } // Trigger modal
                                                className="text-gray-900 border border-gray-500 rounded-lg py-1 px-3 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-red-500 border border-gray-500 rounded-lg py-1 px-3 text-xs"
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
            </section>
            <section className="bg-white border rounded-lg mb-6 p-4">
                {myInvest.length > 0 ? (
                    <>
                        <h1 className="text-[#2D3748] font-semibold text-xl mb-3">
                            My Investments
                        </h1>
                        <div className="overflow-x-auto">
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
                                            Value Needed
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Details
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Business Share
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            My Share
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {myInvest.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 text-sm">
                                                {item.name}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.category}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.investment_needed}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.details}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.contact}
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.share}%
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.myShare.toFixed()}%
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                <img
                                                    className="w-10 h-10 rounded-lg"
                                                    src={"../" + item.image}
                                                    alt="Service"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-center text-sm">
                                                <Link
                                                    to={`/business-milestones/${btoa(
                                                        btoa(item.id)
                                                    )}`}
                                                >
                                                    <button className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                                                        View milestones
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-500 text-center">
                        You have no investments.
                    </div>
                )}
            </section>

            {/* My Businesses Section */}
            {/* <section className="bg-white shadow-md rounded-lg mb-6 p-4">
                <h1 className="text-[#2D3748] font-semibold text-xl mb-3">
                    My Businesses
                </h1>
                <div className="overflow-x-auto">
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
                                    Amount
                                </th>
                                <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {business.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 flex items-center">
                                        <img
                                            className="w-10 h-10 rounded-lg"
                                            src={"../" + item.image}
                                            alt="Business"
                                        />
                                        <div className="ml-3 text-sm">
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
                                        {item.amount}
                                    </td>
                                    <td className="px-4 py-2 text-center text-sm">
                                        <Link
                                            to={`/business-milestones/${btoa(
                                                btoa(item.id)
                                            )}`}
                                        >
                                            <button className="text-green-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
                                                View milestones
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section> */}
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
