import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { useAlert } from "../../partials/AlertContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BarLoader } from "react-spinners";


function InvestmentBids() {
    const [bids, setBids] = useState([]);
    const [selectedBids, setSelectedBids] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingAccept, setLoadingAccept] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
        const [loading, setLoading] = useState(false); // Spinner state
    

    const { showAlert } = useAlert();

    const handleCheckboxChange = (id) => {
        setSelectedBids((prevSelected) => {
            return prevSelected.includes(id)
                ? prevSelected.filter((bidId) => bidId !== id)
                : [...prevSelected, id];
        });
    };

    const AcceptBids = () => {
        setLoadingAccept(true); // Show spinner
        const payload = {
            bid_ids: selectedBids,
            reject: 0,
        };
        console.log(payload);

        axiosClient
            .post("bookingAccepted", payload)
            .then(({ data }) => {
                // Use showAlert to display success message
                showAlert("success", data.message);
            })
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    console.log(err.response.data.errors);
                } else {
                    // Use showAlert to display error message
                    showAlert("error", err.message || "An error occurred");
                }
            })
            .finally(() => {
                setLoadingAccept(false); // Hide spinner
            });
    };

    const RejectBids = () => {
        setLoadingReject(true); // Start loading
        showAlert("info", "Reject functionality coming soon!");
        setLoadingReject(false); // Stop loading
    };

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get("/business/service_booking")
            .then(({ data }) => {
        setLoading(false);

                setBids(data.results);
                console.log(data.results);
            })
            .catch((err) => {
        setLoading(false);

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
        <div className="bg-white shadow-md mt-12 p-12 sm:mt-0 rounded-xl w-full px-0 sm:px-4">
            {" "}
            <h3 className="text-left text-lg font-semibold mb-6">
                Service Booking
            </h3>
            {loading ? (
                <div className="flex justify-start mb-4">
                    <BarLoader color="#38a169" width={150} />
                </div>
            ) : (
                <>
                    {" "}
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
                                        Customer
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
                                        <td className="py-3 px-4 border-b text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedBids.includes(
                                                    bid.id
                                                )}
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
                                                onClick={() =>
                                                    handleDetailsClick(bid)
                                                }
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
                            disabled={
                                loadingAccept || selectedBids.length === 0
                            } // Disable button when loading or no bids selected
                            className={`py-2 px-4 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 
        ${
            loadingAccept || selectedBids.length === 0
                ? "bg-gray-300 text-white cursor-not-allowed" // Gray when inactive
                : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300"
        }`} // Green when active
                        >
                            {loadingAccept ? (
                                <AiOutlineLoading3Quarters
                                    className="animate-spin mr-2"
                                    size={20}
                                />
                            ) : (
                                "Accept Service"
                            )}
                            {loadingAccept && " Accepting..."}
                        </button>

                        <button
                            onClick={() => {
                                if (selectedBids.length > 0) {
                                    setLoadingReject(true); // Start loading
                                    showAlert(
                                        "info",
                                        "Reject functionality coming soon!"
                                    );
                                    setLoadingReject(false); // End loading immediately after showing the alert
                                } else {
                                    showAlert(
                                        "info",
                                        "No bids selected to reject."
                                    );
                                }
                            }}
                            disabled={
                                loadingReject || selectedBids.length === 0
                            } // Disable button during loading or if no bids are selected
                            className={`py-2 px-4 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 
        ${
            loadingReject || selectedBids.length === 0
                ? "bg-gray-300 text-white cursor-not-allowed" // Gray when loading or no bids selected
                : "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300"
        }`} // Red when active
                        >
                            {loadingReject ? (
                                <AiOutlineLoading3Quarters
                                    className="animate-spin mr-2"
                                    size={20}
                                />
                            ) : (
                                "Reject Service"
                            )}
                            {loadingReject && " Rejecting..."}
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
                </>
            )}
        </div>
    );
}

export default InvestmentBids;
