import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import ServEditModal from "./ServEditModal";
import { useAlert } from "../../partials/AlertContext";

const MyInvest = () => {
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
                        console.log("My Invest", data);
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
            <section className="bg-white border mt-4 rounded-xl w-full px-4 py-6 sm:px-8">
                {myInvest.length > 0 ? (
                    <>
                        <h1 className="text-[#2D3748] font-semibold text-xl sm:text-2xl mb-6">
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
                                            Contact
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Amount
                                        </th>

                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Business Share
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            My Share
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                            Status
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
                                                {item.contact}
                                            </td>

                                            <td className="px-4 py-2 text-sm">
                                                {item.amount}
                                            </td>

                                            <td className="px-4 py-2 text-sm">
                                                {item.share}%
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                {item.myShare.toFixed()}%
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                                <p className="text-green-500 font-bold"> {item.status} </p>
                                            </td>
                                            <td className="px-4 py-2 text-center text-sm">
                                                <Link
                                                    to={`/business-milestones/${btoa(
                                                        btoa(item.id)
                                                    )}`}
                                                >
                                                    <button className="text-yellow-500 border border-green-500 rounded-lg py-1 px-3 text-xs">
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

export default MyInvest;
