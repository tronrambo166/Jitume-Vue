import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";

function InvestmentBids() {
    const [bids, setBids] = useState([]);
    const [selectedBids, setSelectedBids] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const AcceptBids = reject => e => {
        e.preventDefault();

        const payload = {
            bid_ids: selectedBids,
            reject: reject,
        };
        //alert(reject);

        axiosClient
            .post("bidsAccepted", payload)
            .then(({ data }) => {
                console.log(data);
                //alert(data.message);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
                console.log(err);
            });
    };

    const handleCheckboxChange = (id) => {
        setSelectedBids((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((bidId) => bidId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleInvestorDetails = (bid) => {
        openModal({
            title: "Investor Details",
            body: (
                <div>
                    <p className="my-3">
                        <strong>Full Name:</strong> {bid.investor_name}
                    </p>
                    <p className="my-3">
                        <strong>Investment Range:</strong> {bid.inv_range}
                    </p>
                    <p className="my-3">
                        <strong>Industries Interested:</strong>{bid.interested_cats}
                        
                    </p>
                    <p className="my-3">
                        <strong>Past Investment And Track Record:</strong>{bid.past_investment}
                        
                    </p>
                    <p className="my-3">
                        <strong>Website:</strong>{" "}
                        <a href="{bid.website}" target="_blank">
                           {bid.website}
                        </a>
                    </p>
                    <p>
                        <strong>Email:</strong> viva.malan166@gmail.com
                    </p>
                </div>
            ),
        });
    };

    const handleTypeDetails = (bid) => {
        if (bid.type === "Asset") {
            openModal({
                title: "Asset Details",
                body: (
                    <div>
                        <p>
                            <strong>Download good quality photos of the assets:</strong> Property
                        <img scr={bid.photos[0]} /> </p>
                        <p>
                            <strong>Location:</strong> New York City
                        </p>
                        <p>
                            <strong>Market Value:</strong> $1,000,000
                        </p>
                        <p>
                            <strong>Condition:</strong> Excellent
                        </p>
                    </div>
                ),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    useEffect(() => {
        const getMilestones = (id = "all") => {
            axiosClient
                .get("/business/business_bids")
                .then(({ data }) => {
                    setBids(data.bids);
                    console.log(data.bids)
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getMilestones();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h3 className="text-left text-lg font-semibold mb-6">
                Investment Bids
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
                                Investor
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Business
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Type
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Amount
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                Representation %
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

                                {/* Investor Button */}
                                <td className="py-3 px-4 border-b">
                                    <button
                                        onClick={() =>
                                            handleInvestorDetails(bid)
                                        }
                                        className="bg-white hover:bg-gray-300 text-green-600 font-semibold py-1 px-3 rounded transition-colors"
                                    >
                                        {bid.investor}
                                    </button>
                                </td>

                                <td className="py-3 px-4 border-b">
                                    {bid.business}
                                </td>

                                {/* Type Button */}
                                <td className="py-3 px-4 border-b">
                                    <button
                                        onClick={() => handleTypeDetails(bid)}
                                        className="bg-white hover:bg-gray-300 text-green-600 font-semibold py-1 px-3 rounded transition-colors"
                                    >
                                        {bid.type}
                                    </button>
                                </td>

                                <td className="py-3 px-4 border-b">
                                    ${bid.amount}
                                </td>
                                <td className="py-3 px-4 border-b">
                                    {bid.representation}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-2 pt-3 items-center justify-end">
                <button
                    onClick={AcceptBids(0)}
                    disabled={selectedBids.length === 0}
                    className={`py-2 px-4 rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                        selectedBids.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "btn-primary hover:bg-green-600 focus:ring-green-300"
                    }`}
                >
                    Accept Bids
                </button>

                <button
                    onClick={AcceptBids(1)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                >
                    Reject Bids
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {modalContent?.title}
                        </h3>
                        <div className="mt-2">{modalContent?.body}</div>
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
