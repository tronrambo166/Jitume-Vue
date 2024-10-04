import { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
function InvestmentBids() {
    const [bids, setBids] = useState([]);
    const [selectedBids, setSelectedBids] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (id) => {
        setSelectedBids((prevSelected) => {
            return prevSelected.includes(id)
                ? prevSelected.filter((bidId) => bidId !== id)
                : [...prevSelected, id];
        });
    };

    const AcceptBids = () => {
        setLoading(true); // Show spinner
        const payload = {
            bid_ids: selectedBids,
            reject: 0,
        };
        console.log(payload);
        axiosClient
            .post("bookingAccepted", payload)
            .then(({ data }) => {
                // alert(data.message);
                toast.success(data.message);
            })
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    console.log(err.response.data.errors);
                } else {
                    // console.log(err);
                    toast.error(err);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        axiosClient
            .get("/business/service_booking")
            .then(({ data }) => {
                setBids(data.results);
                console.log(data.results);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleDetailsClick = (bid) => {
        openModal({
            title: "Details",
            body: (
                <div className="space-y-4">
                    <p>
                        <strong>Customer Name:</strong> {bid.customer_name}
                    </p>

                    <p>
                        <strong>Customer email:</strong> {bid.email}
                    </p>
                    <p>
                        <strong>Service Name:</strong> {bid.service}
                    </p>
                    <p>
                        <strong>Date:</strong> {bid.date}
                    </p>
                </div>
            ),
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    return (
        <div className="container mx-auto p-6">
            <ToastContainer />
            <h3 className="text-left text-lg font-semibold mb-6">
                Service Booking
            </h3>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 border-b">
                        <tr className="text-gray-600 text-sm">
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Check
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Date
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Details
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Service
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Customer
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids.map((bid) => (
                            <tr
                                key={bid.id}
                                className="text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 border-b text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedBids.includes(bid.id)}
                                        onChange={() =>
                                            handleCheckboxChange(bid.id)
                                        }
                                        className="form-checkbox h-4 w-4 text-green"
                                    />
                                </td>
                                <td className="py-3 px-4 border-b">
                                    {bid.date}
                                </td>
                                <td className="py-3 px-4 border-b">
                                    <button
                                        onClick={() => handleDetailsClick(bid)}
                                        className="bg-white border-2 border-green-600 hover:bg-green-50 text-green-600 font-semibold py-1 px-3 rounded transition-colors"
                                    >
                                        Details
                                    </button>
                                </td>
                                <td className="py-3 px-4 border-b">
                                    {bid.service}
                                </td>
                                <td className="py-3 px-4 border-b">
                                    {bid.customer_name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex gap-2 pt-3 items-center justify-end">
                <button
                    onClick={AcceptBids}
                    disabled={loading} // Disable button when loading
                    className="bg-green text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors flex items-center justify-center"
                >
                    {loading ? (
                        <AiOutlineLoading3Quarters
                            className="animate-spin mr-2"
                            size={20}
                        />
                    ) : (
                        "Accept Bids"
                    )}
                    {loading && "Accepting..."}
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors">
                    Reject Bids
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-3/4 max-w-2xl max-h-[80%] p-6 overflow-y-auto">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            {modalContent?.title}
                        </h3>
                        <div className="mt-2 text-gray-700 space-y-4">
                            {modalContent?.body}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InvestmentBids;
