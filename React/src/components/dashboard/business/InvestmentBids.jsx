import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAlert } from "../../partials/AlertContext";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { GrDocumentDownload } from "react-icons/gr";
function InvestmentBids() {
    const [bids, setBids] = useState([]);
    const [assetBids, setAssetBids] = useState([]);
    const [selectedBids, setSelectedBids] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingAccept, setLoadingAccept] = useState(false); // Added missing state
    const [loadingReject, setLoadingReject] = useState(false); // Added missing state
    const { showAlert } = useAlert(); // Destructuring showAlert from useAlert
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setIsImageModalOpen(false);
    };
    const AcceptBids = (reject) => (e) => {
        e.preventDefault();

        // Set loading states based on the action
        if (reject === 0) {
            setLoadingAccept(true);
        } else {
            setLoadingReject(true);
        }

        const payload = {
            bid_ids: selectedBids,
            reject: reject,
        };

        axiosClient
            .post("bidsAccepted", payload)
            .then(({ data }) => {
                console.log(data); // Log response data
                showAlert("success", data.message); // Show success alert
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors); // Log validation errors
                    showAlert("error", response.data.errors.join(", ")); // Show validation errors
                } else {
                    console.log(err); // Log general errors
                    showAlert(
                        "error",
                        "An error occurred while processing your request."
                    ); // Show generic error message
                }
            })
            .finally(() => {
                // Reset loading states
                if (reject === 0) {
                    setLoadingAccept(false);
                } else {
                    setLoadingReject(false);
                }
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

    //DOWNLOAD
    const download = (doc) => (e) => {
        axiosClient({
            url: "download_bids_doc/" + btoa(doc), //your url
            method: "GET",
            responseType: "blob",
        }).then((data) => {
            console.log(data);
            if (data.data.size == 3) {
                $.alert({
                    title: "Alert!",
                    content:
                        "The business has no such document or the file not found!",
                    type: "red",
                    buttons: {
                        tryAgain: {
                            text: "Close",
                            btnClass: "btn-red",
                            action: function () {},
                        },
                    },
                });
            } //console.log(data);
            else {
                const href = URL.createObjectURL(data.data);
                const link = document.createElement("a");
                link.href = href;
                const type = data.data.type;

                if (type.includes("image"))
                    link.setAttribute("download", "image.jpg");
                else if (
                    data.data.type ==
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
                    link.setAttribute("download", "document.docx");
                //or any other extension
                else link.setAttribute("download", "document.pdf");

                document.body.appendChild(link);
                link.click();
            }
        });
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
                        <strong>Industries Interested:</strong>{" "}
                        {bid.interested_cats}
                    </p>
                    <p className="my-3">
                        <strong>Past Investment And Track Record:</strong>{" "}
                        {bid.past_investment}
                    </p>
                    <p className="my-3">
                        <strong>Website:</strong>{" "}
                        <a
                            href={bid.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
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
                    <div className="p-6  rounded-lg  space-y-6 max-w-4xl mx-auto">
                        {/* Title */}
                        <div>
                            <p className="font-bold text-xl mb-4">
                                Download High-Quality Photos:
                            </p>
                        </div>

                        {/* Images Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {bid.photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center space-y-2"
                                >
                                    <img
                                        src={photo}
                                        alt={`Asset ${index + 1}`}
                                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                                    />
                                    <button
                                        onClick={() => download(photo)()}
                                        className="flex items-center space-x-2 ml-10 bg-green text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        <FaCloudDownloadAlt className="text-xl" />
                                        <span>Download</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Legal Document Section */}
                        <div>
                            <p className="font-bold text-xl mb-4">
                                Download Legal Document:
                            </p>
                            <button
                                onClick={() => download(bid.legal_doc)()}
                                className="flex items-center space-x-2 bg-green text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                <GrDocumentDownload className="text-xl" />
                                <span>Download Document</span>
                            </button>
                        </div>

                        {/* Serial Information */}
                        <div>
                            <p className="font-bold text-xl">
                                Serial:{" "}
                                <span className="font-normal text-gray-700">
                                    {bid.serial}
                                </span>
                            </p>
                        </div>
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
        const PendingBids = (id = "all") => {
            axiosClient
                .get("/business/business_bids")
                .then(({ data }) => {
                    setBids(data.bids);
                    console.log(data.bids);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const AssetBids = () => {
            axiosClient
                .get("/business/asset_bids")
                .then(({ data }) => {
                    setAssetBids(data.bids);
                    console.log(data.bids);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        PendingBids();
        AssetBids();
        console.log("asset", assetBids);
    }, []);
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.map((row) => row.id)); // Assuming 'id' is unique for each row
        }
        setSelectAll(!selectAll);
    };

    // Togle switch event here
    const [showInvestmentBids, setShowInvestmentBids] = useState(true);

    const toggleBids = () => {
        setShowInvestmentBids(!showInvestmentBids);
    };

    return (
        <div className="container mx-auto p-0 sm:p-6 mt-12 sm:mt-0">
            {" "}
            {/* <h3 className="text-left text-lg font-semibold mb-6">
                Investment Bids
            </h3> */}
            <div className="flex justify-start gap-6 items-center mb-6">
                <h3
                    onClick={toggleBids}
                    className={`text-lg font-semibold cursor-pointer border-b-2 ${
                        showInvestmentBids
                            ? "text-green border-green"
                            : "text-gray-500 border-transparent"
                    } transition-all`}
                >
                    Investment Bids
                </h3>

                <h3
                    onClick={toggleBids}
                    className={`text-lg font-semibold cursor-pointer border-b-2 ${
                        !showInvestmentBids
                            ? "text-green border-green"
                            : "text-gray-500 border-transparent"
                    } transition-all`}
                >
                    Ongoing Asset Bids
                </h3>
            </div>
            {showInvestmentBids ? (
                <div>
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
                                    <th className="text-left py-3 px-8 uppercase font-semibold text-[12px]">
                                        Investor
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                        Business
                                    </th>
                                    <th className="py-3 px-8 text-left  uppercase font-semibold text-[12px]">
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

                                        <td className="py-3 px-4 border-b text-left">
                                            {bid.date}
                                        </td>

                                        {/* Investor Button */}
                                        <td className="py-3 px-4 border-b text-left">
                                            <button
                                                onClick={() =>
                                                    handleInvestorDetails(bid)
                                                }
                                                className="bg-white hover:bg-gray-300 text-green-600 font-semibold py-1 px-3 rounded transition-colors"
                                            >
                                                {bid.investor}
                                            </button>
                                        </td>

                                        <td className="py-3 px-4 border-b text-left">
                                            {bid.business}
                                        </td>

                                        {/* Type Button */}
                                        <td className="py-3 px-4 border-b text-left">
                                            <button
                                                onClick={() =>
                                                    handleTypeDetails(bid)
                                                }
                                                className="bg-white hover:bg-gray-300 text-green-600 font-semibold py-1 px-3 rounded transition-colors"
                                            >
                                                {bid.type == "Asset"
                                                    ? "Equipment"
                                                    : bid.type}
                                            </button>
                                        </td>

                                        <td className="py-3 px-4 border-b text-left">
                                            ${bid.amount.toLocaleString()}
                                        </td>

                                        <td className="py-3 px-4 border-b text-left">
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
                            disabled={
                                selectedBids.length === 0 || loadingAccept
                            }
                            className={`py-2 px-4 rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                                selectedBids.length === 0 || loadingAccept
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "btn-primary hover:bg-green-600 focus:ring-green-300"
                            }`}
                        >
                            {loadingAccept ? (
                                <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" />
                            ) : null}
                            {loadingAccept ? "Accepting..." : "Accept Bids"}
                        </button>

                        <button
                            onClick={AcceptBids(1)} // Ensure this calls the correct reject handler
                            disabled={
                                selectedBids.length === 0 || loadingReject
                            } // Disable if no bids are selected
                            className={`py-2 px-4 rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                                selectedBids.length === 0
                                    ? "bg-gray-300 cursor-not-allowed" // Gray when no bids selected
                                    : "bg-red-500 hover:bg-red-600 focus:ring-red-300" // Red when bids selected
                            }`}
                        >
                            {loadingReject ? (
                                <AiOutlineLoading3Quarters className="animate-spin inline-block mr-2" />
                            ) : null}
                            {loadingReject ? "Rejecting..." : "Reject Bids"}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    {" "}
                    {/* Asset Bids*/}
                    {/* <h3 className="text-left text-lg font-semibold mb-6">
                        Ongoing Asset Bids
                    </h3> */}
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 border-b">
                                <tr className="text-gray-600 text-sm">
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                        Date
                                    </th>
                                    <th className="text-left py-3 px-8 uppercase font-semibold text-[12px]">
                                        Investor
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                        Business
                                    </th>
                                    <th className="py-3 px-8 text-left  uppercase font-semibold text-[12px]">
                                        Type
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                        Amount
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                        Representation %
                                    </th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-[12px]">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {assetBids.map((bid) => (
                                    <tr
                                        key={bid.id}
                                        className="text-gray-500 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-3 px-4 border-b text-left">
                                            {bid.date}
                                        </td>

                                        {/* Investor Button */}
                                        <td className="py-3 px-4 border-b text-left">
                                            <button className="bg-white hover:bg-gray-300 text-green-600 font-semibold py-1 px-3 rounded transition-colors">
                                                {bid.investor}
                                            </button>
                                        </td>

                                        <td className="py-3 px-4 border-b text-left">
                                            {bid.business}
                                        </td>

                                        {/* Type Button */}
                                        <td className="py-3 px-4 border-b text-left">
                                            <button
                                                onClick={() =>
                                                    handleTypeDetails(bid)
                                                }
                                                className="bg-white hover:bg-gray-300 text-green-600 font-semibold py-1 px-3 rounded transition-colors"
                                            >
                                                Equipment
                                            </button>
                                        </td>

                                        <td className="py-3 px-4 border-b text-left">
                                            ${bid.amount.toLocaleString()}
                                        </td>

                                        <td className="py-3 px-4 border-b text-left">
                                            {bid.representation}%
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            <p className="text-green-500 font-bold">
                                                {" "}
                                                {bid.status}{" "}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* Asset Bids */}
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
